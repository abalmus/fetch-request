import { querystring, mandatory } from '../utils/index';
import {
    METHODS,
    DEFAULT_OPTIONS
} from './constants';

import 'isomorphic-fetch';
import 'whatwg-fetch';

interface FetchOptionsI {
    CSRFToken?: string;
    headers: object;
    method: string;
    port?: number;
    url: string;
}

function isObject(obj) {
    return (typeof obj === 'object') && (obj !== null);
}

export class FetchClient {
    post?(url: string): FetchClient;
    get?(url: string): FetchClient;
    put?(url: string): FetchClient;
    delete?(url: string): FetchClient;

    private __request: any = {};
    private __queryStringParams: any = '';

    constructor(private options?: FetchOptionsI) {
        this.__request = Object.assign({}, DEFAULT_OPTIONS, options);

        METHODS.map(this.__createMethod.bind(this));
    }

    /* test-code */
    __testApi() {
        return this.__request
    };
    /* end-test-code */

    public send(data: string | object): Promise<any> {
        checkSubmissionData(data);

        const { __request } = this;

        const body = (
            typeof data === 'string' ?
            data :
            querystring.stringify(data)
        );

        return this.__doFetch(
            this.__appendQueryString(__request.url),
            Object.assign({}, __request, {body})
        );
    }

    public sendJson(data: string| object): Promise<any> {
        return this.send((
            typeof data === 'string' ?
            JSON.stringify(JSON.parse(data)) :
            JSON.stringify(data)
        ));
    }

    public sendForm(form: HTMLFormElement) {
        const formData = new FormData(form);
        const { __request } = this;

        return this.__doFetch(
            form.action,
            Object.assign({}, __request, {body: formData})
        )
    }

    public query(query: string | object) {
        checkSubmissionData(query);

        if (isObject(query)) {
            query = querystring.stringify(query);
        }

        this.__queryStringParams = query;

        return this;
    }

    public headers(field: string | object, value?: string) {
        if (isObject(field)) {
            for (let key in field as Object) {
                if (Object.prototype.hasOwnProperty.call(field, key)) {
                    this.headers(key, field[key])
                }
            }

            return this;
        }

        let existingHeaderName = this.hasHeader(field);
        this.__request.headers[existingHeaderName || field] = value;

        return this;
    }

    public hasHeader(name) {
        let headers;
        let lowercaseHeaders;

        name = name.toLowerCase();
        headers = Object.keys(this.__request.headers);

        lowercaseHeaders = headers.map(header => {
            return header.toLowerCase()
        });

        for (let i = 0; i < lowercaseHeaders.length; i++) {
            if (lowercaseHeaders[i] === name) {
                return headers[i]
            }
        }

        return false
    }

    private __appendQueryString(url: string) {
        if (url.split('?').length > 1) {
            return `${url}&${this.__queryStringParams}`;
        }

        return (
            this.__queryStringParams ?
            `${url}?${this.__queryStringParams}` :
            url
        );
    }

    private __doFetch(url: string, options: RequestInit) {
        return fetch(url, options)
            .then(validateHttpResponse)
    }

    private __applyMethodSpecificHeaders(method) {
        switch(method) {
            case 'POST':
                !this.hasHeader('Content-Type') && this.headers({
                    'Content-Type': 'application/x-www-form-urlencoded'
                });
                break;
        }
    }

    private __createMethod(method) {
        this[method.toLowerCase()] = (url: string, port?: number) => {
            if (!url) throw new Error(`Required parameter "url" in ${method.toLowerCase()} call is missed.`);
            this.__request.url = url;
            this.__request.method = method;

            this.__applyMethodSpecificHeaders(method);

            return this;
        };
    }
}

function validateHttpResponse(response) {
    const { status, ok } = response;

    if (status >= 400 || !ok) {
        throw new Error(JSON.stringify({
            status,
            message: 'Bad response from server'
        }));
    }

    return response;
}

function checkSubmissionData(data) {
    if (!data || (!isObject(data) && typeof data !== 'string')) {
        throw new Error('Data format is not correct please use object or string')
    }
}

export const json = (resp) => resp.json();
export const text = (resp) => resp.text();
export const request = (options?: FetchOptionsI) => new FetchClient(options);
