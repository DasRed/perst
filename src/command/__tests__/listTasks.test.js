import listTasks from '../listTasks.js';
import logger from '../../logger.js';
import Task from '../../Task/Task.js';

test('listTasks.js', async () => {
    const taskA = new Task({}, 'nuff', {}, {});
    const taskB = new Task({}, 'narf', {}, {});

    const loggerLogSpy = jest.spyOn(logger, 'log').mockReturnThis();

    expect(await listTasks({}, [taskA, taskB])).toBe(0);

    expect(loggerLogSpy).toHaveBeenCalledTimes(2);
    expect(loggerLogSpy).toHaveBeenNthCalledWith(1, 'nuff');
    expect(loggerLogSpy).toHaveBeenNthCalledWith(2, 'narf');
});
