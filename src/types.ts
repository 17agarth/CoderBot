import { Client, Message } from 'discord.js';

export interface ICommand {
  help(): string;
  isThis(command: string): boolean;
  run(args: string[], message: Message, client: Client): void;
}