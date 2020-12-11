import logger from '../logger.js';

describe('logger', () => {
    afterEach(() => logger.log.silent = false);

    test('.log() with default', () => {
        const writeSpy = jest.spyOn(process.stdout, 'write').mockReturnValue(true);

        logger.log('nuff');
        expect(writeSpy).toHaveBeenCalledWith('nuff\n');
    });

    test('.log() with new line', () => {
        const writeSpy = jest.spyOn(process.stdout, 'write').mockReturnValue(true);

        logger.log('nuff', true);
        expect(writeSpy).toHaveBeenCalledWith('nuff\n');
    });

    test('.log() without new line', () => {
        const writeSpy = jest.spyOn(process.stdout, 'write').mockReturnValue(true);

        logger.log('nuff', false);
        expect(writeSpy).toHaveBeenCalledWith('nuff');
    });

    test('.log() with silent', () => {
        logger.log.silent = true;
        const writeSpy = jest.spyOn(process.stdout, 'write').mockReturnValue(true);

        logger.log('nuff', false);
        expect(writeSpy).not.toHaveBeenCalled();
    });
});
