import {promises as fs} from 'fs';
import logger from '../../logger.js';
import help from '../help.js';

test('help.js',async () => {
    const message = await fs.readFile(__dirname + '/../../../README.md', 'utf-8');

    const logSpy = jest.spyOn(logger, 'log').mockReturnThis();

    await help();
    expect(logSpy).toHaveBeenCalledWith(message);
});
