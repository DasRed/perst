import yargsParser from 'yargs-parser';

const cli = yargsParser(process.argv.slice(2), {
    configuration: {
        'camel-case-expansion': true
    },
    alias:         {
        c: 'config',
        d: 'dry-run',
        h: 'help',
        v: 'version',
    },
    boolean:       ['dryRun'],
    default: {
        dryRun: false
    }
});

export default cli;
