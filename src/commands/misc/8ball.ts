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
	run: async ({ interaction }) => {
		await interaction.deferReply();
		const answers: string[] = [
			'Claro pe mano',
			'Nada mano',
			'Anda enfermito',
			'Tu jefa',
			'Cualquiera de tu familia menos tú (incluído el perro)',
			'No sé, pregúntale a tu vieja',
			'Cualquier cosa la Adriana pes',
			'¿Te has fumado la de Nagani no?',
			'Mucho dendro',
			'Anda con tus amigos los tunos',
			'Brawer me la come',
			'JOHN WAYLER LIMA CAMIZÁN',
		];
		const question = interaction.options.getString('pregunta');

		const randomAnswer = answers[Math.floor(Math.random() * answers.length)];

		const answerEmbed = new MessageEmbed()
			.setAuthor(
				`${interaction.member.displayName} preguntó`,
				interaction.member.displayAvatarURL()
			)
			.setDescription(question)
			.addField('Respuesta:', randomAnswer);

		await interaction.editReply({ embeds: [answerEmbed] });
	},
});
