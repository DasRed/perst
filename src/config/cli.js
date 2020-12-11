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
        s: 'silent',
    },
    boolean:       ['dryRun', 'silent'],
    default:       {
        dryRun: false,
        silent: false,
    }
};
