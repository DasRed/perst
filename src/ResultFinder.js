import random from 'random';
import Result from 'loader.io.api/dist/Tests/Result.js';

export default class ResultFinder {
    /**
     *
     * @param {LoaderIO} loaderIO
     * @param {Test} test
     * @param {boolean} [dryRun = false]
     */
    constructor({loaderIO, test, dryRun = false}) {
        this.loaderIO = loaderIO;
        this.dryRun   = dryRun;
        this.test     = test;
    }

    /**
     *
     * @return {Promise<Result>}
     */
    async find() {
        if (this.dryRun === true) {
            return new Promise((resolve) => {
                setTimeout(() => {
                    resolve(new Result({
                        result_id:          'dryRun-randomId-' + random.int(1000000, 9999999),
                        started_at:         new Date(),
                        status:             Result.STATUS.READY,
                        public_results_url: 'https://www.example.de',
                        success:            100,
                        error:              0,
                        timeout_error:      0,
                        network_error:      0,
                        data_sent:          random.int(100, 9999),
                        data_received:      random.int(1000, 9999),
                        avg_response_time:  random.int(10, 250),
                        avg_error_rate:     0
                    }));
                }, 2500);
            });
        }

        let result = await this.getFirstResultFromTest();
        if (this.isResultFinished(result) === true) {
            return result;
        }

        return await this.waitForResult(result);
    }

    /**
     *
     * @return {Promise<Result>}
     */
    async getFirstResultFromTest() {
        const results = await this.test.results.list();
        return results.shift();
    }

    /**
     *
     * @param {Result} result
     * @return {boolean}
     */
    isResultFinished(result) {
        return result.status !== Result.STATUS.NOT_READY;
    }

    /**
     *
     * @param {Result} result
     * @return {Promise<Result>}
     */
    async waitForResult(result) {
        if (this.isResultFinished(result) === true) {
            return result;
        }

        return await new Promise((resolve) => {
            setTimeout(async () => {
                result = await this.test.results.get(result.result_id);

                if (this.isResultFinished(result) === true) {
                    resolve(result);
                }

                resolve(await this.waitForResult(result));
            }, 1000);
        });
    }
}
