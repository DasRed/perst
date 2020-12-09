/** @type {SpyInstance<ReturnType<Required<T>[M]>, ArgsType<Required<T>[M]>>} */
import yargsParser from 'yargs-parser';
/** @type {SpyInstance<ReturnType<Required<T>[M]>, ArgsType<Required<T>[M]>>} */
import help from '../command/help.js';
/** @type {SpyInstance<ReturnType<Required<T>[M]>, ArgsType<Required<T>[M]>>} */
import version from '../command/version.js';
/** @type {SpyInstance<ReturnType<Required<T>[M]>, ArgsType<Required<T>[M]>>} */
import run from '../command/run.js';
/** @type {SpyInstance<ReturnType<Required<T>[M]>, ArgsType<Required<T>[M]>>} */
import config from '../config/index.js';
import execute from '../execute.js';
import cliConfig from '../config/cli.js';
import logger from '../logger.js';

jest.mock('yargs-parser');
jest.mock('../command/help.js');
jest.mock('../command/version.js');
jest.mock('../command/run.js');
jest.mock('../config/index.js');

describe('index.js', () => {
    let processExitSpy;

    beforeEach(() => {
        processExitSpy = jest.spyOn(process, 'exit').mockReturnThis();
        yargsParser.mockClear();
        help.mockClear();
        version.mockClear();
        run.mockClear();
        config.mockClear();
    });

    describe('help', () => {
        let cli         = {
            help:    true,
            version: true
        };
        let environment = {};
        let args        = ['--help', '--version'];

        test.each([
            [undefined, 0],
            [null, 0],
            [0, 0],
            [1, 1],
            [2, 2]
        ])('success', async (result, expected) => {
            yargsParser.mockReturnValue(cli);
            help.mockResolvedValue(result);

            await execute(args, environment);

            expect(yargsParser).toHaveBeenCalledWith(args, cliConfig);
            expect(help).toHaveBeenCalled();
            expect(version).not.toHaveBeenCalled();
            expect(run).not.toHaveBeenCalled();
            expect(processExitSpy).toHaveBeenCalledWith(expected);
        });

        test('error', async () => {
            yargsParser.mockReturnValue(cli);
            help.mockRejectedValue(new Error('narf'));
            const loggerLogSpy = jest.spyOn(logger, 'log').mockReturnThis();

            await execute(args, environment);

            expect(yargsParser).toHaveBeenCalledWith(args, cliConfig);
            expect(help).toHaveBeenCalled();
            expect(version).not.toHaveBeenCalled();
            expect(run).not.toHaveBeenCalled();
            expect(processExitSpy).toHaveBeenCalledWith(1);

            expect(loggerLogSpy).toHaveBeenCalledWith('\u001b[31mnarf\u001b[39m');
        });
    });

    describe('version', () => {
        let cli         = {version: true};
        let environment = {};
        let args        = ['--version'];

        test.each([
            [undefined, 0],
            [null, 0],
            [0, 0],
            [1, 1],
            [2, 2]
        ])('success', async (result, expected) => {
            yargsParser.mockReturnValue(cli);
            version.mockResolvedValue(result);

            await execute(args, environment);

            expect(yargsParser).toHaveBeenCalledWith(args, cliConfig);
            expect(help).not.toHaveBeenCalled();
            expect(version).toHaveBeenCalled();
            expect(run).not.toHaveBeenCalled();
            expect(processExitSpy).toHaveBeenCalledWith(expected);
        });

        test('error', async () => {
            yargsParser.mockReturnValue(cli);
            version.mockRejectedValue(new Error('narf'));
            const loggerLogSpy = jest.spyOn(logger, 'log').mockReturnThis();

            await execute(args, environment);

            expect(yargsParser).toHaveBeenCalledWith(args, cliConfig);
            expect(help).not.toHaveBeenCalled();
            expect(version).toHaveBeenCalled();
            expect(run).not.toHaveBeenCalled();
            expect(processExitSpy).toHaveBeenCalledWith(1);

            expect(loggerLogSpy).toHaveBeenCalledWith('\u001b[31mnarf\u001b[39m');
        });
    });

    describe('run', () => {
        let cli         = {};
        let environment = {};
        let args        = [];
        let configValue = {};

        test.each([
            [undefined, 0],
            [null, 0],
            [0, 0],
            [1, 1],
            [2, 2]
        ])('success', async (result, expected) => {
            config.mockReturnValue(configValue);
            yargsParser.mockReturnValue(cli);
            run.mockResolvedValue(result);

            await execute(args, environment);

            expect(yargsParser).toHaveBeenCalledWith(args, cliConfig);
            expect(help).not.toHaveBeenCalled();
            expect(version).not.toHaveBeenCalled();
            expect(run).toHaveBeenCalledWith(configValue);
            expect(processExitSpy).toHaveBeenCalledWith(expected);
            expect(config).toHaveBeenCalledWith(cli, environment);
        });

        describe('error', () => {
            test('general', async () => {
                config.mockReturnValue(configValue);
                yargsParser.mockReturnValue(cli);
                run.mockRejectedValue(new Error('narf'));
                const loggerLogSpy = jest.spyOn(logger, 'log').mockReturnThis();

                await execute(args, environment);

                expect(yargsParser).toHaveBeenCalledWith(args, cliConfig);
                expect(help).not.toHaveBeenCalled();
                expect(version).not.toHaveBeenCalled();
                expect(run).toHaveBeenCalled();
                expect(processExitSpy).toHaveBeenCalledWith(1);
                expect(config).toHaveBeenCalledWith(cli, environment);

                expect(loggerLogSpy).toHaveBeenCalledWith('\u001b[31mnarf\u001b[39m');
            });

            test.each([
                ['no config found', null],
                ['', 'ENOENT'],
            ])('%s', async (message, code) => {
                const error = new Error(message);
                error.code = code;

                config.mockReturnValue(configValue);
                yargsParser.mockReturnValue(cli);
                run.mockRejectedValue(error);
                const loggerLogSpy = jest.spyOn(logger, 'log').mockReturnThis();

                await execute(args, environment);

                expect(yargsParser).toHaveBeenCalledWith(args, cliConfig);
                expect(help).not.toHaveBeenCalled();
                expect(version).not.toHaveBeenCalled();
                expect(run).toHaveBeenCalled();
                expect(processExitSpy).toHaveBeenCalledWith(1);
                expect(config).toHaveBeenCalledWith(cli, environment);

                expect(loggerLogSpy).toHaveBeenCalledWith('\u001b[31mNo configuration file can be found.\u001b[39m');
            });
        });
    });
});
