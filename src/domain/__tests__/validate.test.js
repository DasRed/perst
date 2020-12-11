import Application from 'loader.io.api/dist/Application/Application.js';
import LoaderIO from 'loader.io.api/dist/LoaderIO.js';
import validate from '../validate.js';
import logger from '../../logger.js';

describe('validate.js', () => {
    const loaderIO = new LoaderIO('a');

    describe('application found', () => {
        test.each([
            [Application.STATUS.VERIFIED, true],
            [Application.STATUS.UNVERIFIED, false],
        ])('application.status = %s', async (status, expected) => {
            const applicationA = new Application({}, {app: 'www.nuff.de'});
            const applicationB = new Application({}, {
                app: 'www.narf.de',
                status
            });

            const applicationsListSpy = jest.spyOn(loaderIO.applications, 'list').mockResolvedValue([applicationA, applicationB]);
            const loggerLogSpy        = jest.spyOn(logger, 'log').mockReturnThis();

            expect(await validate(loaderIO, {app: {domain: 'https://www.narf.de'}})).toBe(expected);
            expect(applicationsListSpy).toHaveBeenCalled();
            expect(loggerLogSpy).not.toHaveBeenCalled();
        });
    });

    test('application not found', async () => {
        const applicationA = new Application({}, {app: 'www.nuff.de'});
        const applicationB = new Application({}, {app: 'www.narf.de'});

        const applicationsListSpy = jest.spyOn(loaderIO.applications, 'list').mockResolvedValue([applicationA, applicationB]);
        const loggerLogSpy        = jest.spyOn(logger, 'log').mockReturnThis();

        expect(await validate(loaderIO, {app: {domain: 'https://www.rofl.de'}})).toBe(false);
        expect(applicationsListSpy).toHaveBeenCalled();
        expect(loggerLogSpy).not.toHaveBeenCalled();
    });

    test('load error', async () => {
        const error = new Error();

        const applicationsListSpy = jest.spyOn(loaderIO.applications, 'list').mockRejectedValue(error);
        const loggerLogSpy        = jest.spyOn(logger, 'log').mockReturnThis();

        expect(await validate(loaderIO, {app: {domain: 'https://www.rofl.de'}})).toBe(false);
        expect(applicationsListSpy).toHaveBeenCalled();
        expect(loggerLogSpy).toHaveBeenCalledWith(error);
    });
});
