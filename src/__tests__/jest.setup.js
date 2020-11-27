beforeEach(() => {
    jest.spyOn(console, 'log').mockImplementation(() => void 0);
    jest.spyOn(console, 'debug').mockImplementation(() => void 0);
    jest.spyOn(console, 'info').mockImplementation(() => void 0);
    jest.spyOn(console, 'warn').mockImplementation(() => void 0);
});

afterEach(() => jest.restoreAllMocks());
