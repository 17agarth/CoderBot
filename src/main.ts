import { Client, Message } from 'discord.js';

import { Commands, Prefix, Token } from './config';
import { ICommand } from './types';

const client = new Client({ disableEveryone: true });
let commands: ICommand[] = [];

loadCommands(`${__dirname}/commands`);

client.on('disconnect', (): void => {
  console.log('Disconected');
});
client.on('error', (error: Error): void => {
  console.error(error);
});
client.on('message', (message: Message): void => {
  if (message.author.bot) {
    return undefined;
  }
  if (message.channel.type === 'dm' || message.channel.type === 'group') {
    return undefined;
  }
  if (message.content.substr(0, Prefix.length) !== Prefix) {
    return undefined;
  }

  handleCommand(message);
});
client.on('ready', (): void => {
  console.log('Ready');
  client.user.setPresence({
    afk: false,
    game: {
      name: 'myself get developed',
      url: 'https://github.com/17agarth/CoderBot',
      type: 'WATCHING',
    },
    status: 'idle',
  });
});
client.on('reconnecting', (): void => {
  console.log('Reconnecting');
});

async function handleCommand(message: Message) {
  let command = message.content.split(' ')[0].replace(Prefix, '');
  let args = message.content.split(' ').slice(1);

  for (const commandClass of commands) {
    try {
      if (!commandClass.isThis(command)) {
        continue;
      }

      await commandClass.run(args, message, client);
    } catch (error) {
      console.error(error);
    }
  }
}

function loadCommands(commandPath: string): void {
  if (!Commands || Commands.length === 0) {
    return;
  }

  for (const commandName of Commands) {
    const commandClass = require(`${commandPath}/${commandName}`).default;
    const command = new commandClass() as ICommand;
    commands.push(command);
  }
}

client.login(Token);
