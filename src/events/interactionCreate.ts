import { Interaction } from 'discord.js';
import { Event } from '../structures/Event';

export default new Event(
	'interactionCreate',
	async (client, interaction: Interaction<'cached'>) => {
		if (interaction.isCommand()) {
			await interaction.deferReply();
			const command = client.commands.get(interaction.commandName);
			if (!command) return interaction.followUp('El comando no existe');

			command.run({ client, interaction });
		}
	}
);
