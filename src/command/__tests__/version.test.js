import logger from '../../logger.js';
import version from '../version.js';
import chalk from 'chalk';
import fs from 'fs';

test('version.js', async () => {
    const packageJson = fs.readFileSync(__dirname + '/../../../package.json', 'utf-8');
    const logSpy      = jest.spyOn(logger, 'log').mockReturnThis();

    await version();
    expect(logSpy).toHaveBeenCalledWith(`perst ${chalk.green(`v${JSON.parse(packageJson).version}`)}`);
});
