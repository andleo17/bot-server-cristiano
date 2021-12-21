import { MessageEmbed } from 'discord.js';
import { Action } from '../../structures/Action';
import MusicClient from '../../structures/MusicClient';

export default new Action({
	id: 'MUSIC_SKIP',
	run: async ({ interaction }) => {
		try {
			const currentSong = MusicClient.getInstance().skip();
			const playerResponseEmbed = new MessageEmbed();
			if (!currentSong) {
				playerResponseEmbed.setDescription(
					'Ya no hay nada más que reproducir :C'
				);
			} else {
				playerResponseEmbed.setDescription('Canción skipeada.');
			}
			const playerResponseEmbedMessage = await interaction.channel.send({
				embeds: [playerResponseEmbed],
			});

			setTimeout(() => {
				playerResponseEmbedMessage.delete();
			}, 5 * 1000); // Borra el mensaje después de 5 segundos

			interaction.deferUpdate();
		} catch (error) {
			console.error(error);
		}
	},
});
