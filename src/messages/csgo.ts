import { CustomMessage } from '../structures/Message';

export default new CustomMessage({
	text: 'csgo',
	exact: false,
	run: ({ message }) => {
		message.channel.send('Hablen pes cagadas, un csgo');
	},
});
