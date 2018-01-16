import { decode as parse } from './querystring/decode';
import { encode as stringify } from './querystring/encode';

export const querystring = {
    parse,
    stringify,
}

export function mandatory(prop: string = '') {
    throw new Error(prop + ' is mandatory property');
}
