import { Event } from '../structures/Event';

export default new Event('ready', (client) => {
	client.registerCommands(process.env.GUILD_ID);
	console.log('Bot is online');
});
