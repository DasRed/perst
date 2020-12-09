import YAML from 'yaml';

const input = {
    a:    42,
    nuff: 'narf'
};

export default {
    input,
    output: YAML.stringify(input, {
        indent:         4,
        mapAsMap:       true,
        merge:          true,
        sortMapEntries: true,
    }),
}
