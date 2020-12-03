export const log = (message, writeLine = true) => {
    message  = message + (writeLine ? '\n' : '');
    process.stdout.write(message);
};

export default {
    log
};
