import logger from '../logger.js';

/**
 *
 * @param {Object} config
 * @param {Task[]} tasks
 * @return {Promise<number>}
 */
export default async function listTasks(config, tasks) {
    tasks.forEach((task) => logger.log(task.name));
    return 0;
};
