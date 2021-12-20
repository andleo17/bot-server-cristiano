import { getVoiceConnection } from '@discordjs/voice';
import { MessageEmbed } from 'discord.js';
import { Action } from '../../structures/Action';

export default new Action({
	id: 'MUSIC_STOP',
	run: async ({ interaction }) => {
		try {
			const playerVoiceChannel = getVoiceConnection(interaction.guild.id);
			playerVoiceChannel.destroy();
			await interaction.message.delete();

			const playerDestroyedEmbed = new MessageEmbed().setTitle(
				'Reproductor apagado. Ya safé'
			);

			const playerDestroyedEmbedSend = await interaction.channel.send({
				embeds: [playerDestroyedEmbed],
			});

			setTimeout(() => {
				playerDestroyedEmbedSend.delete();
			}, 5 * 1000); // Borra el mensaje después de 5 segundos
		} catch (error) {
			console.error(error);
		}
	},
});
