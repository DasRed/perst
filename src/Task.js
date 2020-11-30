import chalk from 'chalk';
import random from 'random';
import Test from 'loader.io.api/dist/Tests/Test.js';
import logger from './logger.js';
import ResultFinder from './ResultFinder.js';
import prettyMilliseconds from 'pretty-ms';

function formatMS(start, end = (new Date()).getTime()) {
    return prettyMilliseconds(end - start, {formatSubMilliseconds: true});
}

export default class Task {
    static RESULT = {
        PENDING: 'pending',
        SUCCESS: 'success',
        FAILED:  'failed',
    };

    static STATUS = {
        PENDING:  'pending',
        RUNNING:  'running',
        FINISHED: 'finished',
    };

    /**
     *
     * @param {LoaderIO} loaderIO
     * @param {string} name
     * @param {Object} config
     * @param {Object} configApp
     * @param {Boolean} [dryRun]
     */
    constructor({
                    loaderIO,
                    name,
                    config,
                    configApp,
                    dryRun = false,
                }) {
        this.loaderIO  = loaderIO;
        this.name      = name;
        this.config    = config;
        this.configApp = configApp;
        this.dryRun    = dryRun;

        this.status = Task.STATUS.PENDING;
        this.result = Task.RESULT.PENDING;
        this.values = {
            avgResponseTime: undefined,
            avgErrorRate:    undefined,
        };
    }

    /**
     *
     * @return {Promise<Test>}
     */
    async createAndRun() {
        const options = {
            name:      this.config.name,
            duration:  this.config.duration,
            timeout:   this.config.timeout,
            notes:     this.config.notes,
            tag_names: this.config.tags,
            initial:   this.config.clientsStart,
            total:     this.config.clients,
            test_type: this.config.type,
            urls:      [{
                url:            this.configApp.domain.replace(/\|+$/, '') + '/' + this.config.request.path.replace(/^\|+/, ''),
                request_type:   this.config.request.type,
                payload_file:   this.config.request.payloadFile,
                headers:        this.config.request.headers,
                request_params: this.config.request.parameters,
                authentication: this.config.request.authentication,
                variables:      this.config.request.variables,
            }]
        };

        if (this.dryRun === true) {
            return Promise.resolve(new Test(this.loaderIO, {
                ...options,
                status:  Test.STATUS.COMPLETE,
                test_id: 'dryRun-randomId-' + random.int(1000000, 9999999),
            }));
        }

        return await this.loaderIO.tests.create(options);
    }

    /**
     *
     * @param {Test} test
     * @return {Promise<Test>}
     */
    async rerun(test) {
        if (this.dryRun === true) {
            test.status = Test.STATUS.COMPLETE;
        }
        else {
            // TODO update need because changed settings?
            await test.run();
        }

        return test;
    }

    async run() {
        if (this.status !== Task.STATUS.PENDING) {
            logger.log(`${chalk.red('✘')} Task ${chalk.red(this.name)} already started`);
            return this;
        }

        // message start stuff
        const timeStart = (new Date()).getTime();
        const message   = `${chalk.yellow('•')} Task ${chalk.green(this.name)}`;
        logger.log(`${message} (${formatMS(timeStart)})`, false);
        const interval = setInterval(() => {
            logger.removeLastLine();
            logger.log(`${message} (${formatMS(timeStart)})`, false);
        }, 10);

        // find the test
        const tests = await this.loaderIO.tests.list();
        let test    = tests.find((test) => test.name === this.config.name);

        // rerun or create and run the test
        if (test instanceof Test) {
            test = await this.rerun(test);
        }
        else {
            test = await this.createAndRun();
        }
        this.status = Task.STATUS.RUNNING;

        // get the newest result and wait to become ready
        const resultFinder = new ResultFinder({
            loaderIO: this.loaderIO,
            dryRun:   this.dryRun,
            test
        });
        const result       = await resultFinder.find();

        // set the values
        this.status                 = Task.STATUS.FINISHED;
        this.values.avgResponseTime = result.avg_response_time;
        this.values.avgErrorRate    = result.avg_error_rate;

        // validate the results
        await this.validate();

        // done infos
        const timeEnd = (new Date()).getTime();
        clearInterval(interval);
        logger.removeLastLine();
        if (this.result === Task.RESULT.SUCCESS) {
            logger.log(`${chalk.green('✔')}︎ Task ${chalk.green(this.name)} (${formatMS(timeStart, timeEnd)})`);
            logger.log(`    AVG Response Time: ${chalk.green(this.values.avgResponseTime)} ms (Threshold: ${chalk.yellow(this.config.threshold.avgResponseTime)} ms)`);
            logger.log(`    AVG Error Rate: ${chalk.green(this.values.avgErrorRate)} (Threshold: ${chalk.yellow(this.config.threshold.avgErrorRate)})`);
        }
        else {
            logger.log(`${chalk.red('✘')}︎ Task ${chalk.red(this.name)} (${formatMS(timeStart, timeEnd)})`);
            logger.log(`    AVG Response Time: ${chalk.red(this.values.avgResponseTime)} ms (Threshold: ${chalk.yellow(this.config.threshold.avgResponseTime)} ms)`);
            logger.log(`    AVG Error Rate: ${chalk.red(this.values.avgErrorRate)} (Threshold: ${chalk.yellow(this.config.threshold.avgErrorRate)})`);
        }

        return this;
    }

    /**
     *
     * @return {Promise<Task>}
     */
    async validate() {
        this.result = Task.RESULT.SUCCESS;
        if (this.values.avgResponseTime > this.config.threshold.avgResponseTime) {
            this.result = Task.RESULT.FAILED;
        }

        if (this.values.avgErrorRate > this.config.avgErrorRate) {
            this.result = Task.RESULT.FAILED;
        }

        return this;
    }
}
