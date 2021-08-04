lexcmdcli
=========

CLI Tool for interacting with AWS Lex API

[![oclif](https://img.shields.io/badge/cli-oclif-brightgreen.svg)](https://oclif.io)
[![Version](https://img.shields.io/npm/v/lexcmdcli.svg)](https://npmjs.org/package/lexcmdcli)
[![Downloads/week](https://img.shields.io/npm/dw/lexcmdcli.svg)](https://npmjs.org/package/lexcmdcli)
[![License](https://img.shields.io/npm/l/lexcmdcli.svg)](https://github.com/amaabca/lexcmdcli/blob/master/package.json)

<!-- toc -->
* [Usage](#usage)
* [Commands](#commands)
<!-- tocstop -->
# Usage
<!-- usage -->
```sh-session
$ npm install -g @amaabca/lexcmdcli
$ lexcmdcli COMMAND
running command...
$ lexcmdcli (-v|--version|version)
lexcmdcli/0.0.0 darwin-x64 node-v14.16.0
$ lexcmdcli --help [COMMAND]
USAGE
  $ lexcmdcli COMMAND
...
```
<!-- usagestop -->
# Commands
<!-- commands -->
* [`lexcmdcli build -b <BOT_ID> -a <ALIAS_NAME>`](#lexcmdcli-lexcmdcli-build--b-bot_id--a-alias_name)
* [`lexcmdcli help [COMMAND]`](#lexcmdcli-help-command)
* [`lexcmdcli list`](#lexcmdcli-list)

## `lexcmdcli build -b <BOT_ID> -a <ALIAS_NAME>`

Command for deploying a V2 Lex Bot

```
USAGE
  $ AWS_PROFILE=<profile> lexcmdcli build -b <BOT_ID> -a <ALIAS_NAME>

OPTIONS
  -a, --alias=alias
  -b, --botId=botId
  -h, --help           show CLI help
  -l, --locale=locale
  -v, --verbose

EXAMPLE

       $ lexcmdcli build -b <BOT_ID> -a <ALIAS_NAME>
       $ lexcmdcli build -b <BOT_ID> -a <ALIAS_NAME> -l <LOCALE_ID>
       $ lexcmdcli build -b <BOT_ID> -a <ALIAS_NAME> -l <LOCALE_ID> -v
```

_See code: [src/commands/build.ts](https://github.com/amaabca/lexcmdcli/blob/v0.0.0/src/commands/build.ts)_

## `lexcmdcli help [COMMAND]`

display help for lexcmdcli

```
USAGE
  $ lexcmdcli help [COMMAND]

ARGUMENTS
  COMMAND  command to show help for

OPTIONS
  --all  see all commands in CLI
```

_See code: [@oclif/plugin-help](https://github.com/oclif/plugin-help/blob/v3.2.2/src/commands/help.ts)_

## `lexcmdcli list`

Command for list all V2 Lex Bots

```
USAGE
  $ AWS_PROFILE=<profile> lexcmdcli list

OPTIONS
  -h, --help     show CLI help
  -v, --verbose

EXAMPLE

       $ lexcmdcli list
       $ lexcmdcli list -v
```

_See code: [src/commands/list.ts](https://github.com/amaabca/lexcmdcli/blob/v0.0.0/src/commands/list.ts)_
<!-- commandsstop -->
