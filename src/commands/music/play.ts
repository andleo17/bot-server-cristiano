import { Message, MessageEmbed } from 'discord.js';
import { Command } from '../../structures/Command';
import MusicClient from '../../structures/MusicClient';

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
		{
			type: 'BOOLEAN',
			name: 'ahora',
			description:
				'Indica si quieres que suene ahora mismo o que se agregue a la cola',
			required: false,
		},
	],
	run: async ({ client, interaction }) => {
		try {
			await interaction.deferReply();

			const voiceChannel = interaction.member.voice.channel;
			if (!voiceChannel)
				return interaction.reply({
					content: 'Debes conectarte a un canal de voz pe ctmr',
					ephemeral: true,
				});
			const music = MusicClient.getInstance();
			const songName = interaction.options.getString('canción');
			const playNow = interaction.options.getBoolean('ahora');
			const song = await music.searchSong(songName);

			if (!song) {
				return interaction.reply({
					content: `No se encontraron para *${songName}*`,
					ephemeral: true,
				});
			}

			music.connectToVoiceChannel(voiceChannel.id);
			const messagePlayer = await music.addSong(song, playNow);
			const player = music.generatePlayer();

			if (!messagePlayer) {
				const musicChannel = await client.db.musicConfig.findFirst();
				let message: Message;
				if (musicChannel) {
					const channelMusicInGuild = await interaction.guild.channels.fetch(
						musicChannel.channelId
					);

					if (!channelMusicInGuild.isText())
						return interaction.editReply({
							content: '¡Error! El canal configurado no es un canal de texto',
						});

					message = await channelMusicInGuild.send(player);
				} else {
					message = await interaction.channel.send(player);
				}
				music.setMessagePlayer(message);
			} else {
				messagePlayer.edit(player);
			}

			const songAddedEmbed = new MessageEmbed()
				.setTitle('Canción agregada correctamente')
				.addField('Nombre', song.title)
				.addField('Duración', song.duration.timestamp)
				.setFooter(
					`Añadido por: ${interaction.member.displayName}`,
					interaction.member.displayAvatarURL()
				);

			interaction.editReply({
				embeds: [songAddedEmbed],
			});
		} catch (error) {
			console.error(error);
			interaction.editReply('Hubo un error al ejecutar el comando');
		}
	},
});
