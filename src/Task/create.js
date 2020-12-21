import chalk from 'chalk';
import validateDomain from '../domain/validate.js';
import Task from './Task.js';
import logger from '../logger.js';
import LoaderIO from 'loader.io.api/dist/LoaderIO.js';

/**
 *
 * @param {Object} config
 * @return {Promise<Task[]>}
 */
export default async function createTasks(config) {
    // using a async function around, because jest does not allow top level await for coverage
    logger.log(`Using domain ${chalk.green(config.app.domain)}`);
    const loaderIO = new LoaderIO(config.api.token, config.api.server, config.api.version);

    // validate app domain
    if (await validateDomain(loaderIO, config) === false) {
        throw new Error(`Domain ${config.app.domain} is not registered or not validated!`);
    }

    let tasks = Object.values(config.tasks);

    // should be some task be filtered?
    if (config.filter) {
        const filter = new RegExp(config.filter);
        tasks        = tasks.filter((options) => options.name.match(filter));
    }

    // make it to tasks
    return tasks.map((options) => new Task(loaderIO, options.name, options, config));
};
