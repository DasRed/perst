import {cosmiconfig} from 'cosmiconfig';
import yamlLoader from './yamlLoader.js';
import schema from './schema.js';
import Validator from 'fastest-validator';

/**
 * config files are located at the following order. First match delivers the config!
 * @file package.json -> "perst": {}
 * @file .perstrc
 * @file .perstrc.json
 * @file .perstrc.yaml
 * @file .perstrc.yml
 * @file .perstrc.js
 * @file .perstrc.cjs
 * @file perst.config.js
 * @file perst.config.cjs
 */

// load the config
const explorer = cosmiconfig('perst', {
    loaders: {
        '.yaml': yamlLoader,
        '.yml':  yamlLoader,
        'noExt': yamlLoader,
    }
});

const result = await explorer.search();
if (result === null) {
    throw new Error('no config found');
}

// validate the config
const errors = (new Validator()).validate(result.config, schema);
if (errors !== true) {
    throw new Error(`Config is not valid. ${errors.map((error) => error.message).join(' ')}`);
}

export default result.config;
