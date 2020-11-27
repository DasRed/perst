import config from './config/index.js';
import chalk from 'chalk';
import validateDomain from './domain/validate.js';
import loaderIO from './loaderIO.js';
import Task from './Task.js';
import * as logger from './logger.js';

logger.log(`Using domain ${chalk.green(config.app.domain)}`);

// validate app domain
if (await validateDomain(loaderIO, config) === false) {
    logger.log(chalk.red(`Domain ${config.app.domain} is not registered or not validated!`));
    process.exit(1);
}

// make it to tasks
logger.log(`Found ${chalk.yellowBright(Object.values(config.tasks).length)} performance test to run.`);
const tasks = Object.entries(config.tasks).map(([name, configTask]) => new Task({
    loaderIO,
    name,
    config:    configTask,
    configApp: config.app,
}));

// run the tasks in sequential
await tasks.reduce((promise, task) => promise.then(() => task.run()), Promise.resolve());

// exit with process exit state
process.exit(tasks.find((task) => task.result === Task.RESULT.FAILED) !== undefined ? 1 : 0)



