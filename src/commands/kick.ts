import { Client, GuildMember, Message } from 'discord.js';

import { ICommand } from '../types';

export default class kick implements ICommand {
  private readonly _command: string = 'kick';

  help(): string {
    return 'Kicks the mentioned user';
  }

  isThis(command: string): boolean {
    return command === this._command;
  }

  run(args: string[], message: Message, client: Client): void {
    let mentionedUser: GuildMember = message.mentions.members.first();
    let suppliedReason: string = args.slice(1).join(' ') || '';
    let log: string = `${message.author.tag}: ${suppliedReason}`;

    if (!mentionedUser) {
      message.channel
        .send('Unable to find users that have been tagged')
        .then((_msg: Message | Message[]) => {
          (_msg as Message).delete(5000);
        });
    }

    if (!message.member.hasPermission('KICK_MEMBERS')) {
      message.channel
        .send(
          `Unable to kick ${mentionedUser.user.tag}. Reason: ${message.author.tag} lacks the 'Kick Members' Permission`
        )
        .then((_msg: Message | Message[]) => {
          (_msg as Message).delete(5000);
        });
    }

    message.deletable ? message.delete() : undefined;

    mentionedUser.send(
      `You where kicked from ${message.guild.name}${
        suppliedReason === '' ? '' : ` for reason ${suppliedReason}`
      }`
    );

    message.author.send(
      `Kicked ${mentionedUser.user.tag}${
        suppliedReason === '' ? '' : ` for reason ${suppliedReason}`
      }`
    );

    if (mentionedUser.kickable) {
      mentionedUser
        .kick(log)
        .then(console.log)
        .catch(console.log);
    }
  }
}
