# perst [![Build Status](https://travis-ci.com/DasRed/perst.svg?branch=master)](https://travis-ci.com/DasRed/perst) [![Coverage Status](https://coveralls.io/repos/github/DasRed/perst/badge.svg?branch=master)](https://coveralls.io/github/DasRed/perst?branch=main)

perst is a wrapper around LoaderIO, which can be configured and run in your commandline multiple tests and validates the measureable values like AVG Response Time and AVG Error Rate.

## Command Line Options

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

## Configuration files

At the following locations in the root directory and format can be placed the configuration.

The files will be searched in this order. The first match will be used.

- package.json `{ "perst": {...} }`
- .perstrc yaml
- .perstrc.json json
- .perstrc.yaml yaml
- .perstrc.yml yaml
- .perstrc.js javascript
- .perstrc.cjs common js
- perst.config.js javascript
- perst.config.cjs common js

Or you run perst with the command line switch -c.

## Big list of configuration options

You can use environment variables in your configuration. Environment variables are only supported in YAML Files. Every environment variable can be written in the format `$NAME` or `${NAME}`. Only existing environment variables will replaced.

### `version`

### Complete Example

#### YAML

```yaml
version: 1
dryRun:  false
api:
    token:   bb74abe565ec005944ffcbfa846431e1
    server:  https://api.loader.io
    version: v2

app:
    domain: https://www.example.com

tasks:
    tasks1:
        name:         Task 1
        type:         per-second
        duration:     60
        clientsStart: 1
        clients:      25
        timeout:      10000
        notes:        "some notes"
        tags:
            - tag 1
            - tag 2
        threshold:
            avgResponseTime: 500
            avgErrorRate:    50
        request:
            path:        /nuff/narf
            type:        GET
            payloadFile: https://www.example.de/file
            headers:
                accept-encoding: gzip
            parameters:
                -   name:  parameter 1
                    value: value of parameter 1
                -   name:  parameter 2
                    value: value of parameter 2
            authentication:
                type:     basic
                login:    login
                password: password
            variables:
                -   name:     variable 1 name
                    property: variable 1 property
                    source:   variable 1 source
                -   name:     variable 2 name
                    property: variable 2 property
                    source:   variable 2 source
    tasks2:
        name:     Task 2
        duration: 60
        clients:  25
        threshold:
            avgResponseTime: 500
            avgErrorRate:    0
        requests:
            -   path: /nuff/narf
            -   path: /rofl/copoter
```

#### JSON

```json
{
    "version": 1,
    "dryRun": false,
    "api": {
        "token": "bb74abe565ec005944ffcbfa846431e1",
        "server": "https://api.loader.io",
        "version": "v2"
    },
    "app": {
        "domain": "https://www.example.com"
    },
    "tasks": {
        "tasks1": {
            "name": "Task 1",
            "type": "per-second",
            "duration": 60,
            "clientsStart": 1,
            "clients": 25,
            "timeout": 10000,
            "notes": "some notes",
            "tags": [
                "tag 1",
                "tag 2"
            ],
            "threshold": {
                "avgResponseTime": 500,
                "avgErrorRate": 50
            },
            "request": {
                "path": "/nuff/narf",
                "type": "GET",
                "payloadFile": "https://www.example.de/file",
                "headers": {
                    "accept-encoding": "gzip"
                },
                "parameters": [
                    {
                        "name": "parameter 1",
                        "value": "value of parameter 1"
                    },
                    {
                        "name": "parameter 2",
                        "value": "value of parameter 2"
                    }
                ],
                "authentication": {
                    "type": "basic",
                    "login": "login",
                    "password": "password"
                },
                "variables": [
                    {
                        "name": "variable 1 name",
                        "property": "variable 1 property",
                        "source": "variable 1 source"
                    },
                    {
                        "name": "variable 2 name",
                        "property": "variable 2 property",
                        "source": "variable 2 source"
                    }
                ]
            }
        },
        "tasks2": {
            "name": "Task 2",
            "duration": 60,
            "clients": 25,
            "threshold": {
                "avgResponseTime": 500,
                "avgErrorRate": 0
            },
            "requests": [
                {"path": "/nuff/narf"},
                {"path": "/rofl/copoter"}
            ]
        }
    }
}
```

#### JavaScript

```javascript
export default {
    "version": 1,
    "dryRun": false,
    "api": {
        "token": "bb74abe565ec005944ffcbfa846431e1",
        "server": "https://api.loader.io",
        "version": "v2"
    },
    "app": {
        "domain": "https://www.example.com"
    },
    "tasks": {
        "tasks1": {
            "name": "Task 1",
            "type": "per-second",
            "duration": 60,
            "clientsStart": 1,
            "clients": 25,
            "timeout": 10000,
            "notes": "some notes",
            "tags": [
                "tag 1",
                "tag 2"
            ],
            "threshold": {
                "avgResponseTime": 500,
                "avgErrorRate": 50
            },
            "request": {
                "path": "/nuff/narf",
                "type": "GET",
                "payloadFile": "https://www.example.de/file",
                "headers": {
                    "accept-encoding": "gzip"
                },
                "parameters": [
                    {
                        "name": "parameter 1",
                        "value": "value of parameter 1"
                    },
                    {
                        "name": "parameter 2",
                        "value": "value of parameter 2"
                    }
                ],
                "authentication": {
                    "type": "basic",
                    "login": "login",
                    "password": "password"
                },
                "variables": [
                    {
                        "name": "variable 1 name",
                        "property": "variable 1 property",
                        "source": "variable 1 source"
                    },
                    {
                        "name": "variable 2 name",
                        "property": "variable 2 property",
                        "source": "variable 2 source"
                    }
                ]
            }
        },
        "tasks2": {
            "name": "Task 2",
            "duration": 60,
            "clients": 25,
            "threshold": {
                "avgResponseTime": 500,
                "avgErrorRate": 0
            },
            "requests": [
                {"path": "/nuff/narf"},
                {"path": "/rofl/copoter"}
            ]
        }
    }
}
```
