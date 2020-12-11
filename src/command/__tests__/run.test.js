import Task from '../../Task/Task.js';
import run from '../run.js';
/** @type {SpyInstance<ReturnType<Required<T>[M]>, ArgsType<Required<T>[M]>>} */

jest.mock('../../domain/validate.js');

describe('runs.js', () => {
    test('success', async () => {
        const taskA  = new Task({}, 'nuff', {}, {});
        taskA.result = Task.RESULT.SUCCESS;
        const taskB  = new Task({}, 'nuff', {}, {});
        taskB.result = Task.RESULT.SUCCESS;

        const taskARunSpy = jest.spyOn(taskA, 'run').mockResolvedValue(taskA);
        const taskBRunSpy = jest.spyOn(taskB, 'run').mockResolvedValue(taskB);

        expect(await run({}, [taskA, taskB])).toBe(0);

        expect(taskARunSpy).toHaveBeenCalled();
        expect(taskBRunSpy).toHaveBeenCalled();
    });

    test('failed', async () => {
        const taskA  = new Task({}, 'nuff', {}, {});
        taskA.result = Task.RESULT.SUCCESS;
        const taskB  = new Task({}, 'nuff', {}, {});
        taskB.result = Task.RESULT.FAILED;

        const taskARunSpy = jest.spyOn(taskA, 'run').mockResolvedValue(taskA);
        const taskBRunSpy = jest.spyOn(taskB, 'run').mockResolvedValue(taskB);

        expect(await run({}, [taskA, taskB])).toBe(1);

        expect(taskARunSpy).toHaveBeenCalled();
        expect(taskBRunSpy).toHaveBeenCalled();
    });
});
