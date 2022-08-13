require('dotenv').config();

import { PrismaClient } from '@prisma/client';
import { Intents } from 'discord.js';
import { MyBot } from './structures/MyBot';

// const prisma = new PrismaClient();

MyBot.getInstance({
	discordOptions: {
		intents: [
			Intents.FLAGS.GUILDS,
			Intents.FLAGS.GUILD_MESSAGES,
			Intents.FLAGS.GUILD_VOICE_STATES,
			Intents.FLAGS.GUILD_MEMBERS,
			Intents.FLAGS.GUILD_PRESENCES,
		],
		presence: {
			status: 'invisible',
		},
	},
	// prisma,
	withPlugins: true,
}).start();

process.on('uncaughtException', (e) => {
	console.error(e);
});
