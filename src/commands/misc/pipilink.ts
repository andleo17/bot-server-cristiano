import { Command } from '../../structures/Command';
import path from 'path';

export default new Command({
	name: 'pipilink',
	description: 'Sorpresa',
	run: async ({ interaction }) => {
		try {
			await interaction.reply({
				files: [path.join(__dirname, './../../../assets/images/pipilink.png')],
			});
		} catch (error) {
			console.error(error);
		}
	},
});
