import { Event } from '../structures/Event';

export default new Event('guildMemberAdd', (_, member) => {
	console.log(member.nickname);
});
