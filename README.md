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
$ npm install -g lexcmdcli
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
* [`lexcmdcli list`](#lexcmdcli-list)
* [`lexcmdcli build`](#lexcmdcli-build)
* [`lexcmdcli help [COMMAND]`](#lexcmdcli-help-command)

## `lexcmdcli list`

Command for list all V2 Lex Bots

```
USAGE
  $ lexcmdcli list

OPTIONS
  -h, --help        show CLI help
  -v, --verbose     includes more console messages

EXAMPLE
  $ lexcmdcli list
  12345: SAMPLE_BOT1
          (STATUS: Available, CURRENT VERSION: DRAFT)

  123456: SAMPLE_BOT2
            (STATUS: Available, CURRENT VERSION: 10)

  1234567: SAMPLE_BOT3
            (STATUS: Available, CURRENT VERSION: 4)

  12345678: SAMPLE_BOT4
            (STATUS: Available, CURRENT VERSION: DRAFT)
```

_See code: [src/commands/list.ts](https://github.com/amaabca/lexcmdcli/blob/v0.0.0/src/commands/list.ts)_

## `lexcmdcli build`

Command for deploying a V2 Lex Bot

```
USAGE
  $ lexcmdcli build -b <BOT_ID> -a <ALIAS_NAME> -l <LOCALE_ID> -v

OPTIONS
  -h, --help            show CLI help
  -v, --verbose         includes more console messages
  -a, --alias=alias     alias name to create/update
  -b, --botId=botId     id of bot to be built
  -l, --locale=locale   locale id for bot

EXAMPLE
  $ lexcmdcli build -b 12345 -a prod -l en_US
  building bot locale.......done
  building bot version...done
  updating bot alias
  done
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
<!-- commandsstop -->
