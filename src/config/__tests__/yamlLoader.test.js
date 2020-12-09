import fs from 'fs';
import yamlLoader from '../yamlLoader.js';

describe('yamlLoader.js', () => {
    test('success', () => {
        const file    = __dirname + '/fixture/yamlLoader.success.yml';
        const content = fs.readFileSync(file, 'utf-8');
        const result  = yamlLoader(file, content, {COPTER: 'nope'});

        expect(result).toEqual({
            nuff: 'narf',
            rofl: 'nope',
            lol:  'nope',
            abc:  {map: 42},
            keks: {map: 42},
        });
    });

    test('failed', () => {
        const file    = __dirname + '/fixture/yamlLoader.failed.yml';
        const content = fs.readFileSync(file, 'utf-8');

        expect(() => yamlLoader(file, content, {COPTER: 'nope'})).toThrowError(`YAML Error in ${file}:\nImplicit map keys need to be on a single line at line 1, column 1:\n\nnuff\n^^^^…\n`);
    });
});
