import {cosmiconfig} from 'cosmiconfig';
import yamlLoader from './yamlLoader.js';
import Validator from 'fastest-validator';
import logger from '../logger.js';
import chalk from 'chalk';
import schemaFn from './schema.js';

/**
 *
 * @param {Object} cli
 * @param {Object} environment
 * @return {Promise<Object>}
 */
export default async function (cli, environment) {
    // using a cosmiconfigSync, because jest does not allow top level await for coverage, which is needed for explorer.search
    // load the config
    const explorer = cosmiconfig('perst', {
        cache:   false,
        loaders: {
            '.yaml': (filepath, content) => yamlLoader(filepath, content, environment),
            '.yml':  (filepath, content) => yamlLoader(filepath, content, environment),
            'noExt': (filepath, content) => yamlLoader(filepath, content, environment),
        }
    });

    let result;
    if (cli.config) {
        result = await explorer.load(cli.config);
    }
    else {
        result = await explorer.search();
    }
    if (result === null) {
        throw new Error('no config found');
    }

    logger.log(`Using configuration ${chalk.yellow(result.filepath)}.`);

    // validate the config
    const errors = (new Validator()).validate(result.config, schemaFn(cli));
    if (errors !== true) {
        throw new Error(`Config is not valid. ${errors.map((error) => error.message).join(' ')}`);
    }

    return result.config;
}
