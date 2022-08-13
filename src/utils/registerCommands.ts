require('dotenv').config();

import { Intents } from 'discord.js';
import { MyBot } from '../structures/MyBot';

const bot = MyBot.getInstance({
	discordOptions: {
		intents: [Intents.FLAGS.GUILDS, Intents.FLAGS.GUILD_VOICE_STATES],
	},
});

bot.registerCommands();
