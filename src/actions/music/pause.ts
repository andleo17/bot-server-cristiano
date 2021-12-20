import { getVoiceConnection, VoiceConnectionStatus } from '@discordjs/voice';
import { MessageButton } from 'discord.js';
import { Action } from '../../structures/Action';

export default new Action({
	id: 'MUSIC_PAUSE',
	run: ({ interaction }) => {
		try {
			const playerRow = interaction.message.components[0];
			const pauseButton = new MessageButton()
				.setLabel('Reproducir')
				.setStyle('SUCCESS')
				.setCustomId('MUSIC_RESUME');

			const newPlayerRow = playerRow.spliceComponents(0, 1, pauseButton);

			const playerVoiceChannel = getVoiceConnection(interaction.guild.id);

			if (playerVoiceChannel.state.status === VoiceConnectionStatus.Ready) {
				const player = playerVoiceChannel.state.subscription.player;
				player.pause();
				interaction.update({
					embeds: interaction.message.embeds,
					components: [newPlayerRow],
				});
			}
		} catch (error) {
			console.error(error);
		}
	},
});
