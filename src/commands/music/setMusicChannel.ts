import { Command } from '../../structures/Command';

export default new Command({
	name: 'setmusicchannel',
	description:
		'Configura un canal para que el bot de música pueda hacer su spam.',
	options: [
		{
			name: 'canal',
			description: 'Canal en cuestión',
			type: 'CHANNEL',
			required: true,
		},
	],
	run: async ({ client, interaction }) => {
		try {
			await interaction.deferReply({ ephemeral: true });
			const channel = interaction.options.getChannel('canal', true);
			const existMusicChannel = await client.db.musicConfig.findFirst();
			if (existMusicChannel) {
				await client.db.musicConfig.update({
					data: { channelId: channel.id },
					where: { id: existMusicChannel.id },
				});
			} else {
				await client.db.musicConfig.create({ data: { channelId: channel.id } });
			}

			await interaction.editReply({
				content: 'Canal configurado correctamente',
			});
		} catch (error) {
			console.error(error);
		}
	},
});
