import LoaderIO from 'loader.io.api/dist/LoaderIO.js';
import config from './config/index.js';

export default new LoaderIO({...config.api});
