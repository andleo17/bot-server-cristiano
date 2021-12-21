import { Action } from '../../structures/Action';
import MusicClient from '../../structures/MusicClient';
import { getLyrics, getSong } from 'genius-lyrics-api';
import { MessageEmbed } from 'discord.js';

export default new Action({
	id: 'MUSIC_SHOWLYRICS',
	run: async ({ interaction }) => {
		try {
			const currentSong = MusicClient.getInstance().getCurrentSong();
			const geniusOptions = {
				apiKey: process.env.GENIUS_LYRICS_API_KEY,
				title: currentSong.title,
				artist: currentSong.author,
				optimizeQuery: true,
			};
			const lyrics = await getLyrics(geniusOptions);
			if (lyrics) {
				const lyricsEmbed = new MessageEmbed()
					.setAuthor('Letra de la canción')
					.setThumbnail(currentSong.thumbnail)
					.setTitle(currentSong.title)
					.setDescription(lyrics);
				await interaction.channel.send({ embeds: [lyricsEmbed] });
				await interaction.deferUpdate();
			} else {
				await interaction.reply({
					target: interaction.member,
					content: 'No pudimos encontrar la letra :c',
					ephemeral: true,
				});
			}
		} catch (error) {
			console.error(error);
		}
	},
});
