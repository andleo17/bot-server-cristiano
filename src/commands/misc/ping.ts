import { Command } from '../../structures/Command';

export default new Command({
	name: 'ping',
	description: 'replies with pong',
	run: async ({ interaction }) => {

    const ping = new Date().getTime() - interaction.createdTimestamp;
    interaction.reply((ping - 3500).toString());
	},
});
