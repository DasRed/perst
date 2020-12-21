import LoaderIO from 'loader.io.api/dist/LoaderIO.js';
import Task from '../../Task/Task.js';
import createTasks from '../create.js';
/** @type {SpyInstance<ReturnType<Required<T>[M]>, ArgsType<Required<T>[M]>>} */
import validateDomain from '../../domain/validate.js';
import logger from '../../logger.js';

jest.mock('../../domain/validate.js');

describe('create.js', () => {
    let loaderIO;
    let taskOptionsNuff;
    let taskOptionsNarf;

    let config = {
        filter: undefined,
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

    beforeEach(() => {
        loaderIO          = undefined;
        taskOptionsNuff   = {name: 'rofl'};
        taskOptionsNarf   = {name: 'copter'};
        config.filter     = undefined;
        config.tasks.nuff = taskOptionsNuff;
        config.tasks.narf = taskOptionsNarf;
    });

    describe('success', () => {
        test('with filter', async () => {
            config.filter = 'fl$';

            const loggerLogSpy = jest.spyOn(logger, 'log').mockReturnThis();

            validateDomain.mockResolvedValue(true);

            const tasks = await createTasks(config);

            expect(tasks).toHaveLength(1);
            expect(tasks[0]).toBeInstanceOf(Task);
            expect(tasks[0].name).toBe('rofl');

            expect(loggerLogSpy).toHaveBeenCalledTimes(1);
            expect(loggerLogSpy).toHaveBeenNthCalledWith(1, "Using domain \u001b[32mhttps://www.nuff.narf\u001b[39m");

            expect(validateDomain).toHaveBeenCalledWith(expect.any(LoaderIO), config);
        });

        test('without filter', async () => {
            const loggerLogSpy = jest.spyOn(logger, 'log').mockReturnThis();

            validateDomain.mockResolvedValue(true);

            const tasks = await createTasks(config);

            expect(tasks).toHaveLength(2);
            expect(tasks[0]).toBeInstanceOf(Task);
            expect(tasks[0].name).toBe('rofl');
            expect(tasks[1]).toBeInstanceOf(Task);
            expect(tasks[1].name).toBe('copter');

            expect(loggerLogSpy).toHaveBeenCalledTimes(1);
            expect(loggerLogSpy).toHaveBeenNthCalledWith(1, "Using domain \u001b[32mhttps://www.nuff.narf\u001b[39m");

            expect(validateDomain).toHaveBeenCalledWith(expect.any(LoaderIO), config);
        });
    });

    test('failed by domain validation', async () => {
        const loggerLogSpy = jest.spyOn(logger, 'log').mockReturnThis();

        validateDomain.mockResolvedValue(false);

        try {
            await createTasks(config);
        }
        catch (error) {
            expect(error.message).toBe("Domain https://www.nuff.narf is not registered or not validated!");
        }

        expect(loggerLogSpy).toHaveBeenCalledTimes(1);
        expect(loggerLogSpy).toHaveBeenNthCalledWith(1, "Using domain \u001b[32mhttps://www.nuff.narf\u001b[39m");
    });
});
