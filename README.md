# perst [![Build Status](https://travis-ci.com/DasRed/perst.svg?branch=master)](https://travis-ci.com/DasRed/perst) [![Coverage Status](https://coveralls.io/repos/github/DasRed/perst/badge.svg?branch=master)](https://coveralls.io/github/DasRed/perst?branch=main)

perst is a wrapper around LoaderIO, which can be configured and run in your commandline multiple tests and validates the measureable values like AVG Response Time and AVG Error Rate.

# Command Line Options

Usage: perst [options]

Basic options:
| Switch                  | Description                                                                               |
| ----------------------- | ----------------------------------------------------------------------------------------- |
| -c, --config FILENAME   | Use this config file (if argument is used but value is unspecified, defaults to .perstrc) |
| -d, --dry-run           | Runs all test in dry-run mode                                                             |
| -h, --help              | Show this help message                                                                    |
| -v, --version           | Show version number                                                                       |
| --ci                    | Runs this on a CI                                                                         |
| --dump-config \[FORMAT] | dumps the config to the stdout in given format (yaml, yml, json, js). Default: yaml       |
| -f, --filter PATTERN    | filters the task by given regex. The name attribute will be used with the regex           |
| --color                 | force the output with colors                                                              |
| --no-color              | force the output without colors                                                           |
| --list-tasks            | lists all available tasks                                                                 |
| -s, --silent            | silent mode                                                                               |
| --stop-on-failure       | stops the tasks execution, if a task fails                                                |

# Configuration files

At the following locations in the root directory and format can be placed the configuration.
 
The files will be searched in this order. The first match will be used.

- package.json `{ "perst": {...} }`
- .perstrc            yaml
- .perstrc.json       json
- .perstrc.yaml       yaml
- .perstrc.yml        yaml
- .perstrc.js         javascript
- .perstrc.cjs        common js
- perst.config.js     javascript
- perst.config.cjs    common js

Or you run perst with the command line switch -c.
