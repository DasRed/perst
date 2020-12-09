export default {
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
    default:       {
        dryRun: false
    }
};
