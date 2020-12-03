import chalk from 'chalk';
import {promises as fs} from 'fs';
import __dirname from '../dirname.cjs';
import version from '../version.js';
import logger from '../logger.js';

export default async function () {
    const help = await fs.readFile(__dirname + '/../README.md', 'utf-8');

    logger.log(`\n${help.replace('__VERSION__', chalk.green(version))}\n`);
}
