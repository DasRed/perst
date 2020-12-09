import * as fixtures from './fixtures/dumpConfig/index.js';
import dumpConfig from '../dumpConfig.js';
import logger from '../../logger.js';

describe('dumpConfig.js', () => {
    test.each([
        ['json', 'json', fixtures.json.input, fixtures.json.output],
        ['yaml as true', true, fixtures.yaml.input, fixtures.yaml.output],
        ['yaml', 'yaml', fixtures.yaml.input, fixtures.yaml.output],
        ['yml', 'yml', fixtures.yaml.input, fixtures.yaml.output],
        ['js', 'js', fixtures.js.input, fixtures.js.output],
    ])('%s', async (name, format, input, output) => {
        const loggerLogSpy = jest.spyOn(logger, 'log').mockReturnThis();

        input.dumpConfig = format;
        expect(await dumpConfig(input)).toBe(0);
        expect(input.dumpConfig).toBeUndefined();
        expect(loggerLogSpy).toHaveBeenCalledWith(output);
    });
});
