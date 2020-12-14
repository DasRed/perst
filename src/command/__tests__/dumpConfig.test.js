import * as fixtures from './fixtures/dumpConfig/index.js';
import dumpConfig from '../dumpConfig.js';
import logger from '../../logger.js';
import {highlight} from 'cli-highlight';

jest.mock("cli-highlight");
describe('dumpConfig.js', () => {
    beforeEach(() => highlight.mockClear());

    test.each([
        ['json', 'json', fixtures.json.input, fixtures.json.output, 'json'],
        ['yaml as true', true, fixtures.yaml.input, fixtures.yaml.output, 'yaml'],
        ['yaml', 'yaml', fixtures.yaml.input, fixtures.yaml.output, 'yaml'],
        ['yml', 'yml', fixtures.yaml.input, fixtures.yaml.output, 'yaml'],
        ['js', 'js', fixtures.js.input, fixtures.js.output, 'javascript'],
    ])('%s', async (name, format, input, output, language) => {
        const loggerLogSpy = jest.spyOn(logger, 'log').mockReturnThis();

        highlight.mockReturnValue(output);

        input.dumpConfig = format;
        expect(await dumpConfig(input)).toBe(0);
        expect(input.dumpConfig).toBeUndefined();
        expect(loggerLogSpy).toHaveBeenCalledWith(output);
        expect(highlight).toHaveBeenCalledWith(output, expect.any(Object));
        expect(highlight.mock.calls[0][1].language).toBe(language);
    });
});
