function stringifyPrimitive(val) {
    switch (typeof val) {
        case 'string':
            return val;

        case 'boolean':
            return val ? 'true' : 'false';

        case 'number':
            return isFinite(val) ? val : '';

        default:
            return '';
    }
};

export function encode(obj, sep?: string, eq?: string, name?: any) {
    sep = sep || '&';
    eq = eq || '=';
    if (obj === null) {
        obj = undefined;
    }

    if (typeof obj === 'object') {
        return Object.keys(obj).map(function (k) {
            var ks = encodeURIComponent(stringifyPrimitive(k)) + eq;
            if (Array.isArray(obj[k])) {
                return obj[k].map(function (v) {
                    return ks + encodeURIComponent(stringifyPrimitive(v));
                }).join(sep);
            } else {
                return ks + encodeURIComponent(stringifyPrimitive(obj[k]));
            }
        }).join(sep);

    }

    if (!name) return '';
    return encodeURIComponent(stringifyPrimitive(name)) + eq +
        encodeURIComponent(stringifyPrimitive(obj));
};
