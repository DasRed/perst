import chalk from 'chalk';
import yargsParser from 'yargs-parser';
import logger from './logger.js';
import configFn from './config/index.js';
import cliConfig from './config/cli.js';
import * as commands from './command/index.js';
import createTasks from './Task/create.js';

/**
 *
 * @param {*[]} args
 * @param {Object} environment
 * @return {Promise<void>}
 */
export default async function execute(args, environment) {
    let exitNumber;
    try {
        const cli    = yargsParser(args, cliConfig);
        const config = await configFn(cli, environment);
        if (config.dryRun === true) {
            logger.log(chalk.yellow('Note: You running perst in dry run mode. No test will be executed. No test will be created.'));
        }

        const tasks = await createTasks(config);

        let command = commands.run;

        if (cli.help) {
            command = commands.help;
        }
        else if (cli.version) {
            command = commands.version;
        }
        else if (cli.dumpConfig) {
            command = commands.dumpConfig;
        }

        exitNumber = await command(config, tasks);
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
