import cli from './cli.js';
import help from './command/help.js';
import version from './command/version.js';
import run from './command/run.js';
import logger from './logger.js';
import chalk from 'chalk';

let exitNumber;
try {
    if (cli.help) {
        exitNumber = await help();
    }
    else if (cli.version) {
        exitNumber = await version();
    }
    else {
        exitNumber = await run();
    }
}
catch (error) {
    switch (true) {
        case error.message === 'no config found':
        case error.code === 'ENOENT':
            logger.log(chalk.red('No configuration file can be found.'));
            logger.log('At the following locations in the root directory and format can be placed the configuration.');
            logger.log('The files will be searched in this order. The first match will be used.');
            logger.log('    package.json { "perst": {...} }');
            logger.log('    .perstrc            yaml');
            logger.log('    .perstrc.json       json');
            logger.log('    .perstrc.yaml       yaml');
            logger.log('    .perstrc.yml        yaml');
            logger.log('    .perstrc.js         javascript');
            logger.log('    .perstrc.cjs        common js');
            logger.log('    perst.config.js     javascript');
            logger.log('    perst.config.cjs    common js');
            logger.log('Or you run perst with the command line switch -c.');
            break;

        default:
            logger.log(error.message);
            await help();
            break;
    }
    exitNumber = 1;
}

process.exit(exitNumber !== undefined ? exitNumber : 0);
