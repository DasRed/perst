import YAML from 'yaml';
import logger from '../logger.js';

/**
 *
 * @param {Object} config
 * @return {Promise<number>}
 */
export default async function dumpConfig(config) {
    const format = config.dumpConfig;
    delete config.dumpConfig;

    if (format === 'json') {
        logger.log(JSON.stringify(config, null, 4));
    }
    else if (format === 'js') {
        logger.log(`export default ${JSON.stringify(config, null, 4)}`);
    }
    else {
        logger.log(YAML.stringify(config, {
            indent:         4,
            mapAsMap:       true,
            merge:          true,
            sortMapEntries: true,
        }));
    }

    return 0;
}
