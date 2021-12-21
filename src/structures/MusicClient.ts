import {
	AudioPlayer,
	AudioPlayerStatus,
	createAudioPlayer,
	createAudioResource,
	DiscordGatewayAdapterCreator,
	joinVoiceChannel,
	StreamType,
	VoiceConnection,
} from '@discordjs/voice';
import {
	CommandInteraction,
	Message,
	MessageActionRow,
	MessageButton,
	MessageEmbed,
	MessageOptions,
} from 'discord.js';
import ytSearch, { VideoSearchResult } from 'yt-search';
import ytdl from 'discord-ytdl-core';
import { formatSeconds } from '../utils/formatSeconds';
import { MyBot } from './MyBot';

export default class MusicClient {
	private static client: MusicClient;
	private queue: VideoSearchResult[];
	private currentSong: VideoSearchResult;
	private player: AudioPlayer;
	private connection: VoiceConnection;
	private messagePlayer: Message;

	private constructor() {}

	public static getInstance(): MusicClient {
		if (!this.client) {
			this.client = new MusicClient();
		}
		return this.client;
	}

	public getCurrentSong() {
		return this.currentSong;
	}

	public connectToVoiceChannel(channelId: string) {
		if (!this.connection) {
			const bot = MyBot.getInstance();
			const guildId = process.env.GUILD_ID;
			const guild = bot.guilds.cache.find((g) => g.id === guildId);

			this.connection = joinVoiceChannel({
				channelId,
				guildId,
				adapterCreator: guild.voiceAdapterCreator,
			});

			this.player = createAudioPlayer();

			this.connection.subscribe(this.player);

			this.player.on(AudioPlayerStatus.Idle, () => {
				this.skip();
			});
		}
	}

	public disconnect() {
		this.stop();
		this.connection.destroy();
		MusicClient.destroy();
	}

	public async searchSong(title: string): Promise<VideoSearchResult> {
		try {
			const foundVideos = await ytSearch({ search: title, category: 'music' });
			return foundVideos.videos.shift();
		} catch (error) {
			console.log(error);
			return null;
		}
	}

	public listQueue(): string {
		const maxLength = 45;
		return this.queue
			.map((q, i) => {
				const title =
					q.title.length <= maxLength
						? q.title
						: q.title.substring(0, maxLength) + '...';
				return `**[${i + 1}]** [${title}](${q.url}) [${q.timestamp}]`;
			})
			.join('\n');
	}

	public getQueue(): VideoSearchResult[] {
		return this.queue;
	}

	public setMessagePlayer(messagePlayer: Message) {
		if (messagePlayer.inGuild()) this.messagePlayer = messagePlayer;
	}

	private generateCurrentSongFormat(): string {
		const song = this.currentSong;
		return song.title;
	}

	private generatePlayerEmbed(): MessageEmbed {
		const queueDuration = this.queue.reduce((total, q) => total + q.seconds, 0);
		return new MessageEmbed()
			.setTitle('Lista de reproducción 🎵')
			.setDescription(this.listQueue())
			.setColor('DARK_BLUE')
			.addField('Sonando ahora', this.generateCurrentSongFormat())
			.addFields([
				{
					name: 'Duración total',
					value: formatSeconds(queueDuration),
				},
			]);
	}

	private generatePlayerButtons(): MessageActionRow {
		return new MessageActionRow().addComponents(
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
				.setLabel('Mostrar letra')
				.setStyle('SECONDARY')
				.setCustomId('MUSIC_SHOWLYRICS')
		);
	}

	public generatePlayer(): MessageOptions {
		return {
			embeds: [this.generatePlayerEmbed()],
			components: [this.generatePlayerButtons()],
		};
	}

	private play(song: VideoSearchResult) {
		const stream = ytdl(song.url, {
			filter: 'audioonly',
			opusEncoded: true,
			encoderArgs: ['-af', 'bass=g=2'],
		});

		const resource = createAudioResource(stream, {
			inputType: StreamType.Opus,
		});
		this.player.play(resource);
	}

	public pause() {
		this.player.pause();
	}

	public resume() {
		this.player.unpause();
	}

	public stop() {
		this.connection.destroy();
		this.player.removeAllListeners();
		this.player.stop();
		this.messagePlayer.delete();
		MusicClient.destroy();
	}

	public static destroy() {
		this.client = null;
	}

	public skip(): boolean {
		const nextSong = this.queue[1];
		if (!nextSong) {
			this.stop();
			return false;
		}
		this.deleteSong(this.currentSong);
		this.currentSong = nextSong;
		this.messagePlayer.edit(this.generatePlayer());
		this.play(nextSong);
		return true;
	}

	public async addSong(
		song: VideoSearchResult,
		isCurrent: boolean = true
	): Promise<Message<true>> {
		try {
			if (!this.queue) this.queue = [];

			if (isCurrent === null || isCurrent) {
				this.queue.unshift(song);
				this.currentSong = song;
				this.play(song);
			} else {
				this.queue.push(song);
			}

			if (!this.messagePlayer?.inGuild()) {
				return null;
			}

			return this.messagePlayer;
		} catch (error) {
			console.error(error);
			return null;
		}
	}

	public deleteSong(song: VideoSearchResult): boolean {
		try {
			const songIndex = this.queue.findIndex((s) => s.videoId === song.videoId);
			if (songIndex === -1) {
				return false;
			}
			this.queue.splice(songIndex, 1);
			return true;
		} catch (error) {
			console.error(error);
			return false;
		}
	}
}
