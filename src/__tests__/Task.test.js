import LoaderIO from 'loader.io.api/dist/LoaderIO.js';
import Task from '../Task.js';

describe('Task', () => {
    test('.constructor()', () => {
        const config = {};
        const configApp = {};
        const loaderIO = new LoaderIO({token: 'a'});

        const task = new Task({loaderIO, name: 'b', config, configApp});

        expect(task.loaderIO).toBe(loaderIO);
        expect(task.name).toBe('b');
        expect(task.config).toBe(config);
        expect(task.configApp).toBe(configApp);
        expect(task.status).toBe(Task.STATUS.PENDING);
        expect(task.result).toBe(Task.RESULT.PENDING);
        expect(task.values).toBeInstanceOf(Object);
        expect(task.values.avgResponseTime).toBeUndefined();
        expect(task.values.avgErrorRate).toBeUndefined();
    });
});
