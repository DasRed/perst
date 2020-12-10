export default {
    configuration: {
        'camel-case-expansion': true
    },
    alias:         {
        c: 'config',
        d: 'dry-run',
        h: 'help',
        v: 'version',
        f: 'filter',
    },
    boolean:       ['dryRun'],
    default:       {
        dryRun: false
    }
};
