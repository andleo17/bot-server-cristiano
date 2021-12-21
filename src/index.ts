require('dotenv').config();

import { Intents } from 'discord.js';
import { MyBot } from './structures/MyBot';

MyBot.getInstance({
	intents: [
		Intents.FLAGS.GUILDS,
		Intents.FLAGS.GUILD_MESSAGES,
		Intents.FLAGS.GUILD_VOICE_STATES,
	],
}).start();
