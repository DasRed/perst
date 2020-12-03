import fs from 'fs';
import __dirname from './dirname.cjs';

const packageJson = fs.readFileSync(__dirname + '/../package.json', 'utf-8');

export default JSON.parse(packageJson).version;
