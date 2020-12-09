import yaml from 'yaml';

/**
 *
 * @param {string} filepath
 * @param {string} content
 * @param {Object} environment
 * @return {Object}
 */
export default function yamlLoader(filepath, content, environment) {
    content = Object.keys(environment).reduce(
        (content, variable) => content.replace(new RegExp(`\\$${variable}|\\$\{${variable}\}`, 'g'), environment[variable]),
        content
    );

    try {
        return yaml.parse(content, {prettyErrors: true});
    }
    catch (error) {
        error.message = `YAML Error in ${filepath}:\n${error.message}`;
        throw error;
    }
}
