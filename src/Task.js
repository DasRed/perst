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
     * @param {Object} options
     * @param {Object} config
     */
    constructor({
                    loaderIO,
                    name,
                    options,
                    config,
                }) {
        this.loaderIO = loaderIO;
        this.name     = name;
        this.options  = options;
        this.config   = config;

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
            name:      this.options.name,
            duration:  this.options.duration,
            timeout:   this.options.timeout,
            notes:     this.options.notes,
            tag_names: this.options.tags,
            initial:   this.options.clientsStart,
            total:     this.options.clients,
            test_type: this.options.type,
            urls:      [{
                url:              this.config.app.domain.replace(/\/+$/, '') + '/' + this.options.request.path.replace(/^\/+/, ''),
                request_type:     this.options.request.type,
                payload_file_url: this.options.request.payloadFile,
                headers:          this.options.request.headers,
                request_params:   this.options.request.parameters,
                authentication:   this.options.request.authentication,
                variables:        this.options.request.variables,
            }]
        };

        if (this.config.dryRun === true) {
            return Promise.resolve(new Test(this.loaderIO, {
                ...options,
                status:  Test.STATUS.COMPLETE,
                test_id: 'dryRun-randomId-' + random.int(1000000, 9999999),
            }));
        }

        return this.loaderIO.tests.create(options);
    }

    /**
     *
     * @param {Test} test
     * @return {Promise<Test>}
     */
    async rerun(test) {
        if (this.config.dryRun === true) {
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
        logger.log(`\r${message}`, false)

        const interval = setInterval(() => logger.log(this.config.ci !== true ? `\r${message} (${formatMS(timeStart)})                 ` : '.', false), this.config.ci !== true ? 10 : 1000);

        // find the test
        /** @var {Test[]} */
        const tests = await this.loaderIO.tests.list();
        let test    = tests.find((test) => test.name === this.options.name);

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
            dryRun:   this.config.dryRun,
            test
        });
        const result       = await resultFinder.find();

        // set the values
        this.status                 = Task.STATUS.FINISHED;
        this.values.avgResponseTime = result.avg_response_time;
        this.values.avgErrorRate    = result.avg_error_rate;

        // validate the results
        this.validate();

        // done infos
        const timeEnd = (new Date()).getTime();
        clearInterval(interval);

        const chalkMethod = this.result === Task.RESULT.SUCCESS ? chalk.green : chalk.red;
        const stateIcon   = chalkMethod(this.result === Task.RESULT.SUCCESS ? '✔' : '✘');
        const timeInfo    = this.config.ci !== true ? ` (${formatMS(timeStart, timeEnd)})                 ` : '';

        logger.log(this.config.ci !== true ? '\r' : '', this.config.ci);
        logger.log(`${stateIcon}︎ Task ${chalk.green(this.name)}${timeInfo}`);
        logger.log(`    AVG Response Time: ${chalkMethod(this.values.avgResponseTime)} ms (Threshold: ${chalk.yellow(this.options.threshold.avgResponseTime)} ms)`);
        logger.log(`    AVG Error Rate: ${chalkMethod(this.values.avgErrorRate)} (Threshold: ${chalk.yellow(this.options.threshold.avgErrorRate)})`);

        return this;
    }

    /**
     *
     * @return {Task}
     */
    validate() {
        this.result = Task.RESULT.SUCCESS;
        if (this.values.avgResponseTime > this.options.threshold.avgResponseTime) {
            this.result = Task.RESULT.FAILED;
        }

        if (this.values.avgErrorRate > this.options.threshold.avgErrorRate) {
            this.result = Task.RESULT.FAILED;
        }

        return this;
    }
}
