export function log (message, writeLine = true) {
    if (log.silent === true) {
        return;
    }

    message = message + (writeLine ? '\n' : '');
    process.stdout.write(message);
}

export default {
    log
};
