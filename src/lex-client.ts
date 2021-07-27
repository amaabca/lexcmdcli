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
  DescribeBotAliasCommand,
  BotAliasSummary,
  BuildBotLocaleCommandOutput,
  CreateBotVersionCommandOutput,
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

  // method for listing existing lex bots for current account
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

  // method for building a bot locale, version and alias
  build = async (botId: string, botAlias: string, botLocale?: string): Promise<void> => {
    const locale = botLocale || 'en_US';

    if (this.verbose) {
      console.log('BOT ID: ', botId);
      console.log('BOT LOCALE: ', locale);
    }

    // need to build the locale next
    const createLocaleResults = await this.buildBotLocale(botId, locale);

    if (createLocaleResults.botLocaleStatus === 'Built') {
      process.stdout.write('done\n');

      // need to create the new updated version
      const createVersionResults = await this.createBotVersion(botId);
      // we need to see if this alias already exists or not, if it does, we will update it, if it doesn't we will create it from scratch
      const foundAlias = await this.getBotAliasDetails(botId, botAlias);

      // is our alias name in the list?
      if (foundAlias) {
        await this.updateBotAlias(botId, foundAlias, botAlias, createVersionResults);
      } else {
        if (createVersionResults.botVersion) {
          await this.createBotAlias(botId, botAlias, createVersionResults.botVersion, locale);
        } else {
          throw new Error('Version wasnt created properly!');
        }
      }
      console.log('done');
    } else {
      throw new Error(`Locale failed to build with status of ${createLocaleResults.botLocaleStatus}`);
    }
  }

  // simple helper function to create delay
  delay(t: number): Promise<any> {
    return new Promise(resolve => setTimeout(resolve, t));
  }

  // helper method for creating a bot alias
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
    if (this.verbose) {
      console.log(createAliasResult);
    }
    return createAliasResult;
  }

  // helper method for getting alias details and whether the alias exists or not
  getBotAliasDetails = async (botId: string, botAlias: string): Promise<BotAliasSummary | undefined> => {
    const listAliasesCommand = new ListBotAliasesCommand({ botId });
    const listAliasesResults = await this.client.send(listAliasesCommand);
    let found;

    if (listAliasesResults && listAliasesResults.botAliasSummaries && listAliasesResults.botAliasSummaries.length > 0) {
      for (let i = 0; i < listAliasesResults.botAliasSummaries.length; i++) {
        if (listAliasesResults.botAliasSummaries[i].botAliasName === botAlias) {
          // we need to update this alias now
          found = listAliasesResults.botAliasSummaries[i];
          break;
        }
      }
    }

    if (this.verbose) {
      console.log(found);
    }

    return found;
  }

  // helper method for creating a new bot version
  createBotVersion = async (botId: string): Promise<CreateBotVersionCommandOutput> => {
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

    if (this.verbose) {
      console.log(createVersionResults);
    }

    return createVersionResults;
  }

  // helper method for building bot locale and waiting until it is complete
  buildBotLocale = async (botId: string, locale: string): Promise<BuildBotLocaleCommandOutput> => {
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

    return results;
  }

  // helper method for updating bot alias with existing settings from other botAlias
  updateBotAlias = async (botId: string, foundAlias: BotAliasSummary, botAlias: string, createVersionResults: CreateBotVersionCommandOutput) => {
    const describeBotAliasCommand = new DescribeBotAliasCommand({ botId, botAliasId: foundAlias.botAliasId });
    const describeBotAliasResults = await this.client.send(describeBotAliasCommand);

    if (this.verbose) {
      console.log(describeBotAliasResults);
    }

    console.log('updating bot alias');
    const updateAliasCommand = new UpdateBotAliasCommand({
      botId,
      botAliasId: foundAlias.botAliasId,
      botAliasName: botAlias,
      botVersion: createVersionResults.botVersion,
      botAliasLocaleSettings: describeBotAliasResults.botAliasLocaleSettings,
      sentimentAnalysisSettings: describeBotAliasResults.sentimentAnalysisSettings
    });

    const updateResults = await this.client.send(updateAliasCommand);

    if (this.verbose) {
      console.log(updateResults);
    }
  }
}
