import schema from '../schema.js';
import unknownPropertyObject from '../unknownPropertyObject.js';
import Variable from 'loader.io.api/dist/Tests/Variable.js';

describe('schema.js', () => {
    const request = {
        type:   'object',
        strict: 'remove',
        props:  {
            path:           {
                type:     'string',
                required: true,
            },
            type:           {
                type:     'enum',
                values:   ['GET', 'POST', 'PUT', 'PATCH', 'DELETE'],
                required: true,
                default:  'GET',
            },
            payloadFile:    {
                type:     'url',
                optional: true,
            },
            headers:        {
                type:     'object',
                strict:   false,
                minProps: 1,
                optional: true,
                default:  {
                    'accept-encoding': 'gzip'
                }
            },
            parameters:     {
                type:     'array',
                empty:    false,
                optional: true,
                items:    {
                    type:  'object',
                    props: {
                        name:  {
                            type:     'string',
                            required: true
                        },
                        value: {
                            type:     'string',
                            required: true
                        },
                    },
                },
            },
            authentication: {
                type:     'object',
                optional: true,
                strict:   'remove',
                props:    {
                    type:     {
                        type:     'enum',
                        values:   ['basic'],
                        required: true,
                        default:  'basic',
                    },
                    login:    {
                        type:     'string',
                        required: true,
                    },
                    password: {
                        type:     'string',
                        required: true,
                    },
                },
            },
            variables:      {
                type:     'array',
                empty:    false,
                optional: true,
                items:    {
                    type:  'object',
                    props: {
                        name:     {
                            type:     'string',
                            required: true
                        },
                        property: {
                            type:     'string',
                            required: true
                        },
                        source:   {
                            type:     'string',
                            required: true,
                            values:   [Variable.SOURCE.HEADER],
                            default:  Variable.SOURCE.HEADER,
                        },
                    },
                },
            },
        },
    };

    const config = {
        $$strict: 'remove',
        version:  {
            type:     'number',
            required: true,
            default:  1,
            min:      1,
            max:      1,
            integer:  true,
        },
        api:      {
            type:   'object',
            strict: 'remove',
            props:  {
                token:   {
                    type:     'string',
                    required: true,
                    pattern:  /^[A-fa-f0-9]{32}$/gi,
                },
                server:  {
                    type:     'url',
                    required: true,
                    default:  'https://api.loader.io',
                },
                version: {
                    type:     'enum',
                    values:   ['v2'],
                    required: true,
                    default:  'v2',
                }
            }
        },
        app:      {
            type:   'object',
            strict: 'remove',
            props:  {
                domain: {
                    type:     'url',
                    required: true,
                }
            }
        },
        tasks:    {
            type:     'custom',
            check:    unknownPropertyObject,
            minProps: 1,
            items:    {
                name:           {
                    type:     'string',
                    required: true,
                },
                type:           {
                    type:     'enum',
                    values:   ['per-test', 'per-second', 'maintain-load'],
                    required: true,
                    default:  'per-second',
                },
                duration:       {
                    type:     'number',
                    required: true,
                    integer:  true,
                    min:      60,
                },
                clientsStart:   {
                    type:     'number',
                    required: true,
                    default:  1,
                    integer:  true,
                    min:      0,
                },
                clients:        {
                    type:     'number',
                    required: true,
                    integer:  true,
                    min:      15,
                },
                timeout:        {
                    type:     'number',
                    required: true,
                    default:  10000,
                    integer:  true,
                    positive: true,
                },
                errorThreshold: {
                    type:     'number',
                    required: true,
                    default:  50,
                    integer:  true,
                    min:      0,
                    max:      100,
                },
                notes:          {
                    type:     'string',
                    optional: true,
                },
                tags:           {
                    type:     'array',
                    items:    'string',
                    optional: true,
                },
                threshold:      {
                    type:     'object',
                    strict:   'remove',
                    required: true,
                    default:  {
                        avgResponseTime: 500,
                        avgErrorRate:    50
                    },
                    props:    {
                        avgResponseTime: {
                            type:     'number',
                            required: true,
                            default:  500,
                            integer:  true,
                            positive: true,
                        },
                        avgErrorRate:    {
                            type:     'number',
                            required: true,
                            default:  50,
                            min:      0,
                            max:      100
                        },
                    },
                },
                request:        {
                    optional: true,
                    ...request,
                },
                requests:       {
                    type:     'array',
                    optional: true,
                    items:    request
                }
            }
        }
    };

    test('with defaults', () => {
        const result = schema({});

        expect(result).toEqual({
            filter:        {
                type:     'string',
                default:  undefined,
                optional: true,
            },
            dumpConfig:    {
                type:     'enum',
                default:  undefined,
                values:   [true, 'yaml', 'yml', 'json', 'js'],
                optional: true,
            },
            stopOnFailure: {
                type:     'boolean',
                required: true,
                default:  false,
            },
            dryRun:        {
                type:     'boolean',
                required: true,
                default:  false,
            },
            ci:            {
                type:     'boolean',
                required: true,
                default:  false,
            },
            ...config,
        })
    });

    test('with cli values', () => {
        const result = schema({
            filter:        'narf',
            stopOnFailure: true,
            dryRun:        true,
            ci:            true,
            dumpConfig:    'yaml',
        });

        expect(result).toEqual({
            filter:        {
                type:     'string',
                default:  'narf',
                optional: true,
            },
            dumpConfig:    {
                type:     'enum',
                default:  'yaml',
                values:   [true, 'yaml', 'yml', 'json', 'js'],
                optional: true,
            },
            stopOnFailure: {
                type:     'boolean',
                required: true,
                default:  true,
            },
            dryRun:        {
                type:     'boolean',
                required: true,
                default:  true,
            },
            ci:            {
                type:     'boolean',
                required: true,
                default:  true,
            },
            ...config,
        })
    });
});
