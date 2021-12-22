import { MessageEmbed } from 'discord.js';
import { Action } from '../../structures/Action';
import MusicClient from '../../structures/MusicClient';

export default new Action({
	id: 'MUSIC_STOP',
	run: async ({ interaction }) => {
		try {
			MusicClient.getInstance().stop();

			const conchasumareMessage = await interaction.channel.send({
				content: `Este conchasumare paró la bulla: ${interaction.member}`,
			});

			const playerDestroyedEmbed = new MessageEmbed().setTitle(
				'Reproductor apagado. Ya safé'
			);

			const playerDestroyedEmbedSend = await interaction.channel.send({
				embeds: [playerDestroyedEmbed],
			});

			setTimeout(() => {
				playerDestroyedEmbedSend.delete();
			}, 5 * 1000); // Borra el mensaje después de 5 segundos

			setTimeout(() => {
				conchasumareMessage.delete();
			}, 10 * 1000); // Borra el mensaje después de 10 segundos
		} catch (error) {
			console.error(error);
		}
	},
});
