import { Client, GuildMember, Message } from 'discord.js';

import { ICommand } from '../types';

export default class ban implements ICommand {
  private readonly _command: string = 'ban';

  help(): string {
    return 'Bans the mentioned user';
  }

  isThis(command: string): boolean {
    return command === this._command;
  }

  run(args: string[], message: Message, client: Client): void {
    let mentionedUser: GuildMember = message.mentions.members.first();
    let suppliedReason: string = args.slice(1).join(' ') || '';
    let log: string = `${message.author.username}: ${suppliedReason}`;

    if (!mentionedUser) {
      message.channel
        .send('Unable to find users that have been tagged')
        .then((_msg: Message | Message[]) => {
          (_msg as Message).delete(5000);
        });
    }

    if (!message.member.hasPermission('BAN_MEMBERS')) {
      message.channel
        .send(
          `Unable to ban ${mentionedUser.user.tag}. Reason: ${message.author.tag} lacks the 'Ban Members' Permission`
        )
        .then((_msg: Message | Message[]) => {
          (_msg as Message).delete(5000);
        });
    }

    message.deletable ? message.delete() : undefined;

    mentionedUser.user.send(
      `You where banned from ${message.guild.name}${
        suppliedReason === '' ? '' : ` for reason ${suppliedReason}`
      }`
    );

    message.author.send(
      `Banned ${mentionedUser.user.tag}${
        suppliedReason === '' ? '' : ` for reason ${suppliedReason}`
      }`
    );

    if (mentionedUser.bannable) {
      mentionedUser
        .ban(log)
        .then(console.log)
        .catch(console.log);
    }
  }
}
