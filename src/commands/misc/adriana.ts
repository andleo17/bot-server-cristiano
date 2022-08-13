import { Command } from '../../structures/Command';

export default new Command({
	name: 'secreto',
	description: 'secreto',
	run: async ({ interaction }) => {
		// const members = await interaction.guild.members.fetch();
		// await interaction.guild.setName('Servidor de Adriana');
		// await interaction.channel.edit({ topic: 'Adriana Iriarte' });
		// members.forEach(async (m) => {
		// 	try {
		// 		await m.setNickname('Adriana Iriarte');
		// 	} catch (error) {
		// 		console.log(
		// 			'No se puede cambiar de nickname a este usuario:',
		// 			m.displayName
		// 		);
		// 	}
		// });

		const channels = await interaction.guild.channels.fetch();

		channels.forEach(async (c) => {
			try {
				await c.setName('Adriana Iriarte');
			} catch (error) {
				console.log('No se puede cambiar de nombre a este canal:', c.name);
			}
		});

		await interaction.guild.setIcon(
			'https://cdn.discordapp.com/attachments/955212483872829480/963216483046023208/received_278944396031240.jpeg'
		);

		return interaction.reply({ ephemeral: true, content: 'Adriana Iriarte' });
	},
});
