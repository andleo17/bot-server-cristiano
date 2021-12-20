import { Message } from 'discord.js';
import { Event } from '../structures/Event';

export default new Event(
	'messageCreate',
	async (client, message: Message<true>) => {
		if (message.author.bot) return;
		const messageFound = client.getMessageHandler(message.content);
		if (!messageFound) return;
		messageFound.run({ client, message });
	}
);
