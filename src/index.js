import cli from './cli.js';
import help from './command/help.js';
import version from './command/version.js';
import run from './command/run.js';

let exitNumber;
if (cli.help) {
    exitNumber = await help();
}
else if (cli.version) {
    exitNumber = await version();
}
else {
    exitNumber = await run();
}

process.exit(exitNumber !== undefined ? exitNumber : 0);
