import { Guild, MessageEmbed } from 'discord.js';
import { Action } from '../../structures/Action';

export default new Action({
	id: 'MUSIC_SKIP',
	run: async ({ client, interaction }) => {
		try {
			const currentSong = client.distube.skip(process.env.GUILD_ID);
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
