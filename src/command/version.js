import chalk from 'chalk';
import fs from 'fs';
import logger from '../logger.js';
import __dirname from '../dirname.cjs';

export default async function version() {
    const packageJson = fs.readFileSync(__dirname + '/../package.json', 'utf-8');

    logger.log(`perst ${chalk.green(`v${JSON.parse(packageJson).version}`)}`);
}
