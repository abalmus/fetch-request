import { request, json, text } from '../index';
import { METHODS, DEFAULT_OPTIONS } from '../request/constants';

import { expect, assert } from 'chai';
import * as nock from 'nock';

import 'mocha';
import { querystring } from '../utils/index';

describe('Fetch Client - Request', () => {
    it('should have HTTP method set', () => {
        const requestInstance = request();

        METHODS.map(method => {
            expect(requestInstance[method.toLowerCase()]).to.be.a('function');
        });
    });

    it('should throw an error if no url provided', () => {
        const requestInstance = request();

        METHODS.map(method => {
            expect(() => { requestInstance[method.toLowerCase()]() })
                .to.throw(`Required parameter "url" in ${method.toLowerCase()} call is missed.`);
        });

    });

    it('should be initialized with default options', () => {
        const requestInstance = request();

        METHODS.map(method => {
            expect(requestInstance[method.toLowerCase()]('/api/').__testApi())
                .to.deep.include(DEFAULT_OPTIONS);
        });
    });

    it('should extend config with new headers', () => {
        const requestInstance = request();
        const headers = {
            'Content-Type': 'image/jpeg',
            'Accept-Charset' : 'utf-8'
        };

        expect(requestInstance.post('/api/').__testApi().headers)
            .to.not.deep.include(headers);
        expect(requestInstance.headers(headers).post('/api/').__testApi().headers)
            .to.deep.include(headers);
        expect(requestInstance.hasHeader('Accept-Charset'))
            .to.be.equal('Accept-Charset');
    });

    it('should throw wrong data format error', () => {
        const requestInstance = request();

        expect(() => {
            requestInstance.post('/api/')
            .send(undefined)
        }).to.throw('Data format is not correct please use object or string');
    });

    it('should add params to the request body', () => {
        const requestInstance = request();
        const checkBodyData = {param1: 1, param2: 2};

        nock('http://localhost')
            .post('/api/checkBody', body => {
                return querystring.stringify(checkBodyData) === body;
            })
            .reply(201, {ok: true});

        return requestInstance.post('http://localhost/api/checkBody')
            .send(checkBodyData).then((response) => {
                expect(response.ok).to.equal(true);
            });
    });

    it('should accept params as encoded string', () => {
        const requestInstance = request();
        const checkBodyData = {param: 1};

        nock('http://localhost')
            .post('/api/checkBody', body => {
                return querystring.stringify(checkBodyData) === body;
            })
            .reply(201, {ok: true});

        return requestInstance.post('http://localhost/api/checkBody')
            .send(querystring.stringify(checkBodyData)).then((response) => {
                expect(response.ok).to.equal(true);
            });
    });

    it('should throw an error if bad response', () => {
        const requestInstance = request();
        const checkBodyData = {param: 1};

        nock('http://localhost')
            .post('/api/checkBody', body => {
                return querystring.stringify(checkBodyData) === body;
            })
            .reply(500, {ok: false});

            return requestInstance.post('http://localhost/api/checkBody')
                .send(querystring.stringify(checkBodyData)).catch(error => {
                    expect(JSON.parse(error.message).status).to.equal(500);
                });
    });

    it('should add query string', () => {
        const requestInstance = request();
        const checkBodyData = {param: 1};
        const queryString = {param2: 2};

        nock('http://localhost')
            .post('/api/checkBody')
            .query(queryString)
            .reply(201, {ok: true});

        return requestInstance.post('http://localhost/api/checkBody')
            .query(queryString)
            .send(checkBodyData).then((response) => {
                expect(response.ok).to.equal(true);
            });
    });

    it('should merge query string with existing params', () => {
        const requestInstance = request();
        const checkBodyData = {param: 1};

        nock('http://localhost')
            .post('/api/checkBody')
            .query({param2: 2, param3: 3})
            .reply(201, {ok: true});

        return requestInstance.post('http://localhost/api/checkBody?param2=2')
            .query({param3: 3})
            .send(checkBodyData).then((response) => {
                expect(response.ok).to.equal(true);
            });
    });

    it('should returns a promise that resolves response body as JSON', () => {
        const requestInstance = request();
        const checkBodyData = {param: 1};
        const replyData = {data: {id: 200, name: 'testName'}};

        nock('http://localhost')
            .post('/api/checkJson')
            .reply(200, replyData);

        return requestInstance.post('http://localhost/api/checkJson')
            .send(checkBodyData)
                .then(json)
                .then((response) => {
                expect(response).to.deep.include(replyData);
            });
    });

    it('should returns a promise that resolves response body as TEXT', () => {
        const requestInstance = request();
        const checkBodyData = {param: 1};
        const replyText = '<p>Page Title</p>';

        nock('http://localhost')
            .post('/api/checkJson')
            .reply(200, replyText);

        return requestInstance.post('http://localhost/api/checkJson')
            .send(checkBodyData)
                .then(text)
                .then((response) => {
                expect(response).to.equal(replyText);
            });
    });

    it('should be able to send data as json - string', () => {
        const requestInstance = request();

        nock('http://localhost')
            .post('/api/checkJson', body => {
                return body.a === 10 && body.b === 20;
            })
            .reply(200, {ok: true});

        return requestInstance.post('http://localhost/api/checkJson')
            .sendJson('{"a": 10, "b": 20}')
                .then((response) => {
                expect(response.ok).to.equal(true);
            });
    });

    it('should be able to send data as json - object', () => {
        const requestInstance = request();

        nock('http://localhost')
            .post('/api/checkJson', body => {
                return body.a === 10 && body.b === 20;
            })
            .reply(200, {ok: true});

        return requestInstance.post('http://localhost/api/checkJson')
            .sendJson({a: 10, b: 20})
                .then((response) => {
                expect(response.ok).to.equal(true);
            });
    });

    it('should be able to send form data', () => {
        const requestInstance = request();
        expect(requestInstance.sendForm).to.be.a('function');
    });
});
