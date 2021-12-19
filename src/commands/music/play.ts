import { Command } from '../../structures/Command';

export default new Command({
	name: 'play',
	description: 'Reproduce música de YouTube',
	run: async ({ interaction }) => {
		return interaction.reply('Aún en construcción');
	},
});
