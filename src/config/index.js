import {cosmiconfig} from 'cosmiconfig';
import path from 'path';
import yamlLoader from './yamlLoader.js';
import schema from './schema.js';
import Validator from 'fastest-validator';
import logger from '../logger.js';
import chalk from 'chalk';

/**
 *
 * @param {string} [file]
 * @return {Promise<Config>}
 */
export default async (file) => {
    // using a cosmiconfigSync, because jest does not allow top level await for coverage, which is needed for explorer.search
    // load the config
    const explorer = cosmiconfig('perst', {
        cache:   false,
        loaders: {
            '.yaml': yamlLoader,
            '.yml':  yamlLoader,
            'noExt': yamlLoader,
        }
    });

    let result;
    if (file) {
        result = await explorer.load(file);
    }
    else {
        result = await explorer.search();
    }
    if (result === null) {
        throw new Error('no config found');
    }

    logger.log(`Using configuration ${chalk.yellow(result.filepath)}.`);

    // validate the config
    const errors = (new Validator()).validate(result.config, schema);
    if (errors !== true) {
        throw new Error(`Config is not valid. ${errors.map((error) => error.message).join(' ')}`);
    }

    return result.config;
}
