import unknownPropertyObject from '../unknownPropertyObject.js';
import fixtureSuccess from './fixture/unkownPropertyObject.success.js';

describe('unknownPropertyObject.js', () => {
    test.each([[null], [undefined], [42]])('failed by value', (value) => expect(unknownPropertyObject(value, {}, 'nuff')).toEqual([{type: 'object'}]));

    test('failed by minProps', () => expect(unknownPropertyObject({}, {minProps: 5}, 'nuff')).toEqual([{type: 'objectMinProps'}]))

    test('success', () => expect(unknownPropertyObject({
        narf: {
            name:     'narf',
            duration: 60,
            clients:  25,
            request:  {
                path: '/narf'
            },
        }
    }, fixtureSuccess, 'nuff')).toBeUndefined());

    test('failed', () => expect(unknownPropertyObject({
        narf: {
            name:     'narf',
            duration: 60,
            clients:  25,
        }
    }, fixtureSuccess, 'nuff')).toEqual([{
        actual:  undefined,
        field:   'nuff.*.request',
        message: 'The \'nuff.narf.request\' field is required.',
        type:    'required'
    }]));
});
