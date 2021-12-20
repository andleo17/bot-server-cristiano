import ytdl from 'discord-ytdl-core';
import ytSearch, { VideoSearchResult } from 'yt-search';
import {
	StreamType,
	createAudioPlayer,
	createAudioResource,
	joinVoiceChannel,
	AudioPlayerStatus,
} from '@discordjs/voice';
import { Command } from '../../structures/Command';
import { MessageActionRow, MessageButton, MessageEmbed } from 'discord.js';
import { formatSeconds } from '../../utils/formatSeconds';

async function searchSong(song: string) {
	try {
		const foundVideos = await ytSearch(song);
		return foundVideos.videos.shift();
	} catch (error) {
		console.log(error);
		return null;
	}
}

function listQueue(queue: VideoSearchResult[]): string {
	return queue
		.map((q, i) => {
			const title =
				q.title.length <= 35 ? q.title : q.title.substring(0, 35) + '...';
			const author =
				q.author.name.length <= 35
					? q.author.name
					: q.author.name.substring(0, 35) + '...';
			return `**[${i + 1}]** [${title}](${q.url}) - [${author}](${
				q.author.url
			}) [${q.duration.timestamp}]`;
		})
		.join('\n');
}

export default new Command({
	name: 'play',
	description: 'Reproduce música de YouTube',
	options: [
		{
			type: 'STRING',
			name: 'canción',
			description: 'Ingresa el título de la canción o una URL',
			required: true,
		},
	],
	run: async ({ interaction }) => {
		try {
			const voiceChannel = interaction.member.voice.channel;
			if (!voiceChannel)
				return interaction.reply({
					content: 'Debes conectarte a un canal de voz pe ctmr',
					ephemeral: true,
				});

			const songName = interaction.options.getString('canción');
			const video = await searchSong(songName);
			if (!video) {
				return interaction.reply({
					content: `No se encontraron para *${songName}*`,
					ephemeral: true,
				});
			}

			const stream = ytdl(video.url, {
				filter: 'audioonly',
				opusEncoded: true,
				encoderArgs: ['-af', 'bass=g=2'],
			});
			const connection = joinVoiceChannel({
				channelId: voiceChannel.id,
				guildId: interaction.guildId,
				adapterCreator: interaction.guild.voiceAdapterCreator,
			});

			const resource = createAudioResource(stream, {
				inputType: StreamType.Opus,
			});
			const player = createAudioPlayer();

			player.play(resource);
			connection.subscribe(player);

			const pseudoQueue: VideoSearchResult[] = [];
			pseudoQueue.push(video);
			const queueDuration = pseudoQueue.reduce(
				(total, q) => total + q.duration.seconds,
				0
			);

			const playerRowButtons = new MessageActionRow().addComponents(
				new MessageButton()
					.setLabel('Pausar')
					.setStyle('SUCCESS')
					.setCustomId('MUSIC_PAUSE'),
				new MessageButton()
					.setLabel('Saltar')
					.setStyle('PRIMARY')
					.setCustomId('MUSIC_SKIP'),
				new MessageButton()
					.setLabel('Detener')
					.setStyle('DANGER')
					.setCustomId('MUSIC_STOP'),
				new MessageButton()
					.setLabel('Lista')
					.setStyle('SECONDARY')
					.setCustomId('MUSIC_SHOWQUEUE')
			);

			const playerEmbed = new MessageEmbed()
				.setTitle('Lista de reproducción 🎵')
				.setDescription(listQueue(pseudoQueue))
				.setColor('DARK_BLUE')
				.setFooter(
					`Agregado por: ${interaction.member.nickname}`,
					interaction.member.avatarURL()
				)
				.addFields([
					{
						name: 'Duración total',
						value: formatSeconds(queueDuration),
					},
				]);

			interaction.reply({
				embeds: [playerEmbed],
				components: [playerRowButtons],
			});

			player.on(AudioPlayerStatus.Idle, () => connection.destroy());
		} catch (error) {
			console.error(error);
		}
	},
});
