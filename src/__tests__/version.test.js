import fs from 'fs';
import version from '../version.js';

test('version.js', () => {
    const packageJson = fs.readFileSync(__dirname + '/../../package.json', 'utf-8');
    expect(version).toBe(JSON.parse(packageJson).version);
});
