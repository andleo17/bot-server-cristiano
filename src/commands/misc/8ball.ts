import { MessageEmbed } from 'discord.js';
import { Command } from '../../structures/Command';

export default new Command({
	name: '8ball',
	description: 'Deja que el bot responda a tu pregunta.',
	options: [
		{
			name: 'pregunta',
			description: 'Lo que quieres preguntar',
			type: 'STRING',
			required: true,
		},
	],
	run: async ({ client, interaction }) => {
		await interaction.deferReply();
		// const answers: string[] = [
		// 	'Claro pe mano',
		// 	'Nada mano',
		// 	'Anda enfermito',
		// 	'Tu jefa',
		// 	'Cualquiera de tu familia menos tú (incluído el perro)',
		// 	'No sé, pregúntale a tu vieja',
		// 	'Cualquier cosa la Adriana pes',
		// 	'¿Te has fumado la de Nagani no?',
		// 	'Mucho dendro',
		// 	'Anda con tus amigos los tunos',
		// 	'Brawer me la come',
		// 	'JOHN WAYLER LIMA CAMIZÁN',
		// ];
		const defaultAnswers = ['Sí :D', 'No :('];
		const guildConfig = await client.db.guildConfig.findUnique({
			where: { guildId: interaction.guildId },
		});
		const question = interaction.options.getString('pregunta');
		const answers =
			guildConfig?.eightBallAnswers.length > 0
				? guildConfig.eightBallAnswers
				: defaultAnswers;

		const randomAnswer = answers[Math.floor(Math.random() * answers.length)];

		const answerEmbed = new MessageEmbed()
			.setAuthor({
				name: `${interaction.member.displayName} preguntó`,
				iconURL: interaction.member.displayAvatarURL(),
			})
			.setDescription(question)
			.addField('Respuesta:', randomAnswer);

		await interaction.editReply({ embeds: [answerEmbed] });
	},
});
