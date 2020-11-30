import stripAnsi from 'strip-ansi';

let lastLine     = '';
export const log = (message, writeLine = true) => {
    message  = message + (writeLine ? '\n' : '');
    lastLine = message;
    process.stdout.write(message);
};

export function removeLastLine() {
    const line = stripAnsi(lastLine);
    for (let i = 0; i < line.length; i++) {
        process.stdout.write('\u0008');
    }
    lastLine = '';
}

export default {
    removeLastLine,
    log
};
