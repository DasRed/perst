/** @type {SpyInstance<ReturnType<Required<T>[M]>, ArgsType<Required<T>[M]>>} */
import yargsParser from 'yargs-parser';
/** @type {SpyInstance<ReturnType<Required<T>[M]>, ArgsType<Required<T>[M]>>} */
import configFn from '../config/index.js';
import execute from '../execute.js';
import cliConfig from '../config/cli.js';
import logger from '../logger.js';
/** @type {SpyInstance<ReturnType<Required<T>[M]>, ArgsType<Required<T>[M]>>} */
import createTasks from '../Task/create.js';
import Commands from '../command/index.js';

jest.mock('yargs-parser');
jest.mock('../config/index.js');
jest.mock('../Task/create.js');
jest.mock('../command/help.js');
jest.mock('../command/version.js');
jest.mock('../command/dumpConfig.js');
jest.mock('../command/run.js');
jest.mock('../command/listTasks.js');

describe('index.js', () => {
    let processExitSpy;
    let tasks = [];

    beforeEach(() => {
        processExitSpy = jest.spyOn(process, 'exit').mockReturnThis();
        yargsParser.mockClear();
        createTasks.mockClear();
        Object.values(Commands).forEach((command) => command.mockClear());
    });

    describe.each([
        ['help', {help: true}],
        ['version', {version: true}],
        ['dumpConfig', {dumpConfig: true}],
        ['listTasks', {listTasks: true}],
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
                cli.silent = false;
                configValue.dryRun = false;

                const loggerLogSpy = jest.spyOn(logger, 'log').mockReturnThis();

                configFn.mockResolvedValue(configValue);
                yargsParser.mockReturnValue(cli);
                createTasks.mockResolvedValue(tasks);
                Commands[name].mockResolvedValue(result);

                await execute(args, environment);

                Object.entries(Commands).forEach(([command, spy]) => {
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
                expect(loggerLogSpy.silent).toBe(false);
            });

            test('with dryRun', async () => {
                cli.silent = false;
                configValue.dryRun = true;

                const loggerLogSpy = jest.spyOn(logger, 'log').mockReturnThis();

                configFn.mockResolvedValue(configValue);
                yargsParser.mockReturnValue(cli);
                createTasks.mockResolvedValue(tasks);
                Commands[name].mockResolvedValue(result);

                await execute(args, environment);

                Object.entries(Commands).forEach(([command, spy]) => {
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
                expect(loggerLogSpy.silent).toBe(false);
            });

            test('with silent', async () => {
                cli.silent = true;

                const loggerLogSpy = jest.spyOn(logger, 'log').mockReturnThis();

                configFn.mockResolvedValue(configValue);
                yargsParser.mockReturnValue(cli);
                createTasks.mockResolvedValue(tasks);
                Commands[name].mockResolvedValue(result);

                await execute(args, environment);

                Object.entries(Commands).forEach(([command, spy]) => {
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
                expect(loggerLogSpy.silent).toBe(true);
            });
        });

        describe('error', () => {
            test('general', async () => {
                cli.silent = false;
                configValue.dryRun = false;

                const loggerLogSpy = jest.spyOn(logger, 'log').mockReturnThis();
                const error        = new Error('narf');

                configFn.mockResolvedValue(configValue);
                yargsParser.mockReturnValue(cli);
                createTasks.mockResolvedValue(tasks);
                Commands[name].mockRejectedValue(error);

                await execute(args, environment);

                Object.entries(Commands).forEach(([command, spy]) => {
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
                expect(loggerLogSpy.silent).toBe(false);
            });

            test.each([
                ['no config found', null],
                ['', 'ENOENT'],
            ])('%s', async (message, code) => {
                cli.silent = false;
                configValue.dryRun = false;

                const loggerLogSpy = jest.spyOn(logger, 'log').mockReturnThis();
                const error        = new Error(message);
                error.code         = code;

                configFn.mockResolvedValue(configValue);
                yargsParser.mockReturnValue(cli);
                createTasks.mockResolvedValue(tasks);
                Commands[name].mockRejectedValue(error);

                await execute(args, environment);

                Object.entries(Commands).forEach(([command, spy]) => {
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
                expect(loggerLogSpy.silent).toBe(false);
            });
        });
    });
});
