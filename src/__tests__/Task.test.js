import LoaderIO from 'loader.io.api/dist/LoaderIO.js';
import Test from 'loader.io.api/dist/Tests/Test.js';
import Url from 'loader.io.api/dist/Tests/Url.js';
import Result from 'loader.io.api/dist/Tests/Result.js';
import Authentication from 'loader.io.api/dist/Tests/Authentication.js';
import Variable from 'loader.io.api/dist/Tests/Variable.js';
import Task from '../Task.js';
import Output from '../Task/Output.js';
import ResultFinder from '../ResultFinder.js';

describe('Task', () => {
    const options = {
        name:         'nuff',
        duration:     42,
        timeout:      22,
        notes:        'narf',
        tags:         'rofl',
        clientsStart: 12,
        clients:      16,
        type:         Test.TYPE.CLIENTS_PER_SECOND,
        threshold:    {
            avgResponseTime: 250,
            avgErrorRate:    100,
        },
        request:      {
            path:           '/rolf/copter',
            type:           Url.TYPE.DELETE,
            payloadFile:    'file',
            headers:        {'lol': 'rofl'},
            parameters:     {},
            authentication: {
                login:    'login',
                password: 'password',
                type:     'basic',
            },
            variables:      [{
                name:     'variable 1',
                property: 'variable 1',
                source:   'variable 1',
            }],
        },
    };

    test('.constructor()', () => {
        const config   = {};
        const loaderIO = new LoaderIO({token: 'a'});

        const task = new Task({
            loaderIO,
            name: 'b',
            options,
            config
        });

        expect(task.loaderIO).toBe(loaderIO);
        expect(task.name).toBe('b');
        expect(task.options).toBe(options);
        expect(task.config).toBe(config);
        expect(task.output).toBeInstanceOf(Output);
        expect(task.output.task).toBe(task);
        expect(task.output.isCI).toBe(false);
        expect(task.resultFinder).toBeInstanceOf(ResultFinder);
        expect(task.resultFinder.loaderIO).toBe(loaderIO);
        expect(task.resultFinder.dryRun).toBe(false);
        expect(task.status).toBe(Task.STATUS.PENDING);
        expect(task.result).toBe(Task.RESULT.PENDING);
        expect(task.values).toBeInstanceOf(Object);
        expect(task.values.avgResponseTime).toBeUndefined();
        expect(task.values.avgErrorRate).toBeUndefined();
    });

    describe('.createAndRun()', () => {
        test('without dryRun', async () => {
            const test = new Test({}, {});

            const config    = {
                dryRun: false,
                app:    {domain: 'https://www.example.de/'}
            };
            const loaderIO  = new LoaderIO({token: 'a'});
            const createSpy = jest.spyOn(loaderIO.tests, 'create').mockResolvedValue(test);

            const task = new Task({
                loaderIO,
                name: 'b',
                options,
                config
            });

            expect(await task.createAndRun()).toBe(test);
            expect(createSpy).toHaveBeenCalledTimes(1);
            expect(createSpy.mock.calls).toHaveLength(1);
            expect(createSpy.mock.calls[0]).toHaveLength(1);

            const param = createSpy.mock.calls[0][0];
            expect(param).toBeInstanceOf(Object);
            expect(param.name).toBe(options.name);
            expect(param.duration).toBe(options.duration);
            expect(param.timeout).toBe(options.timeout);
            expect(param.notes).toBe(options.notes);
            expect(param.tag_names).toBe(options.tags);
            expect(param.initial).toBe(options.clientsStart);
            expect(param.total).toBe(options.clients);
            expect(param.test_type).toBe(options.type);
            expect(param.urls).toBeInstanceOf(Array);
            expect(param.urls).toHaveLength(1);
            expect(param.urls[0]).toBeInstanceOf(Object);
            expect(param.urls[0].url).toBe('https://www.example.de/rolf/copter');
            expect(param.urls[0].request_type).toBe(options.request.type);
            expect(param.urls[0].payload_file_url).toBe(options.request.payloadFile);
            expect(param.urls[0].headers).toBe(options.request.headers);
            expect(param.urls[0].request_params).toBe(options.request.parameters);
            expect(param.urls[0].authentication).toBe(options.request.authentication);
            expect(param.urls[0].variables).toBe(options.request.variables);
        });

        test('with dryRun', async () => {
            const config    = {
                dryRun: true,
                app:    {domain: 'https://www.example.de/'}
            };
            const loaderIO  = new LoaderIO({token: 'a'});
            const createSpy = jest.spyOn(loaderIO.tests, 'create');

            const task = new Task({
                loaderIO,
                name: 'b',
                options,
                config
            });
            const test = await task.createAndRun();
            expect(test).toBeInstanceOf(Test);
            expect(createSpy).toHaveBeenCalledTimes(0);

            expect(test).toBeInstanceOf(Object);
            expect(test.client).toBe(loaderIO);
            expect(test.status).toBe(Test.STATUS.COMPLETE);
            expect(test.test_id).toMatch(/^dryRun-randomId-[0-9]{7}$/);
            expect(test.name).toBe(options.name);
            expect(test.duration).toBe(options.duration);
            expect(test.timeout).toBe(options.timeout);
            expect(test.notes).toBe(options.notes);
            expect(test.tag_names).toBe(options.tags);
            expect(test.initial).toBe(options.clientsStart);
            expect(test.total).toBe(options.clients);
            expect(test.test_type).toBe(options.type);
            expect(test.urls).toBeInstanceOf(Array);
            expect(test.urls).toHaveLength(1);
            expect(test.urls[0]).toBeInstanceOf(Url);
            expect(test.urls[0].url).toBe('https://www.example.de/rolf/copter');
            expect(test.urls[0].request_type).toBe(options.request.type);
            expect(test.urls[0].payload_file_url).toBe(options.request.payloadFile);
            expect(test.urls[0].headers).toBe(options.request.headers);
            expect(test.urls[0].request_params).toBe(options.request.parameters);
            expect(test.urls[0].authentication).toBeInstanceOf(Authentication);
            expect(test.urls[0].authentication.login).toBe(options.request.authentication.login);
            expect(test.urls[0].authentication.password).toBe(options.request.authentication.password);
            expect(test.urls[0].authentication.type).toBe(options.request.authentication.type);
            expect(test.urls[0].variables).toHaveLength(1);
            expect(test.urls[0].variables[0]).toBeInstanceOf(Variable);
            expect(test.urls[0].variables[0].name).toBe(options.request.variables[0].name);
            expect(test.urls[0].variables[0].property).toBe(options.request.variables[0].property);
            expect(test.urls[0].variables[0].source).toBe(options.request.variables[0].source);
        });
    });

    describe('.rerun()', () => {
        test('without dryRun', async () => {
            const test   = new Test({}, {});
            const runSpy = jest.spyOn(test, 'run').mockResolvedValue(test);
            test.status  = Test.STATUS.PENDING;

            const config   = {
                dryRun: false,
                app:    {domain: 'https://www.example.de/'}
            };
            const loaderIO = new LoaderIO({token: 'a'});

            const task = new Task({
                loaderIO,
                name: 'b',
                options,
                config
            });

            const result = await task.rerun(test);

            expect(result).toBe(test);
            expect(result.status).toBe(Test.STATUS.PENDING);
            expect(runSpy).toHaveBeenCalled();
        });
        test('with dryRun', async () => {
            const test   = new Test({}, {});
            const runSpy = jest.spyOn(test, 'run').mockResolvedValue(test);
            test.status  = Test.STATUS.PENDING;

            const config   = {
                dryRun: true,
                app:    {domain: 'https://www.example.de/'}
            };
            const loaderIO = new LoaderIO({token: 'a'});

            const task = new Task({
                loaderIO,
                name: 'b',
                options,
                config
            });

            const result = await task.rerun(test);

            expect(result).toBe(test);
            expect(result.status).toBe(Test.STATUS.COMPLETE);
            expect(runSpy).not.toHaveBeenCalled();
        });
    });

    describe('.validate()', () => {
        test.each([
            [0, 0, Task.RESULT.SUCCESS],
            [100, 0, Task.RESULT.SUCCESS],
            [250, 0, Task.RESULT.SUCCESS],
            [251, 0, Task.RESULT.FAILED],
            [200, 50, Task.RESULT.SUCCESS],
            [200, 100, Task.RESULT.SUCCESS],
            [200, 101, Task.RESULT.FAILED],
        ])('#%#', (avgResponseTime, avgErrorRate, expectedResult) => {
            const task = new Task({
                loaderIO: new LoaderIO({token: 'a'}),
                name:     'b',
                options,
                config:   {app: {domain: 'https://www.example.de/'}}
            });

            task.values.avgResponseTime = avgResponseTime;
            task.values.avgErrorRate    = avgErrorRate;

            expect(task.result).toBe(Task.RESULT.PENDING);
            expect(task.validate()).toBe(task);
            expect(task.result).toBe(expectedResult);
        });
    });

    describe('.run()', () => {
        test('with rerun', async () => {
            const testA = new Test({}, {name: 'nuff'});
            const testB = new Test({}, {name: 'narf'});

            const config = {
                dryRun: false,
                app:    {domain: 'https://www.example.de/'}
            };

            const loaderIO = new LoaderIO({token: 'a'});

            const result = new Result({
                avg_response_time: 42,
                avg_error_rate:    22
            });

            const task = new Task({
                loaderIO,
                name: 'b',
                options,
                config
            });

            const outputAlreadyFinishedSpy = jest.spyOn(task.output, 'alreadyFinished').mockReturnThis();
            const outputStartSpy           = jest.spyOn(task.output, 'start').mockReturnThis();
            const outputEndSpy             = jest.spyOn(task.output, 'end').mockReturnThis();

            const loaderIOTestsListSpy = jest.spyOn(loaderIO.tests, 'list').mockImplementation(async () => {
                expect(task.status).toBe(Task.STATUS.RUNNING);

                return [testB, testA];
            });

            const taskRerunSpy        = jest.spyOn(task, 'rerun').mockResolvedValue(testA);
            const taskCreateAndRunSpy = jest.spyOn(task, 'createAndRun').mockResolvedValue(testA);
            const taskValidateSpy     = jest.spyOn(task, 'validate').mockReturnThis();

            const resultFinderFindSpy = jest.spyOn(task.resultFinder, 'find').mockResolvedValue(result)

            expect(await task.run()).toBe(task);

            expect(outputAlreadyFinishedSpy).not.toHaveBeenCalled();
            expect(outputStartSpy).toHaveBeenCalled();
            expect(outputEndSpy).toHaveBeenCalled();

            expect(loaderIOTestsListSpy).toHaveBeenCalled();

            expect(taskRerunSpy).toHaveBeenCalledWith(testA);
            expect(taskCreateAndRunSpy).not.toHaveBeenCalled();
            expect(taskValidateSpy).toHaveBeenCalled();

            expect(resultFinderFindSpy).toHaveBeenCalledWith(testA);

            expect(task.status).toBe(Task.STATUS.FINISHED);
            expect(task.values.avgResponseTime).toBe(42);
            expect(task.values.avgErrorRate).toBe(22);
        });

        test('with create', async () => {
            const testA = new Test({}, {name: 'rofl'});
            const testB = new Test({}, {name: 'narf'});

            const config = {
                dryRun: false,
                app:    {domain: 'https://www.example.de/'}
            };

            const loaderIO = new LoaderIO({token: 'a'});

            const result = new Result({
                avg_response_time: 42,
                avg_error_rate:    22
            });

            const task = new Task({
                loaderIO,
                name: 'b',
                options,
                config
            });

            const outputAlreadyFinishedSpy = jest.spyOn(task.output, 'alreadyFinished').mockReturnThis();
            const outputStartSpy           = jest.spyOn(task.output, 'start').mockReturnThis();
            const outputEndSpy             = jest.spyOn(task.output, 'end').mockReturnThis();

            const loaderIOTestsListSpy = jest.spyOn(loaderIO.tests, 'list').mockImplementation(async () => {
                expect(task.status).toBe(Task.STATUS.RUNNING);

                return [testB, testA];
            });

            const taskRerunSpy        = jest.spyOn(task, 'rerun').mockResolvedValue(testA);
            const taskCreateAndRunSpy = jest.spyOn(task, 'createAndRun').mockResolvedValue(testA);
            const taskValidateSpy     = jest.spyOn(task, 'validate').mockReturnThis();

            const resultFinderFindSpy = jest.spyOn(task.resultFinder, 'find').mockResolvedValue(result)

            expect(await task.run()).toBe(task);

            expect(outputAlreadyFinishedSpy).not.toHaveBeenCalled();
            expect(outputStartSpy).toHaveBeenCalled();
            expect(outputEndSpy).toHaveBeenCalled();

            expect(loaderIOTestsListSpy).toHaveBeenCalled();

            expect(taskRerunSpy).not.toHaveBeenCalledWith(testA);
            expect(taskCreateAndRunSpy).toHaveBeenCalled();
            expect(taskValidateSpy).toHaveBeenCalled();

            expect(resultFinderFindSpy).toHaveBeenCalledWith(testA);

            expect(task.status).toBe(Task.STATUS.FINISHED);
            expect(task.values.avgResponseTime).toBe(42);
            expect(task.values.avgErrorRate).toBe(22);
        });

        test('already finished', async () => {
            const config = {
                dryRun: false,
                app:    {domain: 'https://www.example.de/'}
            };

            const loaderIO = new LoaderIO({token: 'a'});

            const task = new Task({
                loaderIO,
                name: 'b',
                options,
                config
            });
            task.status = Task.STATUS.FINISHED;

            const outputAlreadyFinishedSpy = jest.spyOn(task.output, 'alreadyFinished').mockReturnThis();
            const outputStartSpy           = jest.spyOn(task.output, 'start');
            const outputEndSpy             = jest.spyOn(task.output, 'end');

            const loaderIOTestsListSpy = jest.spyOn(loaderIO.tests, 'list');

            const taskRerunSpy        = jest.spyOn(task, 'rerun');
            const taskCreateAndRunSpy = jest.spyOn(task, 'createAndRun');
            const taskValidateSpy     = jest.spyOn(task, 'validate');

            const resultFinderFindSpy = jest.spyOn(task.resultFinder, 'find');

            expect(await task.run()).toBe(task);

            expect(outputAlreadyFinishedSpy).toHaveBeenCalled();
            expect(outputStartSpy).not.toHaveBeenCalled();
            expect(outputEndSpy).not.toHaveBeenCalled();

            expect(loaderIOTestsListSpy).not.toHaveBeenCalled();

            expect(taskRerunSpy).not.toHaveBeenCalled();
            expect(taskCreateAndRunSpy).not.toHaveBeenCalled();
            expect(taskValidateSpy).not.toHaveBeenCalled();

            expect(resultFinderFindSpy).not.toHaveBeenCalled();
        });
    });
});
