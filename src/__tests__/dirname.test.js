import path from 'path';
import dirname from '../dirname.cjs';

test('dirname.js', () => expect(path.resolve(dirname)).toBe(path.resolve(__dirname + '/../')));
