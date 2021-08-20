import ResultFinder from '../ResultFinder.js';
import LoaderIO from 'loader.io.api/dist/LoaderIO.js';
import Test from 'loader.io.api/dist/Tests/Test.js';
import Result from 'loader.io.api/dist/Tests/Result.js';

describe('ResultFinder', () => {
    const loaderIO = new LoaderIO('a');

    describe('.constructor()', () => {
        test('with default', () => {
            const finder = new ResultFinder(loaderIO);

            expect(finder.loaderIO).toBe(loaderIO);
            expect(finder.dryRun).toBe(false);
        });

        describe('with value', () => {
            test.each([
                [true, true],
                [false, false],
                [null, false],
                ['null', true],
                [1, true],
                [0, false],
                [-1, true],
            ])('#%#', (dryRun, expected) => {
                const finder = new ResultFinder(loaderIO, dryRun);

                expect(finder.loaderIO).toBe(loaderIO);
                expect(finder.dryRun).toBe(expected);
            });
        });
    });

    test('.getFirstResultFromTest()', async () => {
        const resultA = new Result({});
        const resultB = new Result({});

        const test          = new Test({}, {});
        const resultListSpy = jest.spyOn(test.results, 'list').mockResolvedValue([resultA, resultB]);

        const finder = new ResultFinder(loaderIO);

        expect(await finder.getFirstResultFromTest(test)).toBe(resultA);
        expect(resultListSpy).toHaveBeenCalled();
    });

    describe('.isResultFinished()', () => {
        test.each([
            [Result.STATUS.READY, true],
            [Result.STATUS.NOT_READY, false],
        ])('#%#', (status, expected) => {
            const result  = new Result({});
            result.status = status;

            const finder = new ResultFinder(loaderIO);

            expect(finder.isResultFinished(result)).toBe(expected);
        });
    });

    describe('.find()', () => {
        test('without dryRun', async () => {
            const test    = new Test({}, {});
            const resultA = new Result({});
            const resultB = new Result({});

            const finder = new ResultFinder(loaderIO);

            const getFirstResultFromTestSpy = jest.spyOn(finder, 'getFirstResultFromTest').mockResolvedValue(resultA);
            const waitForResultSpy          = jest.spyOn(finder, 'waitForResult').mockResolvedValue(resultB);

            expect(await finder.find(test)).toBe(resultB);
            expect(getFirstResultFromTestSpy).toHaveBeenCalledWith(test);
            expect(waitForResultSpy).toHaveBeenCalledWith(test, resultA);
        });

        test('with dryRun', () => {
            jest.useFakeTimers('legacy');
            jest.clearAllTimers();

            const timeNow = (new Date()).getTime();

            const test = new Test({}, {});

            const finder = new ResultFinder(loaderIO, true);

            const getFirstResultFromTestSpy = jest.spyOn(finder, 'getFirstResultFromTest');
            const waitForResultSpy          = jest.spyOn(finder, 'waitForResult');

            finder.find(test).then((result) => {
                expect(getFirstResultFromTestSpy).not.toHaveBeenCalled();
                expect(waitForResultSpy).not.toHaveBeenCalled();

                expect(result).toBeInstanceOf(Result);
                expect(result.result_id).toMatch(/^dryRun-randomId-[0-9]{7}$/);
                expect(result.started_at.getTime()).toBeLessThanOrEqual((new Date()).getTime());
                expect(result.started_at.getTime()).toBeGreaterThanOrEqual(timeNow);
                expect(result.status).toBe(Result.STATUS.READY);
                expect(result.public_results_url).toBe('https://www.example.de');
                expect(result.success).toBe(100);
                expect(result.error).toBe(0);
                expect(result.timeout_error).toBe(0);
                expect(result.network_error).toBe(0);
                expect(result.data_sent).toBeGreaterThanOrEqual(100);
                expect(result.data_sent).toBeLessThanOrEqual(9999);
                expect(result.data_received).toBeGreaterThanOrEqual(1000);
                expect(result.data_received).toBeLessThanOrEqual(9999);
                expect(result.avg_response_time).toBeGreaterThanOrEqual(10);
                expect(result.avg_response_time).toBeLessThanOrEqual(250);
                expect(result.avg_error_rate).toBe(0);
            });

            expect(setTimeout).toHaveBeenCalledWith(expect.any(Function), 2500);
            setTimeout.mock.calls[0][0]();
        });
    });

    test('.waitForResult()', () => {
        jest.useFakeTimers('legacy');
        jest.clearAllTimers();

        const resultA = new Result({result_id: 42});
        const resultB = new Result({result_id: 22});

        const test          = new Test({}, {});
        const resultsGetSpy = jest.spyOn(test.results, 'get').mockResolvedValue(resultB);

        const finder = new ResultFinder(loaderIO);

        const isResultFinishedSpy = jest.spyOn(finder, 'isResultFinished').mockReturnValueOnce(false).mockReturnValue(true);

        finder.waitForResult(test, resultA).then((result) => {
            expect(result).toBe(resultB);
            expect(resultsGetSpy).toHaveBeenCalledWith(42);
            expect(isResultFinishedSpy).toHaveBeenNthCalledWith(1, resultA);
            expect(isResultFinishedSpy).toHaveBeenNthCalledWith(2, resultB);
        });

        expect(setTimeout).toHaveBeenCalledWith(expect.any(Function), 1000);
        setTimeout.mock.calls[0][0]();
    });
});
