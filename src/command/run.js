import Task from '../Task/Task.js';

/**
 *
 * @param {Object} config
 * @param {Task[]} tasks
 * @return {Promise<number>}
 */
export default async function run(config, tasks) {
    // run the tasks in sequential
    await tasks.reduce((promise, task) => promise.then(() => task.run()), Promise.resolve());

    // exit with process exit state
    return tasks.find((task) => task.result === Task.RESULT.FAILED) !== undefined ? 1 : 0;
};
