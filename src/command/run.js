import Task from '../Task/Task.js';

/**
 *
 * @param {Object} config
 * @param {Task[]} tasks
 * @return {Promise<number>}
 */
export default async function run(config, tasks) {
    let failed = false;

    // run the tasks in sequential
    await tasks.reduce(
        (promise, task) => {
            return promise.then(
                async () => {
                    if (config.stopOnFailure === false || failed === false) {
                        await task.run();
                        failed = task.result === Task.RESULT.FAILED;
                    }

                    return task;
                }
            );
        },
        Promise.resolve()
    );

    // exit with process exit state
    return tasks.find((task) => task.result === Task.RESULT.FAILED) !== undefined ? 1 : 0;
};
