import logger from '../../logger.js';
import version from '../../version.js';
import versionCommand from '../version.js';
import chalk from 'chalk';

test('version.js', async () => {
    const logSpy = jest.spyOn(logger, 'log').mockReturnThis();

    await versionCommand();
    expect(logSpy).toHaveBeenCalledWith(`perst ${chalk.green(`v${version}`)}`);
});
