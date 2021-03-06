import random from 'random';
import Test from 'loader.io.api/dist/Tests/Test.js';
import ResultFinder from './ResultFinder.js';
import Output from './Output.js';

/**
 *
 * @param {string} domain
 * @param {Object} request
 * @return {Object}
 */
function requestToUrlOptions(domain, request) {
    return {
        url:              domain.replace(/\/+$/, '') + '/' + request.path.replace(/^\/+/, ''),
        request_type:     request.type,
        payload_file_url: request.payloadFile,
        headers:          request.headers,
        request_params:   (request.parameters || []).reduce((acc, param) => {
            acc[param.name] = param.value;
            return acc;
        }, {}),
        authentication:   request.authentication,
        variables:        request.variables,
    };
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
    constructor(loaderIO, name, options, config) {
        this.loaderIO = loaderIO;
        this.name     = name;
        this.options  = options;
        this.config   = config;

        this.output       = new Output(this, this.config.ci);
        this.resultFinder = new ResultFinder(this.loaderIO, this.config.dryRun);

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
        const urls = [];
        if (this.options.request instanceof Object) {
            urls.push(requestToUrlOptions(this.config.app.domain, this.options.request));
        }

        if (this.options.requests instanceof Array) {
            this.options.requests.forEach((request) => urls.push(requestToUrlOptions(this.config.app.domain, request)));
        }

        const options = {
            name:      this.options.name,
            duration:  this.options.duration,
            timeout:   this.options.timeout,
            notes:     this.options.notes,
            tag_names: this.options.tags,
            initial:   this.options.clientsStart,
            total:     this.options.clients,
            test_type: this.options.type,
            urls
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

    /**
     *
     * @return {Promise<Task>}
     */
    async run() {
        if (this.status !== Task.STATUS.PENDING) {
            this.output.alreadyFinished();
            return this;
        }
        this.status = Task.STATUS.RUNNING;

        // message start stuff
        this.output.start();

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

        // get the newest result and wait to become ready
        const result = await this.resultFinder.find(test);

        // set the values
        this.status                 = Task.STATUS.FINISHED;
        this.values.avgResponseTime = result.avg_response_time;
        this.values.avgErrorRate    = result.avg_error_rate;

        // validate the results
        this.validate();

        this.output.end();

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
