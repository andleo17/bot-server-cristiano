require('dotenv').config();

import { Intents } from 'discord.js';
import { MyBot } from './structures/MyBot';

new MyBot({
	intents: [Intents.FLAGS.GUILDS, Intents.FLAGS.GUILD_MESSAGES],
}).start();
