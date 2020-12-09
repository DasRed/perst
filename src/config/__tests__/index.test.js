import {cosmiconfig} from 'cosmiconfig';
import configFn from '../index.js';
import logger from '../../logger.js';
/** @type {SpyInstance<ReturnType<Required<T>[M]>, ArgsType<Required<T>[M]>>} */
import yamlLoader from '../yamlLoader.js';
/** @type {SpyInstance<ReturnType<Required<T>[M]>, ArgsType<Required<T>[M]>>} */
import schemaFn from '../schema.js';
/** @type {SpyInstance<ReturnType<Required<T>[M]>, ArgsType<Required<T>[M]>>} */
import Validator from 'fastest-validator';

jest.mock('cosmiconfig');
jest.mock('fastest-validator');
jest.mock('../yamlLoader.js');
jest.mock('../schema.js');

describe('config/index.js', () => {
    let environment = {};

    beforeEach(() => {
        cosmiconfig.mockClear();
        yamlLoader.mockClear();
        schemaFn.mockClear();
    });

    describe('load', () => {
    test('without dumpConfig', async () => {
        const schema = {};
        const cli    = {config: 'narf'};
        const config = {};

        const result = {
            filepath: 'nuff',
            config
        };

        const validatorValidateSpy = jest.fn().mockReturnValue(true);
        const loadSpy              = jest.fn().mockResolvedValue(result);
        const searchSpy            = jest.fn().mockResolvedValue(result);

        Validator.mockReturnValue({validate: validatorValidateSpy});
        schemaFn.mockReturnValue(schema);
        yamlLoader.mockReturnValueOnce(42).mockReturnValueOnce(22).mockReturnValueOnce(12);
        cosmiconfig.mockReturnValue({
            load:   loadSpy,
            search: searchSpy,
        });

        const loggerLogSpy = jest.spyOn(logger, 'log').mockReturnThis();

        expect(await configFn(cli, environment)).toBe(config);

        expect(cosmiconfig).toHaveBeenCalledWith('perst', expect.any(Object));
        expect(cosmiconfig.mock.calls[0][1].cache).toBe(false);
        expect(cosmiconfig.mock.calls[0][1].loaders).toBeInstanceOf(Object);
        expect(cosmiconfig.mock.calls[0][1].loaders['.yaml']).toBeInstanceOf(Function);
        expect(cosmiconfig.mock.calls[0][1].loaders['.yml']).toBeInstanceOf(Function);
        expect(cosmiconfig.mock.calls[0][1].loaders['noExt']).toBeInstanceOf(Function);

        expect(cosmiconfig.mock.calls[0][1].loaders['.yaml']('A1', 'A2')).toBe(42);
        expect(cosmiconfig.mock.calls[0][1].loaders['.yml']('B1', 'B2')).toBe(22);
        expect(cosmiconfig.mock.calls[0][1].loaders['noExt']('C1', 'C2')).toBe(12);

        expect(yamlLoader).toHaveBeenCalledTimes(3);
        expect(yamlLoader).toHaveBeenNthCalledWith(1, 'A1', 'A2', environment);
        expect(yamlLoader).toHaveBeenNthCalledWith(2, 'B1', 'B2', environment);
        expect(yamlLoader).toHaveBeenNthCalledWith(3, 'C1', 'C2', environment);

        expect(loadSpy).toHaveBeenCalledWith('narf');
        expect(searchSpy).not.toHaveBeenCalled();

        expect(loggerLogSpy).toHaveBeenCalledWith('Using configuration \u001b[33mnuff\u001b[39m.');
        expect(schemaFn).toHaveBeenCalledWith(cli);

        expect(validatorValidateSpy).toHaveBeenCalledWith(config, schema);
    });

    test('with dumpConfig', async () => {
        const schema = {};
        const cli    = {config: 'narf', dumpConfig: true};
        const config = {};

        const result = {
            filepath: 'nuff',
            config
        };

        const validatorValidateSpy = jest.fn().mockReturnValue(true);
        const loadSpy              = jest.fn().mockResolvedValue(result);
        const searchSpy            = jest.fn().mockResolvedValue(result);

        Validator.mockReturnValue({validate: validatorValidateSpy});
        schemaFn.mockReturnValue(schema);
        yamlLoader.mockReturnValueOnce(42).mockReturnValueOnce(22).mockReturnValueOnce(12);
        cosmiconfig.mockReturnValue({
            load:   loadSpy,
            search: searchSpy,
        });

        const loggerLogSpy = jest.spyOn(logger, 'log').mockReturnThis();

        expect(await configFn(cli, environment)).toBe(config);

        expect(cosmiconfig).toHaveBeenCalledWith('perst', expect.any(Object));
        expect(cosmiconfig.mock.calls[0][1].cache).toBe(false);
        expect(cosmiconfig.mock.calls[0][1].loaders).toBeInstanceOf(Object);
        expect(cosmiconfig.mock.calls[0][1].loaders['.yaml']).toBeInstanceOf(Function);
        expect(cosmiconfig.mock.calls[0][1].loaders['.yml']).toBeInstanceOf(Function);
        expect(cosmiconfig.mock.calls[0][1].loaders['noExt']).toBeInstanceOf(Function);

        expect(cosmiconfig.mock.calls[0][1].loaders['.yaml']('A1', 'A2')).toBe(42);
        expect(cosmiconfig.mock.calls[0][1].loaders['.yml']('B1', 'B2')).toBe(22);
        expect(cosmiconfig.mock.calls[0][1].loaders['noExt']('C1', 'C2')).toBe(12);

        expect(yamlLoader).toHaveBeenCalledTimes(3);
        expect(yamlLoader).toHaveBeenNthCalledWith(1, 'A1', 'A2', environment);
        expect(yamlLoader).toHaveBeenNthCalledWith(2, 'B1', 'B2', environment);
        expect(yamlLoader).toHaveBeenNthCalledWith(3, 'C1', 'C2', environment);

        expect(loadSpy).toHaveBeenCalledWith('narf');
        expect(searchSpy).not.toHaveBeenCalled();

        expect(loggerLogSpy).not.toHaveBeenCalled();
        expect(schemaFn).toHaveBeenCalledWith(cli);

        expect(validatorValidateSpy).toHaveBeenCalledWith(config, schema);
    });
});

    test('search', async () => {
        const schema = {};
        const cli    = {};
        const config = {};

        const result = {
            filepath: 'nuff',
            config
        };

        const validatorValidateSpy = jest.fn().mockReturnValue(true);
        const loadSpy              = jest.fn().mockResolvedValue(result);
        const searchSpy            = jest.fn().mockResolvedValue(result);

        Validator.mockReturnValue({validate: validatorValidateSpy});
        schemaFn.mockReturnValue({});
        yamlLoader.mockReturnValueOnce(42).mockReturnValueOnce(22).mockReturnValueOnce(12);
        cosmiconfig.mockReturnValue({
            load:   loadSpy,
            search: searchSpy,
        });

        const loggerLogSpy = jest.spyOn(logger, 'log').mockReturnThis();

        expect(await configFn(cli, environment)).toBe(config);

        expect(cosmiconfig).toHaveBeenCalledWith('perst', expect.any(Object));
        expect(cosmiconfig.mock.calls[0][1].cache).toBe(false);
        expect(cosmiconfig.mock.calls[0][1].loaders).toBeInstanceOf(Object);
        expect(cosmiconfig.mock.calls[0][1].loaders['.yaml']).toBeInstanceOf(Function);
        expect(cosmiconfig.mock.calls[0][1].loaders['.yml']).toBeInstanceOf(Function);
        expect(cosmiconfig.mock.calls[0][1].loaders['noExt']).toBeInstanceOf(Function);

        expect(cosmiconfig.mock.calls[0][1].loaders['.yaml']('A1', 'A2')).toBe(42);
        expect(cosmiconfig.mock.calls[0][1].loaders['.yml']('B1', 'B2')).toBe(22);
        expect(cosmiconfig.mock.calls[0][1].loaders['noExt']('C1', 'C2')).toBe(12);

        expect(yamlLoader).toHaveBeenCalledTimes(3);
        expect(yamlLoader).toHaveBeenNthCalledWith(1, 'A1', 'A2', environment);
        expect(yamlLoader).toHaveBeenNthCalledWith(2, 'B1', 'B2', environment);
        expect(yamlLoader).toHaveBeenNthCalledWith(3, 'C1', 'C2', environment);

        expect(loadSpy).not.toHaveBeenCalled();
        expect(searchSpy).toHaveBeenCalledWith();

        expect(loggerLogSpy).toHaveBeenCalledWith('Using configuration \u001b[33mnuff\u001b[39m.');
        expect(schemaFn).toHaveBeenCalledWith(cli);

        expect(validatorValidateSpy).toHaveBeenCalledWith(config, schema);
    });

    test('failed by explorer', async () => {
        const cli    = {};
        const config = {};

        const result = {
            filepath: 'nuff',
            config
        };

        const validatorValidateSpy = jest.fn().mockReturnValue(true);
        const loadSpy              = jest.fn().mockResolvedValue(result);
        const searchSpy            = jest.fn().mockResolvedValue(null);

        Validator.mockReturnValue({validate: validatorValidateSpy});
        schemaFn.mockReturnValue({});
        yamlLoader.mockReturnValueOnce(42).mockReturnValueOnce(22).mockReturnValueOnce(12);
        cosmiconfig.mockReturnValue({
            load:   loadSpy,
            search: searchSpy,
        });

        try {
            await configFn(cli, environment);
        }
        catch (error) {
            expect(error.message).toBe('no config found');
        }

        expect(cosmiconfig).toHaveBeenCalledWith('perst', expect.any(Object));
        expect(cosmiconfig.mock.calls[0][1].cache).toBe(false);
        expect(cosmiconfig.mock.calls[0][1].loaders).toBeInstanceOf(Object);
        expect(cosmiconfig.mock.calls[0][1].loaders['.yaml']).toBeInstanceOf(Function);
        expect(cosmiconfig.mock.calls[0][1].loaders['.yml']).toBeInstanceOf(Function);
        expect(cosmiconfig.mock.calls[0][1].loaders['noExt']).toBeInstanceOf(Function);

        expect(cosmiconfig.mock.calls[0][1].loaders['.yaml']('A1', 'A2')).toBe(42);
        expect(cosmiconfig.mock.calls[0][1].loaders['.yml']('B1', 'B2')).toBe(22);
        expect(cosmiconfig.mock.calls[0][1].loaders['noExt']('C1', 'C2')).toBe(12);

        expect(yamlLoader).toHaveBeenCalledTimes(3);
        expect(yamlLoader).toHaveBeenNthCalledWith(1, 'A1', 'A2', environment);
        expect(yamlLoader).toHaveBeenNthCalledWith(2, 'B1', 'B2', environment);
        expect(yamlLoader).toHaveBeenNthCalledWith(3, 'C1', 'C2', environment);

        expect(loadSpy).not.toHaveBeenCalled();
        expect(searchSpy).toHaveBeenCalledWith();

        expect(validatorValidateSpy).not.toHaveBeenCalled();
    });

    test('failed by validator', async () => {
        const schema = {};
        const cli    = {};
        const config = {};

        const result = {
            filepath: 'nuff',
            config
        };

        const validatorValidateSpy = jest.fn().mockReturnValue([{message: 'nuff'}, {message: 'narf'}]);
        const loadSpy              = jest.fn().mockResolvedValue(result);
        const searchSpy            = jest.fn().mockResolvedValue(result);

        Validator.mockReturnValue({validate: validatorValidateSpy});
        schemaFn.mockReturnValue({});
        yamlLoader.mockReturnValueOnce(42).mockReturnValueOnce(22).mockReturnValueOnce(12);
        cosmiconfig.mockReturnValue({
            load:   loadSpy,
            search: searchSpy,
        });

        const loggerLogSpy = jest.spyOn(logger, 'log').mockReturnThis();

        try {
            await configFn(cli, environment);
        }
        catch (error) {
            expect(error.message).toBe('Config is not valid. nuff narf');
        }

        expect(cosmiconfig).toHaveBeenCalledWith('perst', expect.any(Object));
        expect(cosmiconfig.mock.calls[0][1].cache).toBe(false);
        expect(cosmiconfig.mock.calls[0][1].loaders).toBeInstanceOf(Object);
        expect(cosmiconfig.mock.calls[0][1].loaders['.yaml']).toBeInstanceOf(Function);
        expect(cosmiconfig.mock.calls[0][1].loaders['.yml']).toBeInstanceOf(Function);
        expect(cosmiconfig.mock.calls[0][1].loaders['noExt']).toBeInstanceOf(Function);

        expect(cosmiconfig.mock.calls[0][1].loaders['.yaml']('A1', 'A2')).toBe(42);
        expect(cosmiconfig.mock.calls[0][1].loaders['.yml']('B1', 'B2')).toBe(22);
        expect(cosmiconfig.mock.calls[0][1].loaders['noExt']('C1', 'C2')).toBe(12);

        expect(yamlLoader).toHaveBeenCalledTimes(3);
        expect(yamlLoader).toHaveBeenNthCalledWith(1, 'A1', 'A2', environment);
        expect(yamlLoader).toHaveBeenNthCalledWith(2, 'B1', 'B2', environment);
        expect(yamlLoader).toHaveBeenNthCalledWith(3, 'C1', 'C2', environment);

        expect(loadSpy).not.toHaveBeenCalled();
        expect(searchSpy).toHaveBeenCalledWith();

        expect(loggerLogSpy).toHaveBeenCalledWith('Using configuration \u001b[33mnuff\u001b[39m.');
        expect(schemaFn).toHaveBeenCalledWith(cli);

        expect(validatorValidateSpy).toHaveBeenCalledWith(config, schema);
    });
});
