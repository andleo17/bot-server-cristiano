import { Action } from '../../structures/Action';
import { getLyrics, getSong } from 'genius-lyrics-api';
import { MessageEmbed } from 'discord.js';

export default new Action({
	id: 'MUSIC_SHOWLYRICS',
	run: async ({ client, interaction }) => {
		try {
			const currentSong = client.distube.queues.get(process.env.GUILD_ID)
				.songs[0];
			const geniusOptions = {
				apiKey: process.env.GENIUS_LYRICS_API_KEY,
				title: currentSong.name,
				artist: currentSong.user,
				optimizeQuery: true,
			};
			const lyrics = await getLyrics(geniusOptions);
			if (lyrics) {
				const lyricsEmbed = new MessageEmbed()
					.setAuthor('Letra de la canción')
					.setThumbnail(currentSong.thumbnail)
					.setTitle(currentSong.name)
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
