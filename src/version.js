import {promises as fs} from 'fs';
import { dirname } from 'path';
import { fileURLToPath } from 'url';

const __dirname = dirname(fileURLToPath(import.meta.url));

const packageJson = await fs.readFile(__dirname + '/../package.json', 'utf-8');

export default JSON.parse(packageJson).version;
