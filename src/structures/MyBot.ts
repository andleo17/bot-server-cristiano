import {
	ApplicationCommandDataResolvable,
	Client,
	ClientEvents,
	ClientOptions,
	Collection,
} from 'discord.js';
import fs from 'fs/promises';
import path from 'path';
import { CommandType } from './Command';
import { Event } from './Event';
import { MessageType } from './Message';

export class MyBot extends Client {
	public commands: Collection<string, CommandType>;
	private slashCommands: ApplicationCommandDataResolvable[];
	public messages: MessageType[];

	public constructor(options: ClientOptions) {
		super(options);
		this.commands = new Collection();
		this.slashCommands = [];
		this.messages = [];
	}

	public start(): void {
		this.readCommands();
		this.readEvents();
		this.readMessages();
		this.login(process.env.BOT_TOKEN);
	}

	public async registerCommands(guildId?: string): Promise<void> {
		try {
			await this.login(process.env.BOT_TOKEN);
			await this.readCommands();
			if (guildId) {
				await this.guilds.cache.get(guildId)?.commands.set(this.slashCommands);
				console.log(`Registrando comandos en: ${guildId}`);
			} else {
				await this.application.commands.set(this.slashCommands);
				console.log('Registrando comandos globales');
			}
			this.destroy();
		} catch (error) {
			console.error(error);
		}
	}

	private async importFile(filePath: string) {
		const file = await import(filePath);
		return file?.default;
	}

	private async readCommands(): Promise<void> {
		try {
			const commandsPath = path.join(__dirname, '../commands/');
			const commandFolders = await fs.readdir(commandsPath);
			for (const commandFiles of commandFolders) {
				const files = await fs.readdir(path.join(commandsPath, commandFiles));
				for (const file of files) {
					const command: CommandType = await this.importFile(
						path.join(commandsPath, commandFiles, file)
					);
					if (!command.name) return;
					this.commands.set(command.name, command);
					this.slashCommands.push(command);
				}
			}
		} catch (error) {
			console.error(error);
		}
	}

	private async readEvents(): Promise<void> {
		try {
			const eventPath = path.join(__dirname, '../events/');
			const eventFiles = await fs.readdir(eventPath);
			for (const filePath of eventFiles) {
				const event: Event<keyof ClientEvents> = await this.importFile(
					path.join(eventPath, filePath)
				);
				this.on(event.name, (...args) => event.run(this, ...args));
			}
		} catch (error) {
			console.error(error);
		}
	}

	private async readMessages(): Promise<void> {
		try {
			const messagePath = path.join(__dirname, '../messages/');
			const messageFiles = await fs.readdir(messagePath);
			for (const filePath of messageFiles) {
				const message: MessageType = await this.importFile(
					path.join(messagePath, filePath)
				);
				if (!message.text) return;
				this.messages.push(message);
			}
		} catch (error) {
			console.error(error);
		}
	}
}
