const input = {
    a:    42,
    nuff: 'narf',
};

export default {
    input,
    output: `export default ${JSON.stringify(input, null, 4)}`,
}
