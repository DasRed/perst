let lastLine     = '';
export const log = (message, writeLine = true) => {
    message  = message + (writeLine ? '\n' : '');
    lastLine = message;
    process.stdout.write(message);
};

export function removeLastLine() {
    for (let i = 0; i < lastLine.length; i++) {
        process.stdout.write('\u0008');
    }
    lastLine = '';
}
