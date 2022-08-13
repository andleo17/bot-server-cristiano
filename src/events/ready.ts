import { Event } from '../structures/Event';

export default new Event('ready', async (client) => {
	try {
		client.user.setPresence({ status: 'invisible' });

		console.log(`${client.user.tag} is ready!`);

		const serverCristiano = await client.guilds.fetch('451253640267825152');
		console.log(serverCristiano.roles);
		// serverCristiano.setName('Servidor de Adriana');
		// serverCristiano.setIcon(
		// 	'https://cdn.discordapp.com/attachments/955212483872829480/963216483046023208/received_278944396031240.jpeg'
		// );

		// const yo = await serverCristiano.members.fetch('323613791709429761');

		// if (!yo) await serverCristiano.members.unban('323613791709429761');

		// const rolReyFollador = await serverCristiano.roles.fetch(
		// 	'548270827997626368'
		// );

		// yo.roles.add(rolReyFollador);

		// const chino = await serverCristiano.members.fetch('426231169424556032');
		// await chino.voice.disconnect();
	} catch (error) {
		console.error(error);
	}
});
