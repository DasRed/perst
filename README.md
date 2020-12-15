# perst [![Build Status](https://travis-ci.com/DasRed/perst.svg?branch=master)](https://travis-ci.com/DasRed/perst) [![Coverage Status](https://coveralls.io/repos/github/DasRed/perst/badge.svg?branch=master)](https://coveralls.io/github/DasRed/perst?branch=main)

perst is a wrapper around LoaderIO, which can be configured and run in your commandline multiple tests and validates the measureable values like AVG Response Time and AVG Error Rate.

## Table of Contents

* [Command Line Options](#command-line-options)
* [Configuration files](#configuration-files)
* [Big list of configuration options](#big-list-of-configuration-options)
	* [`version`](#version)
	* [`api`](#api)
		* [`api.token`](#apitoken)
		* [`api.server`](#apiserver)
		* [`api.version`](#apiversion)
	* [`app`](#app)
		* [`app.domain`](#appdomain)
	* [`tasks`](#tasks)
		* [`tasks.[name].name`](#tasksnamename)
		* [`tasks.[name].type`](#tasksnametype)
			* [Task Type "Clients per test" `per-test`](#task-type-clients-per-test-per-test)
			* [Task Type "Clients per second" `per-second`](#task-type-clients-per-second-per-second)
			* [Task Type "Maintain client load" `maintain-load`](#task-type-maintain-client-load-maintain-load)
		* [`tasks.[name].duration`](#tasksnameduration)
		* [`tasks.[name].clientsStart`](#tasksnameclientsstart)
		* [`tasks.[name].clients`](#tasksnameclients)
		* [`tasks.[name].timeout`](#tasksnametimeout)
		* [`tasks.[name].errorThreshold`](#tasksnameerrorthreshold)
		* [`tasks.[name].notes`](#tasksnamenotes)
		* [`tasks.[name].tags`](#tasksnametags)
		* [`tasks.[name].threshold`](#tasksnamethreshold)
			* [`tasks.[name].threshold.avgResponseTime`](#tasksnamethresholdavgresponsetime)
			* [`tasks.[name].threshold.avgErrorRate`](#tasksnamethresholdavgerrorrate)
		* [`tasks.[name].requests`](#tasksnamerequests)
		* [`tasks.[name].request`](#tasksnamerequest)
			* [`tasks.[name].request.path`](#tasksnamerequestpath)
			* [`tasks.[name].request.type`](#tasksnamerequesttype)
			* [`tasks.[name].request.payloadFile`](#tasksnamerequestpayloadfile)
			* [`tasks.[name].request.headers`](#tasksnamerequestheaders)
			* [`tasks.[name].request.parameters`](#tasksnamerequestparameters)
				* [`tasks.[name].request.parameters[index].name`](#tasksnamerequestparametersindexname)
				* [`tasks.[name].request.parameters[index].value`](#tasksnamerequestparametersindexvalue)
			* [`tasks.[name].request.authentication`](#tasksnamerequestauthentication)
				* [`tasks.[name].request.authentication.type`](#tasksnamerequestauthenticationtype)
				* [`tasks.[name].request.authentication.login`](#tasksnamerequestauthenticationlogin)
				* [`tasks.[name].request.authentication.password`](#tasksnamerequestauthenticationpassword)
			* [`tasks.[name].request.variables`](#tasksnamerequestvariables)
				* [`tasks.[name].request.variables[index].name`](#tasksnamerequestvariablesindexname)
				* [`tasks.[name].request.variables[index].property`](#tasksnamerequestvariablesindexproperty)
				* [`tasks.[name].request.variables[index].source`](#tasksnamerequestvariablesindexsource)
* [Configuration Examples](#configuration-examples)
	* [YAML](#yaml)
	* [JSON](#json)
	* [JavaScript](#javascript)

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

You can use environment variables in your configuration. Environment variables are only supported in YAML Files. 
Every environment variable can be written in the format `$NAME` or `${NAME}`. Only existing environment variables will replaced.
YAML configuration use YAML Version 1.2 and supports [anchors](https://support.atlassian.com/bitbucket-cloud/docs/yaml-anchors/).

## Big list of configuration options

### `version`

Defines the version of the configuration file.

- **Required:** false
- **Type:** Number
- **Values:** 1
- **Default:** 1

### `api`

Defines some api information currently for [loader IO](https://dasred.github.io/loader.io). 

- **Required:** true
- **Type:** Object

#### `api.token`

Defines the [loader IO API](http://docs.loader.io/api/intro.html) token. 

- **Required:** true
- **Type:** String

#### `api.server`

Defines the [loader IO API](http://docs.loader.io/api/intro.html) server url. 

- **Required:** false
- **Type:** String
- **Default:** https://api.loader.io

#### `api.version`

Defines the [loader IO API](http://docs.loader.io/api/intro.html) version. 

- **Required:** false
- **Type:** String
- **Values:** v2
- **Default:** v2

### `app`

Defines some application options. 

- **Required:** true
- **Type:** Object

#### `app.domain`

Defines the domain for load testing. The domain must be defined in [loader IO](https://loader.io/targets) and must be verified. 

- **Required:** true
- **Type:** String
- **Example:** https://www.example.de

### `tasks`

Defines every task which should be run. This is an object of tasks. 

- **Required:** true
- **Type:** Object

#### `tasks.[name].name`

Defines the name of the task in loader IO. This name will be used to find an existing task to reuse and rerun them. If no task can be found with this name, the task will be created.

- **Required:** true
- **Type:** String

#### `tasks.[name].type`

Defines the test type for the task. The article [Test Types](https://support.loader.io/article/16-test-types) and 
[Understanding the different test types](https://loader.io/blog/2014/07/16/understanding-different-test-types/) describe detailed information about the test type.

- **Required:** false
- **Type:** String
- **Values:** per-test, per-second, maintain-load
- **Default:** per-second

##### Task Type "Clients per test" `per-test`
With the "Clients per test" type, you specify the total number of clients to connect to your application over the duration of the test. 
If you specify 20000 clients for a 20-second test, 1000 clients will connect each second during that test.

![Clients per test](docs/per-test.png)

##### Task Type "Clients per second" `per-second`
The "Clients per second" type is similar to "Clients per test", but instead of specifying the total, you specify the number of clients to 
start each second. A 20-second test with 1000 clients per second is the same as a 20-second test at 20000 clients per test.

![Clients per second](docs/per-second.png)

##### Task Type "Maintain client load" `maintain-load`
This test allows you to specify a _from_ and a _to_ value for clients. If you specify 0 and 10000 here for example, the test will start with 
0 clients and increase up to 10000 simultaneous clients by the end of the test.

![Maintain client load](docs/maintain-load.png)

#### `tasks.[name].duration`

Defines the execution duration of the test in seconds. 

- **Required:** false
- **Type:** Integer
- **Values:** >= 60
- **Default:** 60

#### `tasks.[name].clientsStart`

This defines number of clients for the start for the test type [Maintain client load](#task-type-maintain-client-load-maintain-load). This value will be 
ignored for all other test types.

- **Required:** false
- **Type:** Integer
- **Values:** >= 0
- **Default:** 0

#### `tasks.[name].clients`

This defines number of clients, which should be used. I case of the test type [Maintain client load](#task-type-maintain-client-load-maintain-load), this will be 
the number of client at the end of the test.

- **Required:** true
- **Type:** Integer
- **Values:** >= 15

#### `tasks.[name].timeout`

This defines the timeout for one request. This value is in milliseconds.

- **Required:** false
- **Type:** Integer
- **Values:** >= 0
- **Default:** 10000

#### `tasks.[name].errorThreshold`

This defines the error percentage threshold.

- **Required:** false
- **Type:** Integer
- **Values:** 0 <= x <= 100
- **Default:** 10000

#### `tasks.[name].notes`

This defines some notes to add to the test.

- **Required:** false
- **Type:** String

#### `tasks.[name].tags`

This defines some tags to add to the test.

- **Required:** false
- **Type:** Array of String

#### `tasks.[name].threshold`

This defined the relevant threshold, whether the test should fail or not.

- **Required:** false
- **Type:** Object

##### `tasks.[name].threshold.avgResponseTime`

This defines the maximum average response time in milliseconds, which is allowed. If the test exceeds this value, the task will fail. 

- **Required:** true
- **Type:** Integer
- **Values:** >= 0
- **Default:** 500

##### `tasks.[name].threshold.avgErrorRate`

This defines the maximum average error rate, which is allowed. If the test exceeds this value, the task will fail. 

- **Required:** true
- **Type:** Integer
- **Values:** 0 <= x <= 100
- **Default:** 0

#### `tasks.[name].requests`

This defines the multiple request options for the test. This property can be defined beside the [`tasks.[name].request` property](#tasksnamerequest), but it
can also be defined without the [`tasks.[name].request` property](#tasksnamerequest). If both properties are defined, the first request is the request, which is
defined in the property [`tasks.[name].request`](#tasksnamerequest).

- **Required:** true
- **Type:** Array of Object

The descriptions of the object in this array are the same as described in the [property `tasks.[name].request`](#tasksnamerequest).

#### `tasks.[name].request`

This defines the request options for the test. This property can be defined beside the [`tasks.[name].requests` property](#tasksnamerequests), but it
can also be defined without the [`tasks.[name].requests` property](#tasksnamerequests). If both properties are defined, the first request is the request, which is
defined in the property `tasks.[name].request`.

- **Required:** true
- **Type:** Object

##### `tasks.[name].request.path`

This defines the absolute path for the request. The path can be start with a / or without it. This path will be combined with the [property `api.domain`](#apidomain).

- **Required:** true
- **Type:** String

##### `tasks.[name].request.type`

This defines method for the request.

- **Required:** false
- **Type:** String
- **Values:** GET, POST, PUT, PATCH, DELETE
- **Default:** GET

##### `tasks.[name].request.payloadFile`

This defines a URL of a payload file. Detailed information about the payload file can be found in the article [Payload Files](https://support.loader.io/article/17-payload-files).

- **Required:** false
- **Type:** Url

##### `tasks.[name].request.headers`

This defines header values for the request. If you defined this property, you have to declare the header `accept-encoding` on your own.

- **Required:** false
- **Type:** Object
- **Default:** `{'accept-encoding': 'gzip'}` 

##### `tasks.[name].request.parameters`

This defines an array with parameters objects. These parameters will be sent in query string or POST body.

- **Required:** false
- **Type:** Array of Object

###### `tasks.[name].request.parameters[index].name`

This defines the name of the parameter.

- **Required:** true
- **Type:** String

###### `tasks.[name].request.parameters[index].value`

This defines the name of the parameter.

- **Required:** true
- **Type:** String

##### `tasks.[name].request.authentication`

This defines options for the authentication.

- **Required:** false
- **Type:** Object

###### `tasks.[name].request.authentication.type`

This defines the type of the authentication.

- **Required:** false
- **Type:** String
- **Values:** basic
- **Default:** basic

The value `basic` defines the authentication as [HTTP Basic Auth](https://en.wikipedia.org/wiki/Basic_access_authentication).

###### `tasks.[name].request.authentication.login`

This defines login or user name for the authentication.

- **Required:** true
- **Type:** String

###### `tasks.[name].request.authentication.password`

This defines password for the authentication.

- **Required:** true
- **Type:** String

##### `tasks.[name].request.variables`

This defines variables whose values will be taken from the header. These variables can be used in all following request. You can read more information in
the article [Variables](https://support.loader.io/article/18-variables).

- **Required:** false
- **Type:** Array of Object

###### `tasks.[name].request.variables[index].name`

This defines the name of the variable for later use.

- **Required:** true
- **Type:** String

###### `tasks.[name].request.variables[index].property`

This defines the header property name to get the value from the request.

- **Required:** true
- **Type:** String

###### `tasks.[name].request.variables[index].source`

This defines source of the variables.

- **Required:** false
- **Type:** String
- **Values:** header
- **Default:** header

## Configuration Examples

### YAML

```yaml
version: 1
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
            avgErrorRate:    0
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

### JSON

```json
{
    "version": 1,
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
                "avgErrorRate": 0
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

### JavaScript

```javascript
export default {
    "version": 1,
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
