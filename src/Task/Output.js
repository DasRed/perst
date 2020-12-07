import chalk from 'chalk';
import logger from '../logger.js';
import prettyMilliseconds from 'pretty-ms';
import Task from '../Task.js';

function formatMS(start, end = (new Date()).getTime()) {
    return prettyMilliseconds(end - start, {formatSubMilliseconds: true});
}

export default class Output {
    /**
     *
     * @param {Task} task
     * @param {boolean} [isCI = false]
     */
    constructor(task, isCI = false) {
        this.task      = task;
        this.isCI      = !!isCI;
        this.interval  = null;
        this.timeStart = null;
    }

    /**
     *
     * @return {Output}
     */
    alreadyFinished() {
        logger.log(`${chalk.red('✘')} Task ${chalk.red(this.task.name)} already started.`);

        return this;
    }

    /**
     *
     * @return {Output}
     */
    end() {
        const timeEnd = (new Date()).getTime();
        clearInterval(this.interval);

        const chalkMethod = this.task.result === Task.RESULT.SUCCESS ? chalk.green : chalk.red;
        const stateIcon   = chalkMethod(this.task.result === Task.RESULT.SUCCESS ? '✔' : '✘');
        const timeInfo    = this.isCI !== true ? ` (${formatMS(this.timeStart, timeEnd)})                 ` : '';

        logger.log(this.isCI !== true ? '\r' : '', this.isCI);
        logger.log(`${stateIcon}︎ Task ${chalk.green(this.task.name)}${timeInfo}`);
        logger.log(`    AVG Response Time: ${chalkMethod(this.task.values.avgResponseTime)} ms (Threshold: ${chalk.yellow(this.task.options.threshold.avgResponseTime)} ms)`);
        logger.log(`    AVG Error Rate: ${chalkMethod(this.task.values.avgErrorRate)} (Threshold: ${chalk.yellow(this.task.options.threshold.avgErrorRate)})`);

        return this;
    }

    /**
     *
     * @return {Output}
     */
    start() {
        // message start stuff
        this.timeStart = (new Date()).getTime();
        const message  = `${chalk.yellow('•')} Task ${chalk.green(this.task.name)}`;
        logger.log(`\r${message}`, false)

        this.interval = setInterval(() => logger.log(this.isCI !== true ? `\r${message} (${formatMS(this.timeStart)})                 ` : '.', false), this.isCI !== true ? 10 : 1000);

        return this;
    }
}
