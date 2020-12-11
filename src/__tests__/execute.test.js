/** @type {SpyInstance<ReturnType<Required<T>[M]>, ArgsType<Required<T>[M]>>} */
import yargsParser from 'yargs-parser';
/** @type {SpyInstance<ReturnType<Required<T>[M]>, ArgsType<Required<T>[M]>>} */
import configFn from '../config/index.js';
import execute from '../execute.js';
import cliConfig from '../config/cli.js';
import logger from '../logger.js';
/** @type {SpyInstance<ReturnType<Required<T>[M]>, ArgsType<Required<T>[M]>>} */
import createTasks from '../Task/create.js';
import * as commands from '../command/index.js';

jest.mock('yargs-parser');
jest.mock('../config/index.js');
jest.mock('../Task/create.js');
jest.mock('../command/help.js');
jest.mock('../command/version.js');
jest.mock('../command/dumpConfig.js');
jest.mock('../command/run.js');

describe('index.js', () => {
    let processExitSpy;
    let tasks = [];

    beforeEach(() => {
        processExitSpy = jest.spyOn(process, 'exit').mockReturnThis();
        yargsParser.mockClear();
        createTasks.mockClear();
        Object.values(commands).forEach((command) => command.mockClear());
    });

    describe.each([
        ['help', {help: true}],
        ['version', {version: true}],
        ['dumpConfig', {dumpConfig: true}],
        ['run', {}],
    ])('%s', (name, cli) => {
        let environment = {};
        let args        = [];
        let configValue = {};

        describe.each([
            [undefined, 0],
            [null, 0],
            [0, 0],
            [1, 1],
            [2, 2]
        ])('success #%#', (result, expected) => {
            test('without dryRun', async () => {
                configValue.dryRun = false;
                
                const loggerLogSpy = jest.spyOn(logger, 'log').mockReturnThis();

                configFn.mockResolvedValue(configValue);
                yargsParser.mockReturnValue(cli);
                createTasks.mockResolvedValue(tasks);
                commands[name].mockResolvedValue(result);

                await execute(args, environment);

                Object.entries(commands).forEach(([command, spy]) => {
                    if (command === name) {
                        expect(spy).toHaveBeenCalledWith(configValue, tasks);
                    }
                    else {
                        expect(spy).not.toHaveBeenCalled();
                    }
                });

                expect(yargsParser).toHaveBeenCalledWith(args, cliConfig);
                expect(createTasks).toHaveBeenCalledWith(configValue);
                expect(processExitSpy).toHaveBeenCalledWith(expected);
                expect(configFn).toHaveBeenCalledWith(cli, environment);

                expect(loggerLogSpy).not.toHaveBeenCalled();
            });

            test('with dryRun', async () => {
                configValue.dryRun = true;

                const loggerLogSpy = jest.spyOn(logger, 'log').mockReturnThis();

                configFn.mockResolvedValue(configValue);
                yargsParser.mockReturnValue(cli);
                createTasks.mockResolvedValue(tasks);
                commands[name].mockResolvedValue(result);

                await execute(args, environment);

                Object.entries(commands).forEach(([command, spy]) => {
                    if (command === name) {
                        expect(spy).toHaveBeenCalledWith(configValue, tasks);
                    }
                    else {
                        expect(spy).not.toHaveBeenCalled();
                    }
                });

                expect(yargsParser).toHaveBeenCalledWith(args, cliConfig);
                expect(createTasks).toHaveBeenCalledWith(configValue);
                expect(processExitSpy).toHaveBeenCalledWith(expected);
                expect(configFn).toHaveBeenCalledWith(cli, environment);

                expect(loggerLogSpy).toHaveBeenCalledWith("\u001b[33mNote: You running perst in dry run mode. No test will be executed. No test will be created.\u001b[39m");
            });
        });

        describe('error', () => {
            test('general', async () => {
                configValue.dryRun = false;

                const loggerLogSpy = jest.spyOn(logger, 'log').mockReturnThis();
                const error        = new Error('narf');

                configFn.mockResolvedValue(configValue);
                yargsParser.mockReturnValue(cli);
                createTasks.mockResolvedValue(tasks);
                commands[name].mockRejectedValue(error);

                await execute(args, environment);

                Object.entries(commands).forEach(([command, spy]) => {
                    if (command === name) {
                        expect(spy).toHaveBeenCalledWith(configValue, tasks);
                    }
                    else {
                        expect(spy).not.toHaveBeenCalled();
                    }
                });

                expect(yargsParser).toHaveBeenCalledWith(args, cliConfig);
                expect(createTasks).toHaveBeenCalledWith(configValue);
                expect(processExitSpy).toHaveBeenCalledWith(1);
                expect(configFn).toHaveBeenCalledWith(cli, environment);

                expect(loggerLogSpy).toHaveBeenCalledWith(`\u001b[31m${error.message}\u001b[39m\n${error.stack}`);
            });

            test.each([
                ['no config found', null],
                ['', 'ENOENT'],
            ])('%s', async (message, code) => {
                configValue.dryRun = false;

                const loggerLogSpy = jest.spyOn(logger, 'log').mockReturnThis();
                const error        = new Error(message);
                error.code         = code;

                configFn.mockResolvedValue(configValue);
                yargsParser.mockReturnValue(cli);
                createTasks.mockResolvedValue(tasks);
                commands[name].mockRejectedValue(error);

                await execute(args, environment);

                Object.entries(commands).forEach(([command, spy]) => {
                    if (command === name) {
                        expect(spy).toHaveBeenCalledWith(configValue, tasks);
                    }
                    else {
                        expect(spy).not.toHaveBeenCalled();
                    }
                });

                expect(yargsParser).toHaveBeenCalledWith(args, cliConfig);
                expect(createTasks).toHaveBeenCalledWith(configValue);
                expect(processExitSpy).toHaveBeenCalledWith(1);
                expect(configFn).toHaveBeenCalledWith(cli, environment);

                expect(loggerLogSpy).toHaveBeenCalledWith('\u001b[31mNo configuration file can be found.\u001b[39m');
            });
        });
    });
});
