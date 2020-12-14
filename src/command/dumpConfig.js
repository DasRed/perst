import YAML from 'yaml';
import logger from '../logger.js';
import {highlight} from 'cli-highlight';

/**
 *
 * @param {Object} config
 * @return {Promise<number>}
 */
export default async function dumpConfig(config) {
    const format = config.dumpConfig;
    delete config.dumpConfig;

    if (format === 'json') {
        logger.log(highlight(JSON.stringify(config, null, 4), {language: 'json'}));
    }
    else if (format === 'js') {
        logger.log(highlight(`export default ${JSON.stringify(config, null, 4)}`, {language: 'javascript'}));
    }
    else {
        logger.log(highlight(YAML.stringify(config, {
            indent:         4,
            mapAsMap:       true,
            merge:          true,
            sortMapEntries: true,
        }), {language: 'yaml'}));
    }

    return 0;
}
