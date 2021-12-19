import { Message } from 'discord.js';
import { Event } from '../structures/Event';

export default new Event(
	'messageCreate',
	async (client, message: Message<true>) => {
		if (message.author.bot) return;
		const messageFound = client.messages.find((m) => {
			let tranformedMessage = message.content;
			if (m.ignoreCase) {
				tranformedMessage = tranformedMessage.toLowerCase();
				m.text = m.text.toLowerCase();
			}
			if (!m.exact) {
				tranformedMessage = tranformedMessage.replaceAll(' ', '');
			}

			return tranformedMessage.includes(m.text);
		});
		if (!messageFound) return;
		messageFound.run({ client, message });
	}
);
