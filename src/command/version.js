import chalk from 'chalk';
import version from '../version.js';
import logger from '../logger.js';

export default async function () {
     logger.log(`perst ${chalk.green(`v${version}`)}`);
}
