import LoaderIO from 'loader.io.api/dist/LoaderIO.js';
import Task from '../../Task.js';
import run from '../run.js';
/** @type {SpyInstance<ReturnType<Required<T>[M]>, ArgsType<Required<T>[M]>>} */
import validateDomain from '../../domain/validate.js';
import logger from '../../logger.js';

jest.mock('../../domain/validate.js');

describe('runs.js', () => {
    let loaderIO;
    let taskOptionsNuff;
    let taskOptionsNarf;
    let nuffRunResult = Task.RESULT.SUCCESS;

    let config = {
        dryRun: true,
        ci:     true,
        api:    {
            token:   'a',
            server:  'https://www.example.de',
            version: 'v232'
        },
        app:    {domain: 'https://www.nuff.narf'},
        tasks:  {
            nuff: undefined,
            narf: undefined
        }
    };

    const nuffRun = function () {
        /** @var {Task} */
        const task = this;

        loaderIO = task.loaderIO;

        expect(task.loaderIO).toBeInstanceOf(LoaderIO);
        expect(task.loaderIO.tests.client.token).toBe('a');
        expect(task.loaderIO.tests.client.server).toBe('https://www.example.de');
        expect(task.loaderIO.tests.client.version).toBe('v232');
        expect(task.name).toBe('nuff');
        expect(task.options).toBe(taskOptionsNuff);
        expect(task.config).toBe(config);

        task.status = Task.STATUS.FINISHED;
        task.result = nuffRunResult;

        return Promise.resolve(task);
    };

    const narfRun = function () {
        /** @var {Task} */
        const task = this;

        expect(task.loaderIO).toBeInstanceOf(LoaderIO);
        expect(task.loaderIO.tests.client.token).toBe('a');
        expect(task.loaderIO.tests.client.server).toBe('https://www.example.de');
        expect(task.loaderIO.tests.client.version).toBe('v232');
        expect(task.name).toBe('narf');
        expect(task.options).toBe(taskOptionsNarf);
        expect(task.config).toBe(config);

        task.status = Task.STATUS.FINISHED;
        task.result = Task.RESULT.SUCCESS;

        return Promise.resolve(task);
    };

    beforeEach(() => {
        loaderIO          = undefined;
        taskOptionsNuff   = {};
        taskOptionsNarf   = {};
        nuffRunResult     = Task.RESULT.SUCCESS;
        config.dryRun     = true;
        config.tasks.nuff = taskOptionsNuff;
        config.tasks.narf = taskOptionsNarf;
    });

    describe('success', () => {
        test('with dryRun', async () => {
            const taskRunSpy = jest.spyOn(Task.prototype, 'run')
                                   .mockImplementationOnce(nuffRun)
                                   .mockImplementationOnce(narfRun);

            const loggerLogSpy = jest.spyOn(logger, 'log').mockReturnThis();

            validateDomain.mockResolvedValue(true);

            expect(await run(config)).toBe(0);

            expect(loggerLogSpy).toHaveBeenCalledTimes(3);
            expect(loggerLogSpy).toHaveBeenNthCalledWith(1, "\u001b[33mNote: You running perst in dry run mode. No test will be executed. No test will be created.\u001b[39m");
            expect(loggerLogSpy).toHaveBeenNthCalledWith(2, "Using domain \u001b[32mhttps://www.nuff.narf\u001b[39m");
            expect(loggerLogSpy).toHaveBeenNthCalledWith(3, "Found \u001b[93m2\u001b[39m performance test to run.");

            expect(validateDomain).toHaveBeenCalledWith(loaderIO, config);

            expect(taskRunSpy).toHaveBeenCalledTimes(2);
        });

        test('without dryRun', async () => {
            config.dryRun = false;

            const taskRunSpy = jest.spyOn(Task.prototype, 'run')
                                   .mockImplementationOnce(nuffRun)
                                   .mockImplementationOnce(narfRun);

            const loggerLogSpy = jest.spyOn(logger, 'log').mockReturnThis();

            validateDomain.mockResolvedValue(true);

            expect(await run(config)).toBe(0);

            expect(loggerLogSpy).toHaveBeenCalledTimes(2);
            expect(loggerLogSpy).toHaveBeenNthCalledWith(1, "Using domain \u001b[32mhttps://www.nuff.narf\u001b[39m");
            expect(loggerLogSpy).toHaveBeenNthCalledWith(2, "Found \u001b[93m2\u001b[39m performance test to run.");

            expect(validateDomain).toHaveBeenCalledWith(loaderIO, config);

            expect(taskRunSpy).toHaveBeenCalledTimes(2);
        });
    });
    describe('failed', () => {
        describe('by Task', () => {
            test('with dryRun', async () => {
                nuffRunResult = Task.RESULT.FAILED;

                const taskRunSpy = jest.spyOn(Task.prototype, 'run')
                                       .mockImplementationOnce(nuffRun)
                                       .mockImplementationOnce(narfRun);

                const loggerLogSpy = jest.spyOn(logger, 'log').mockReturnThis();

                validateDomain.mockResolvedValue(true);

                expect(await run(config)).toBe(1);

                expect(loggerLogSpy).toHaveBeenCalledTimes(3);
                expect(loggerLogSpy).toHaveBeenNthCalledWith(1, "\u001b[33mNote: You running perst in dry run mode. No test will be executed. No test will be created.\u001b[39m");
                expect(loggerLogSpy).toHaveBeenNthCalledWith(2, "Using domain \u001b[32mhttps://www.nuff.narf\u001b[39m");
                expect(loggerLogSpy).toHaveBeenNthCalledWith(3, "Found \u001b[93m2\u001b[39m performance test to run.");

                expect(validateDomain).toHaveBeenCalledWith(loaderIO, config);

                expect(taskRunSpy).toHaveBeenCalledTimes(2);
            });

            test('without dryRun', async () => {
                config.dryRun = false;
                nuffRunResult = Task.RESULT.FAILED;

                const taskRunSpy = jest.spyOn(Task.prototype, 'run')
                                       .mockImplementationOnce(nuffRun)
                                       .mockImplementationOnce(narfRun);

                const loggerLogSpy = jest.spyOn(logger, 'log').mockReturnThis();

                validateDomain.mockResolvedValue(true);

                expect(await run(config)).toBe(1);

                expect(loggerLogSpy).toHaveBeenCalledTimes(2);
                expect(loggerLogSpy).toHaveBeenNthCalledWith(1, "Using domain \u001b[32mhttps://www.nuff.narf\u001b[39m");
                expect(loggerLogSpy).toHaveBeenNthCalledWith(2, "Found \u001b[93m2\u001b[39m performance test to run.");

                expect(validateDomain).toHaveBeenCalledWith(loaderIO, config);

                expect(taskRunSpy).toHaveBeenCalledTimes(2);
            });
        });
        describe('by domain validation', () => {
            test('with dryRun', async () => {
                nuffRunResult = Task.RESULT.FAILED;

                const taskRunSpy = jest.spyOn(Task.prototype, 'run')
                                       .mockImplementationOnce(nuffRun)
                                       .mockImplementationOnce(narfRun);

                const loggerLogSpy = jest.spyOn(logger, 'log').mockReturnThis();

                validateDomain.mockResolvedValue(false);

                expect(await run(config)).toBe(1);

                expect(loggerLogSpy).toHaveBeenCalledTimes(3);
                expect(loggerLogSpy).toHaveBeenNthCalledWith(1, "\u001b[33mNote: You running perst in dry run mode. No test will be executed. No test will be created.\u001b[39m");
                expect(loggerLogSpy).toHaveBeenNthCalledWith(2, "Using domain \u001b[32mhttps://www.nuff.narf\u001b[39m");
                expect(loggerLogSpy).toHaveBeenNthCalledWith(3, "\u001b[31mDomain https://www.nuff.narf is not registered or not validated!\u001b[39m");

                expect(taskRunSpy).not.toHaveBeenCalled();
            });

            test('without dryRun', async () => {
                config.dryRun = false;
                nuffRunResult = Task.RESULT.FAILED;

                const taskRunSpy = jest.spyOn(Task.prototype, 'run')
                                       .mockImplementationOnce(nuffRun)
                                       .mockImplementationOnce(narfRun);

                const loggerLogSpy = jest.spyOn(logger, 'log').mockReturnThis();

                validateDomain.mockResolvedValue(false);

                expect(await run(config)).toBe(1);

                expect(loggerLogSpy).toHaveBeenCalledTimes(2);
                expect(loggerLogSpy).toHaveBeenNthCalledWith(1, "Using domain \u001b[32mhttps://www.nuff.narf\u001b[39m");
                expect(loggerLogSpy).toHaveBeenNthCalledWith(2, "\u001b[31mDomain https://www.nuff.narf is not registered or not validated!\u001b[39m");

                expect(taskRunSpy).not.toHaveBeenCalled();
            });
        });
    });
});
