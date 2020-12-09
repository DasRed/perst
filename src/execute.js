import chalk from 'chalk';
import yargsParser from 'yargs-parser';
import help from './command/help.js';
import version from './command/version.js';
import run from './command/run.js';
import logger from './logger.js';
import configFn from './config/index.js';
import cliConfig from './config/cli.js';

/**
 *
 * @param {*[]} args
 * @param {Object} environment
 * @return {Promise<void>}
 */
export default async function (args, environment) {
    const cli = yargsParser(args, cliConfig);

    let exitNumber;
    try {
        if (cli.help) {
            exitNumber = await help();
        }
        else if (cli.version) {
            exitNumber = await version();
        }
        else {
            const config = await configFn(cli, environment);
            exitNumber = await run(config);
        }
    }
    catch (error) {
        exitNumber  = 1;

        let message = error.message;
        if (error.message === 'no config found' || error.code === 'ENOENT') {
            message = 'No configuration file can be found.';
        }

        logger.log(chalk.red(message));
    }

    process.exit(exitNumber != null ? exitNumber : 0);
}
