import chalk from 'chalk';
import {promises as fs} from 'fs';
import {dirname} from 'path';
import {fileURLToPath} from 'url';
import version from '../version.js';
import logger from '../logger.js';

const __dirname = dirname(fileURLToPath(import.meta.url));

export default async function () {
    const help = await fs.readFile(__dirname + '/../../README.md', 'utf-8');

    logger.log(`\n${help.replace('__VERSION__', chalk.green(version))}\n`);
}
