/** @type {SpyInstance<ReturnType<Required<T>[M]>, ArgsType<Required<T>[M]>>} */
import yargsParser from 'yargs-parser';
///** @type {SpyInstance<ReturnType<Required<T>[M]>, ArgsType<Required<T>[M]>>} */
//import help from '../command/help.js';
///** @type {SpyInstance<ReturnType<Required<T>[M]>, ArgsType<Required<T>[M]>>} */
//import version from '../command/version.js';
///** @type {SpyInstance<ReturnType<Required<T>[M]>, ArgsType<Required<T>[M]>>} */
//import run from '../command/run.js';
/** @type {SpyInstance<ReturnType<Required<T>[M]>, ArgsType<Required<T>[M]>>} */
import configFn from '../config/index.js';
import execute from '../execute.js';
import cliConfig from '../config/cli.js';
import logger from '../logger.js';
import * as commands from '../command/index.js';

jest.mock('yargs-parser');
jest.mock('../config/index.js');
jest.mock('../command/help.js');
jest.mock('../command/version.js');
jest.mock('../command/dumpConfig.js');
jest.mock('../command/run.js');

describe('index.js', () => {
    let processExitSpy;

    beforeEach(() => {
        processExitSpy = jest.spyOn(process, 'exit').mockReturnThis();
        yargsParser.mockClear();
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

        test.each([
            [undefined, 0],
            [null, 0],
            [0, 0],
            [1, 1],
            [2, 2]
        ])('success #%#', async (result, expected) => {
            configFn.mockResolvedValue(configValue);
            yargsParser.mockReturnValue(cli);

            commands[name].mockResolvedValue(result);

            await execute(args, environment);

            expect(yargsParser).toHaveBeenCalledWith(args, cliConfig);

            Object.entries(commands).forEach(([command, spy]) => {
                if (command === name) {
                    expect(spy).toHaveBeenCalledWith(configValue);
                }
                else {
                    expect(spy).not.toHaveBeenCalled();
                }
            });

            expect(processExitSpy).toHaveBeenCalledWith(expected);
            expect(configFn).toHaveBeenCalledWith(cli, environment);
        });

        describe('error', () => {
            test('general', async () => {
                const error = new Error('narf');

                configFn.mockResolvedValue(configValue);
                yargsParser.mockReturnValue(cli);

                commands[name].mockRejectedValue(error);

                const loggerLogSpy = jest.spyOn(logger, 'log').mockReturnThis();

                await execute(args, environment);

                expect(yargsParser).toHaveBeenCalledWith(args, cliConfig);

                Object.entries(commands).forEach(([command, spy]) => {
                    if (command === name) {
                        expect(spy).toHaveBeenCalledWith(configValue);
                    }
                    else {
                        expect(spy).not.toHaveBeenCalled();
                    }
                });

                expect(processExitSpy).toHaveBeenCalledWith(1);
                expect(configFn).toHaveBeenCalledWith(cli, environment);

                expect(loggerLogSpy).toHaveBeenCalledWith(`\u001b[31m${error.message}\u001b[39m\n${error.stack}`);
            });

            test.each([
                ['no config found', null],
                ['', 'ENOENT'],
            ])('%s', async (message, code) => {
                const error = new Error(message);
                error.code  = code;

                configFn.mockResolvedValue(configValue);
                yargsParser.mockReturnValue(cli);

                commands[name].mockRejectedValue(error);

                const loggerLogSpy = jest.spyOn(logger, 'log').mockReturnThis();

                await execute(args, environment);

                expect(yargsParser).toHaveBeenCalledWith(args, cliConfig);

                Object.entries(commands).forEach(([command, spy]) => {
                    if (command === name) {
                        expect(spy).toHaveBeenCalledWith(configValue);
                    }
                    else {
                        expect(spy).not.toHaveBeenCalled();
                    }
                });

                expect(processExitSpy).toHaveBeenCalledWith(1);
                expect(configFn).toHaveBeenCalledWith(cli, environment);

                expect(loggerLogSpy).toHaveBeenCalledWith('\u001b[31mNo configuration file can be found.\u001b[39m');
            });
        });
    });
});
