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
* [`lexcmdcli hello [FILE]`](#lexcmdcli-hello-file)
* [`lexcmdcli help [COMMAND]`](#lexcmdcli-help-command)

## `lexcmdcli hello [FILE]`

describe the command here

```
USAGE
  $ lexcmdcli hello [FILE]

OPTIONS
  -f, --force
  -h, --help       show CLI help
  -n, --name=name  name to print

EXAMPLE
  $ lexcmdcli hello
  hello world from ./src/hello.ts!
```

_See code: [src/commands/hello.ts](https://github.com/amaabca/lexcmdcli/blob/v0.0.0/src/commands/hello.ts)_

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
