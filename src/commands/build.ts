import { Command, flags } from '@oclif/command';
import LexClient from '../lex-client';

export default class Build extends Command {
  static description = 'Command for deploying a V2 Lex Bot'

  static examples = [
    `
    $ lexcmdcli build -b <BOT_ID> -a <ALIAS_NAME>
    $ lexcmdcli build -b <BOT_ID> -a <ALIAS_NAME> -l <LOCALE_ID>
    $ lexcmdcli build -b <BOT_ID> -a <ALIAS_NAME> -l <LOCALE_ID> -v
    `,
  ];

  static flags = {
    help: flags.help({ char: 'h' }),
    verbose: flags.boolean({ char: 'v' }),
    botId: flags.string({ char: 'b' }),
    alias: flags.string({ char: 'a' }),
    locale: flags.string({ char: 'l' }),
  }

  static usage = 'lexcmdcli build -b <BOT_ID> -a <ALIAS_NAME>'

  static args = [];

  async run(): Promise<void> {
    const { args, flags } = this.parse(Build);

    if (flags.verbose) {
      console.log(args);
      console.log(flags);
    }

    if (flags.botId && flags.alias) {
      const client = new LexClient({ verbose: flags.verbose });
      await client.build(flags.botId, flags.alias);
    } else {
      this._help();
    }
  }
}
