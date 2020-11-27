import Application from 'loader.io.api/src/Application/Application.js';

export default async function validateDomain(loaderIO, config) {
    const domain       = new URL(config.app.domain);

    try {
        const applications = await loaderIO.applications.list();
        const application  = applications.find((application) => application.app === domain.host);

        if (application === undefined) {
            return false;
        }

        return application.status === Application.STATUS.VERIFIED;
    }
    catch (error) {
        console.log(error);
        return false;
    }
};
