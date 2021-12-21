require('dotenv').config();

import { Intents } from 'discord.js';
import { MyBot } from '../structures/MyBot';

const bot = MyBot.getInstance({ intents: [Intents.FLAGS.GUILDS] });

bot.registerCommands(process.env.GUILD_ID);
