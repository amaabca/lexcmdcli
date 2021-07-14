import {
  ListBotsCommand,
  BuildBotLocaleCommand,
  LexModelsV2Client,
  DescribeBotLocaleCommand,
  CreateBotVersionCommand,
  CreateBotAliasCommand,
  DescribeBotCommand,
  DescribeBotCommandOutput,
  ListBotAliasesCommand,
  UpdateBotAliasCommand,
  CreateBotAliasCommandOutput,
} from '@aws-sdk/client-lex-models-v2';

interface LexClientProps {
  profileName?: string,
  verbose?: boolean
}

export default class LexClient {
  client: LexModelsV2Client;
  verbose: boolean;

  constructor(props?: LexClientProps) {
    this.client = new LexModelsV2Client({
      region: process.env.REGION || 'us-east-1',
    });
    this.verbose = props?.verbose ?? false;
  }

  list = async (): Promise<string> => {

    const listCommand = new ListBotsCommand({});
    const results = await this.client.send(listCommand);

    if (this.verbose) {
      console.info(`LIST COMMAND: ${JSON.stringify(results)}`);
    }

    let formattedString = '';
    if (results && results.botSummaries && results.botSummaries.length > 0) {
      for (let i = 0; i < results.botSummaries.length; i++) {
        formattedString += `\n${results.botSummaries[i].botId}: ${results.botSummaries[i].botName}
          (STATUS: ${results.botSummaries[i].botStatus}, CURRENT VERSION: ${results.botSummaries[i].latestBotVersion ?? 'DRAFT'})\n`;
      }
    }

    return formattedString;
  }

  delay(t: number): Promise<any> {
    return new Promise(resolve => setTimeout(resolve, t));
  }

  createBotAlias = async (botId: string, botAlias: string, botVersion: string, locale: string): Promise<CreateBotAliasCommandOutput> => {
    console.log('creating bot alias');

    const createBotAliasCommand = new CreateBotAliasCommand({
      botId,
      botAliasName: botAlias,
      botVersion,
      botAliasLocaleSettings: {
        [locale]: { enabled: true },
      },
    });

    const createAliasResult = await this.client.send(createBotAliasCommand);
    return createAliasResult;
  }

  build = async (botId: string, botAlias: string, botLocale?: string): Promise<void> => {
    const locale = botLocale || 'en_US';

    if (this.verbose) {
      console.log('BOT ID: ', botId);
      console.log('BOT LOCALE: ', locale);
    }

    // need to build the locale next
    const buildLocaleCommand = new BuildBotLocaleCommand({ botId, botVersion: 'DRAFT', localeId: locale });
    const describeLocaleCommand = new DescribeBotLocaleCommand({ botId, botVersion: 'DRAFT', localeId: locale });
    let results = await this.client.send(buildLocaleCommand);

    process.stdout.write('building bot locale');
    while (results.botLocaleStatus === 'Building' || results.botLocaleStatus === 'Creating' || results.botLocaleStatus === 'ReadyExpressTesting') {
      await this.delay(4000);
      results = await this.client.send(describeLocaleCommand);
      if (this.verbose) {
        console.log(`\n${JSON.stringify(results)}`);
      }
      process.stdout.write('.');
    }

    if (results.botLocaleStatus === 'Built') {
      process.stdout.write('done\n');

      // need to create the new updated version
      const createVersionCommand = new CreateBotVersionCommand({ botId, botVersionLocaleSpecification: { 'en_US': { sourceBotVersion: 'DRAFT' } } });
      const describeBotCommand = new DescribeBotCommand({ botId });
      const createVersionResults = await this.client.send(createVersionCommand);
      let describeBotResults: DescribeBotCommandOutput = { $metadata: createVersionResults.$metadata, botStatus: createVersionResults.botStatus };

      process.stdout.write('building bot version');

      // need to wait until the bot is done versioning here
      while (describeBotResults.botStatus === 'Versioning') {
        await this.delay(2000);
        describeBotResults = await this.client.send(describeBotCommand);
        if (this.verbose) {
          console.log(`\n${JSON.stringify(describeBotResults)}`);
        }
        process.stdout.write('.');
      }

      process.stdout.write('done\n');
      // we need to see if this alias already exists or not, if it does, we will update it, if it doesn't we will create it from scratch
      const listAliasesCommand = new ListBotAliasesCommand({ botId });
      const listAliasesResults = await this.client.send(listAliasesCommand);

      if (listAliasesResults && listAliasesResults.botAliasSummaries && listAliasesResults.botAliasSummaries.length > 0) {
        let found;

        for (let i = 0; i < listAliasesResults.botAliasSummaries.length; i++) {
          if (listAliasesResults.botAliasSummaries[i].botAliasName === botAlias) {
            // we need to update this alias now
            found = listAliasesResults.botAliasSummaries[i];
            break;
          }
        }

        if (found) {
          console.log('updating bot alias');

          const updateAliasCommand = new UpdateBotAliasCommand({
            botId,
            botAliasId: found.botAliasId,
            botAliasName: botAlias,
            botVersion: createVersionResults.botVersion,
            botAliasLocaleSettings: {
              [locale]: { enabled: true },
            },
          });

          const updateResults = await this.client.send(updateAliasCommand);

          if (this.verbose) {
            console.log(updateResults);
          }
        } else {
          if (createVersionResults.botVersion) {
            const createAliasResults = await this.createBotAlias(botId, botAlias, createVersionResults.botVersion, locale);
            if (this.verbose) {
              console.log(createAliasResults);
            }
          } else {
            throw new Error('Version wasnt created properly!');
          }
        }
      } else {
        if (createVersionResults.botVersion) {
          const createAliasResults = await this.createBotAlias(botId, botAlias, createVersionResults.botVersion, locale);
          if (this.verbose) {
            console.log(createAliasResults);
          }
        } else {
          throw new Error('Version wasnt created properly!');
        }
      }

      console.log('done');
    } else {
      throw new Error(`Locale failed to build with status of ${results.botLocaleStatus}`);
    }
  }
}
