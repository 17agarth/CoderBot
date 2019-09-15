import { Client, Message } from 'discord.js';

import { ICommand } from '../types';

export default class purge implements ICommand {
  private readonly _command = 'purge';

  help(): string {
    return 'Delete messages in a channel';
  }

  isThis(command: string): boolean {
    return command === this._command;
  }

  run(args: string[], message: Message, client: Client): void {
    message.delete();

    if (!message.member.hasPermission('ADMINISTRATOR')) {
      message.channel
        .send(
          `Unable to purge messages. Reason: ${message.author.tag} lacks the 'Administrator' Permission`
        )
        .then((_msg: Message | Message[]) => {
          (_msg as Message).delete(5000);
        });
    }

    if (!args[0]) {
      message.channel
        .send(
          'Unable to purge messages. Reason: Number of messages must be supplied'
        )
        .then((_msg: Message | Message[]) => {
          (_msg as Message).delete(5000);
        });
    }

    const numberOfMessagesToDelete: number = isNaN(Number(args[0]))
      ? Math.round(Number(args[0]))
      : 0;

    message.channel.bulkDelete(numberOfMessagesToDelete);
  }
}
