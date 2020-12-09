import chalk from 'chalk';
import yargsParser from 'yargs-parser';
import logger from './logger.js';
import configFn from './config/index.js';
import cliConfig from './config/cli.js';
import * as commands from './command/index.js';

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
        const config = await configFn(cli, environment);
        let command  = commands.run;

        if (cli.help) {
            command = commands.help;
        }
        else if (cli.version) {
            command = commands.version;
        }
        else if (cli.dumpConfig) {
            command = commands.dumpConfig;
        }

        exitNumber = await command(config);
    }
    catch (error) {
        exitNumber = 1;

        let message = chalk.red(error.message) + '\n' + error.stack;
        if (error.message === 'no config found' || error.code === 'ENOENT') {
            message = chalk.red('No configuration file can be found.');
        }

        logger.log(message);
    }

    process.exit(exitNumber != null ? exitNumber : 0);
}
