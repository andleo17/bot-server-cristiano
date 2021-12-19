require('dotenv').config();

import { Intents } from 'discord.js';
import { MyBot } from '../structures/MyBot';

const bot = new MyBot({ intents: [Intents.FLAGS.GUILDS] });

bot.registerCommands(process.env.GUILD_ID);
