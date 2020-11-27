import Result from 'loader.io.api/dist/Tests/Result.js';

export default class ResultFinder {
    /**
     *
     * @param {LoaderIO} loaderIO
     * @param {Test} test
     */
    constructor({loaderIO, test}) {
        this.loaderIO = loaderIO;
        this.test     = test;
    }

    /**
     *
     * @return {Promise<Result>}
     */
    async find() {
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
