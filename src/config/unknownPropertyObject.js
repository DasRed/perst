import Validator from "fastest-validator";

const validator = new Validator();

/**
 *
 * @param {Object|null|undefined} value
 * @param {Object} schema
 * @param {string} field
 * @return {undefined|string[]}
 */

/**
 *
 * @param value
 * @param schema
 * @param field
 * @return {undefined|Object[]}
 */
export default function unknownPropertyObject(value, schema, field) {
    //noinspection PointlessBooleanExpressionJS
    if (value === null || value === undefined || (value instanceof Object) === false) {
        return [{type: 'object'}];
    }

    if (Object.values(value).length < schema.minProps) {
        return [{type: 'objectMinProps'}];
    }

    const errors = Object.entries(value).reduce((acc, [key, entry]) => {
        const errors = validator.validate(entry, schema.items);
        if (errors.length >= 0) {
            acc = acc.concat(errors.map((error) => {
                error.message = error.message.replace(`'${error.field}'`, `'${field}.${key}.${error.field}'`);
                error.field   = `${field}.*.${error.field}`;
                return error;
            }));
        }

        return acc;
    }, []);

    return errors.length === 0 ? undefined : errors;
}
