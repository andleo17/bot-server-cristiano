require('dotenv').config();

import { PrismaClient } from '@prisma/client';
import { Intents } from 'discord.js';
import { MyBot } from './structures/MyBot';

const prisma = new PrismaClient();

MyBot.getInstance(
	{
		intents: [
			Intents.FLAGS.GUILDS,
			Intents.FLAGS.GUILD_MESSAGES,
			Intents.FLAGS.GUILD_VOICE_STATES,
		],
	},
	prisma
).start();
