import unknownPropertyObject from './unknownPropertyObject.js';
import Test from 'loader.io.api/dist/Tests/Test.js';
import Url from 'loader.io.api/dist/Tests/Url.js';

/**
 *
 * @param {Object} cli
 * @return {Object}
 */
export default function (cli) {
    return {
        $$strict: 'remove',
        dryRun:   {
            type:     'boolean',
            required: true,
            default:  cli.dryRun,
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
                    values:   [Test.TYPE.CLIENTS_PER_TEST, Test.TYPE.CLIENTS_PER_SECOND, Test.TYPE.MAINTAIN_CLIENT_LOAD],
                    required: true,
                    default:  Test.TYPE.CLIENTS_PER_SECOND,
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
                    type:   'object',
                    strict: 'remove',
                    props:  {
                        path:           {
                            type:     'string',
                            required: true,
                        },
                        type:           {
                            type:     'enum',
                            values:   Object.values(Url.TYPE),
                            required: true,
                            default:  Url.TYPE.GET,
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
                            type:     'object',
                            strict:   false,
                            minProps: 1,
                            optional: true,
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
                                        required: true
                                    },
                                },
                            },
                        },
                    },
                },
            }
        }
    };
}
