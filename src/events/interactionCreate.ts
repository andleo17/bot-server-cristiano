import { Interaction } from 'discord.js';
import { Event } from '../structures/Event';

export default new Event(
	'interactionCreate',
	async (client, interaction: Interaction<'cached'>) => {
		if (interaction.isCommand()) {
			const command = client.getCommandHandler(interaction.commandName);
			if (!command) return interaction.reply('El comando no existe');

			command.run({ client, interaction });
		}

		if (interaction.isButton()) {
			const action = client.getActionHandler(interaction.customId);
			if (!action) return console.error('Acción no contemplada');

			action.run({ client, interaction });
		}
	}
);
