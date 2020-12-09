import {promises as fs} from 'fs';
import __dirname from '../dirname.cjs';
import logger from '../logger.js';

export default async function () {
    const help = await fs.readFile(__dirname + '/../README.md', 'utf-8');

    logger.log(help);
}
