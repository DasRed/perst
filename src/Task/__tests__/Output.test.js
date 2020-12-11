import Output from '../Output.js';
import Task from '../Task.js';
import LoaderIO from 'loader.io.api/dist/LoaderIO.js';
import logger from '../../logger.js';

describe('Output', () => {
    test('.constructor()', () => {
        const loaderIO = new LoaderIO({token: 'a'});
        const task     = new Task({
            loaderIO,
            config: {}
        });
        const output   = new Output(task, true);

        expect(output.task).toBe(task);
        expect(output.isCI).toBe(true);
        expect(output.interval).toBeNull();
        expect(output.timeStart).toBeNull();
    });

    test('.alreadyFinished()', () => {
        const loggerLogSpy = jest.spyOn(logger, 'log').mockReturnThis();

        const loaderIO = new LoaderIO({token: 'a'});
        const task     = new Task({
            loaderIO,
            name:   'narf',
            config: {}
        });
        const output   = new Output(task, true);

        expect(output.alreadyFinished()).toBe(output);
        expect(loggerLogSpy).toHaveBeenCalledWith("\u001b[31m✘\u001b[39m Task \u001b[31mnarf\u001b[39m already started.");
    });

    describe('.start()', () => {
        test('isCI = false', () => {
            jest.useFakeTimers();
            jest.clearAllTimers();

            const timestampBefore = (new Date()).getTime();
            const loggerLogSpy    = jest.spyOn(logger, 'log').mockReturnThis();

            const loaderIO = new LoaderIO({token: 'a'});
            const task     = new Task({
                loaderIO,
                name:   'narf',
                config: {}
            });
            const output   = new Output(task, false);

            expect(output.start()).toBe(output);
            expect(output.timeStart).toBeGreaterThanOrEqual(timestampBefore);
            expect(output.timeStart).toBeLessThanOrEqual((new Date()).getTime());

            expect(loggerLogSpy).toHaveBeenCalledTimes(1);
            expect(loggerLogSpy).toHaveBeenCalledWith('\r\u001b[33m•\u001b[39m Task \u001b[32mnarf\u001b[39m', false);

            expect(setInterval).toHaveBeenLastCalledWith(expect.any(Function), 10);
            const intervalCallbackFunction = setInterval.mock.calls[0][0];
            intervalCallbackFunction();
            expect(loggerLogSpy).toHaveBeenCalledTimes(2);
            expect(loggerLogSpy).toHaveBeenNthCalledWith(2, expect.stringMatching(/^\r\u001b\[33m•\u001b\[39m Task \u001b\[32mnarf\u001b\[39m \([0-9]ms\)\s.*?$/), false);
        });

        test('isCI = true', () => {
            jest.useFakeTimers();
            jest.clearAllTimers();

            const timestampBefore = (new Date()).getTime();
            const loggerLogSpy    = jest.spyOn(logger, 'log').mockReturnThis();

            const loaderIO = new LoaderIO({token: 'a'});
            const task     = new Task({
                loaderIO,
                name:   'narf',
                config: {}
            });
            const output   = new Output(task, true);

            expect(output.start()).toBe(output);
            expect(output.timeStart).toBeGreaterThanOrEqual(timestampBefore);
            expect(output.timeStart).toBeLessThanOrEqual((new Date()).getTime());

            expect(loggerLogSpy).toHaveBeenCalledTimes(1);
            expect(loggerLogSpy).toHaveBeenCalledWith('\r\u001b[33m•\u001b[39m Task \u001b[32mnarf\u001b[39m', false);

            expect(setInterval).toHaveBeenLastCalledWith(expect.any(Function), 1000);
            const intervalCallbackFunction = setInterval.mock.calls[0][0];
            intervalCallbackFunction();
            expect(loggerLogSpy).toHaveBeenCalledTimes(2);
            expect(loggerLogSpy).toHaveBeenNthCalledWith(2, '.', false);
        });
    });

    describe('.end()', () => {
        describe('isCI = false', () => {
            test('result === Task.RESULT.FAILED', () => {
                jest.useFakeTimers();
                jest.clearAllTimers();

                const loggerLogSpy = jest.spyOn(logger, 'log').mockReturnThis();

                const loaderIO              = new LoaderIO({token: 'a'});
                const task                  = new Task({
                    loaderIO,
                    name:    'narf',
                    config:  {},
                    options: {
                        threshold: {
                            avgResponseTime: 42,
                            avgErrorRate:    22,
                        }
                    }
                });
                task.result                 = Task.RESULT.FAILED;
                task.values.avgResponseTime = 16;
                task.values.avgErrorRate    = 19;

                const output     = new Output(task, false);
                output.interval  = 42;
                output.timeStart = (new Date()).getTime();

                expect(output.end()).toBe(output);

                expect(loggerLogSpy).toHaveBeenCalledTimes(4);
                expect(loggerLogSpy).toHaveBeenNthCalledWith(1, '\r', false);
                expect(loggerLogSpy).toHaveBeenNthCalledWith(2, expect.stringMatching(/^\u001b\[31m✘\u001b\[39m︎ Task \u001b\[32mnarf\u001b\[39m \([0-9]ms\)\s.*?$/));
                expect(loggerLogSpy).toHaveBeenNthCalledWith(3, expect.stringMatching(/^\s.*?AVG Response Time: \u001b\[31m[0-9].*?\u001b\[39m ms \(Threshold: \u001b\[33m42\u001b\[39m ms\)$/));
                expect(loggerLogSpy).toHaveBeenNthCalledWith(4, expect.stringMatching(/^\s.*?AVG Error Rate: \u001b\[31m[0-9].*?\u001b\[39m \(Threshold: \u001b\[33m22\u001b\[39m\)$/));
            });

            test('result === Task.RESULT.SUCCESS', () => {
                jest.useFakeTimers();
                jest.clearAllTimers();

                const loggerLogSpy = jest.spyOn(logger, 'log').mockReturnThis();

                const loaderIO              = new LoaderIO({token: 'a'});
                const task                  = new Task({
                    loaderIO,
                    name:    'narf',
                    config:  {},
                    options: {
                        threshold: {
                            avgResponseTime: 42,
                            avgErrorRate:    22,
                        }
                    }
                });
                task.result                 = Task.RESULT.SUCCESS;
                task.values.avgResponseTime = 16;
                task.values.avgErrorRate    = 19;

                const output     = new Output(task, false);
                output.interval  = 42;
                output.timeStart = (new Date()).getTime();

                expect(output.end()).toBe(output);

                expect(loggerLogSpy).toHaveBeenCalledTimes(4);
                expect(loggerLogSpy).toHaveBeenNthCalledWith(1, '\r', false);
                expect(loggerLogSpy).toHaveBeenNthCalledWith(2, expect.stringMatching(/^\u001b\[32m✔\u001b\[39m︎ Task \u001b\[32mnarf\u001b\[39m \([0-9]ms\)\s.*?$/));
                expect(loggerLogSpy).toHaveBeenNthCalledWith(3, expect.stringMatching(/^\s.*?AVG Response Time: \u001b\[32m[0-9].*?\u001b\[39m ms \(Threshold: \u001b\[33m42\u001b\[39m ms\)$/));
                expect(loggerLogSpy).toHaveBeenNthCalledWith(4, expect.stringMatching(/^\s.*?AVG Error Rate: \u001b\[32m[0-9].*?\u001b\[39m \(Threshold: \u001b\[33m22\u001b\[39m\)$/));
            });
        });

        describe('isCI = true', () => {
            test('result === Task.RESULT.FAILED', () => {
                jest.useFakeTimers();
                jest.clearAllTimers();

                const loggerLogSpy = jest.spyOn(logger, 'log').mockReturnThis();

                const loaderIO              = new LoaderIO({token: 'a'});
                const task                  = new Task({
                    loaderIO,
                    name:    'narf',
                    config:  {},
                    options: {
                        threshold: {
                            avgResponseTime: 42,
                            avgErrorRate:    22,
                        }
                    }
                });
                task.result                 = Task.RESULT.FAILED;
                task.values.avgResponseTime = 16;
                task.values.avgErrorRate    = 19;

                const output     = new Output(task, true);
                output.interval  = 42;
                output.timeStart = (new Date()).getTime();

                expect(output.end()).toBe(output);

                expect(loggerLogSpy).toHaveBeenCalledTimes(4);
                expect(loggerLogSpy).toHaveBeenNthCalledWith(1, '', true);
                expect(loggerLogSpy).toHaveBeenNthCalledWith(2, expect.stringMatching(/^\u001b\[31m✘\u001b\[39m︎ Task \u001b\[32mnarf\u001b\[39m$/));
                expect(loggerLogSpy).toHaveBeenNthCalledWith(3, expect.stringMatching(/^\s.*?AVG Response Time: \u001b\[31m[0-9].*?\u001b\[39m ms \(Threshold: \u001b\[33m42\u001b\[39m ms\)$/));
                expect(loggerLogSpy).toHaveBeenNthCalledWith(4, expect.stringMatching(/^\s.*?AVG Error Rate: \u001b\[31m[0-9].*?\u001b\[39m \(Threshold: \u001b\[33m22\u001b\[39m\)$/));
            });

            test('result === Task.RESULT.SUCCESS', () => {
                jest.useFakeTimers();
                jest.clearAllTimers();

                const loggerLogSpy = jest.spyOn(logger, 'log').mockReturnThis();

                const loaderIO              = new LoaderIO({token: 'a'});
                const task                  = new Task({
                    loaderIO,
                    name:    'narf',
                    config:  {},
                    options: {
                        threshold: {
                            avgResponseTime: 42,
                            avgErrorRate:    22,
                        }
                    }
                });
                task.result                 = Task.RESULT.SUCCESS;
                task.values.avgResponseTime = 16;
                task.values.avgErrorRate    = 19;

                const output     = new Output(task, true);
                output.interval  = 42;
                output.timeStart = (new Date()).getTime();

                expect(output.end()).toBe(output);

                expect(loggerLogSpy).toHaveBeenCalledTimes(4);
                expect(loggerLogSpy).toHaveBeenNthCalledWith(1, '', true);
                expect(loggerLogSpy).toHaveBeenNthCalledWith(2, expect.stringMatching(/^\u001b\[32m✔\u001b\[39m︎ Task \u001b\[32mnarf\u001b\[39m$/));
                expect(loggerLogSpy).toHaveBeenNthCalledWith(3, expect.stringMatching(/^\s.*?AVG Response Time: \u001b\[32m[0-9].*?\u001b\[39m ms \(Threshold: \u001b\[33m42\u001b\[39m ms\)$/));
                expect(loggerLogSpy).toHaveBeenNthCalledWith(4, expect.stringMatching(/^\s.*?AVG Error Rate: \u001b\[32m[0-9].*?\u001b\[39m \(Threshold: \u001b\[33m22\u001b\[39m\)$/));
            });
        });
    });
});
