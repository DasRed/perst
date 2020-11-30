import chalk from 'chalk';
import config from '../config/index.js';
import validateDomain from '../domain/validate.js';
import loaderIO from '../loaderIO.js';
import Task from '../Task.js';
import logger from '../logger.js';

export default async function () {
    if (config.dryRun === true) {
        //logger.log(chalk.yellow('Note: You running perst in dry run mode. No test will be executed. No test will be created.'));
    }

    // using a async function around, because jest does not allow top level await for coverage
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
        dryRun:    config.dryRun,
        config:    configTask,
        configApp: config.app,
    }));

    // run the tasks in sequential
    await tasks.reduce((promise, task) => promise.then(() => task.run()), Promise.resolve());

    // exit with process exit state
    return tasks.find((task) => task.result === Task.RESULT.FAILED) !== undefined ? 1 : 0;
};
