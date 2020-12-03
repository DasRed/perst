import copy from 'rollup-plugin-copy';
import clear from 'rollup-plugin-clear';
import {builtinModules} from 'module';
import {dependencies} from './package.json';

export default {
    input:    './src/index.js',
    output:   {
        dir:                 './dist/',
        format:              'es',
        exports:             'named',
        sourcemap:           false,
        preserveModules:     true,
        preserveModulesRoot: 'src',
    },
    external: (id) => [...builtinModules, ...Object.keys(dependencies)].includes(id) || /loader\.io\.api/.test(id) || /dirname/.test(id),
    plugins:  [
        clear({targets: ['./dist/']}),
        copy({
            targets: [
                {
                    src:  'src/cli.js',
                    dest: 'dist'
                },
                {
                    src:  'src/dirname.cjs',
                    dest: 'dist'
                },
            ]
        }),
    ]
};
