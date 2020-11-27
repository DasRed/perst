import yaml from 'yaml';

/**
 *
 * @param {string} filepath
 * @param {string} content
 * @return {Promise<Object|null>}
 */
export default async function yamlLoader(filepath, content) {
    content = Object.keys(process.env).reduce(
        (content, variable) => content.replace(new RegExp(`\\$${variable}|\\$\{${variable}\}`, 'g'), process.env[variable]),
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
