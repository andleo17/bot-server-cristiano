import { Interaction } from 'discord.js';
import { Event } from '../structures/Event';

export default new Event(
	'interactionCreate',
	async (client, interaction: Interaction<'cached'>) => {
		if (interaction.isCommand()) {
			const command = client.commands.get(interaction.commandName);
			if (!command) return interaction.reply('El comando no existe');

			command.run({ client, interaction });
		}
	}
);
