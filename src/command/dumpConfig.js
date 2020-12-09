import YAML from 'yaml';
import logger from '../logger.js';

/**
 *
 * @param {Object} config
 * @return {Promise<number>}
 */
export default async function (config) {
    const format = config.dumpConfig;
    delete config.dumpConfig;

    if (format === 'json') {
        logger.log(JSON.stringify(config, null, 4));
    }
    else if (format === true || format === 'yaml' || format === 'yml') {
        logger.log(YAML.stringify(config, {
            indent:         4,
            mapAsMap:       true,
            merge:          true,
            sortMapEntries: true,
        }));
    }
    else if (format === 'js') {
        logger.log(`export default ${JSON.stringify(config, null, 4)}`);
    }

    return 0;
}
