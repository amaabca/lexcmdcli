import { Command, flags } from '@oclif/command'
import LexClient from '../lex-client';

export default class List extends Command {
  static description = 'Command for list all V2 Lex Bots'

  static examples = [
    `
    $ lexcmdcli list
    $ lexcmdcli list -v
    `,
  ];

  static flags = {
    help: flags.help({ char: 'h' }),
    verbose: flags.boolean({ char: 'v' }),
  }

  static args = []

  async run(): Promise<void> {
    const { args, flags } = this.parse(List);

    if (flags.verbose) {
      console.log(args);
      console.log(flags);
    }

    const client = new LexClient({ verbose: flags.verbose });
    console.log(await client.list());
  }
}
