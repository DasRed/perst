import Validator from "fastest-validator";

const validator = new Validator();

export default function unknownPropertyObject(value, schema, field, parent, context) {
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
