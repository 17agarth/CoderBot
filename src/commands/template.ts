import { Client, Message } from 'discord.js';

import { ICommand } from '../types';

export default class template implements ICommand {
  private readonly _command = 'template';

  help(): string {
    return 'This command dosen\'t do anything, it\'s a test command';
  }

  isThis(command: string): boolean {
    return command === this._command;
  }

  run(args: string[], message: Message, client: Client): void {
    message.channel
      .send('Hello, from commands/template.ts')
      .then((_msg: Message | Message[]) => {
        (_msg as Message).delete(5000);
      });
  }
}
