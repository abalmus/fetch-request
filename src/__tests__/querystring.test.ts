import { querystring, mandatory } from '../utils/index';
import { expect, assert } from 'chai';
import 'mocha';

const testCases = [
    ['', {}],
    ['foo=bar&foo=baz', {'foo': ['bar', 'baz']}],
    ['blah=burp', {'blah': 'burp'}],
    ['gragh=1&gragh=3&goo=2', {'gragh': ['1', '3'], 'goo': '2'}],
    ['frappucino=muffin&goat%5B%5D=scone&pond=moose', {'frappucino': 'muffin', 'goat[]': 'scone', 'pond': 'moose'}],
    ['trololol=yes&lololo=no', {'trololol': 'yes', 'lololo': 'no'}]
];

describe('Querystring', () => {
    it('should parse canonical query string properly', () => {
        testCases.forEach(testCase => {
            expect(querystring.parse(testCase[0])).to.deep.equal(testCase[1]);
        });
    });

    it('should encode objects', () => {
        testCases.forEach(testCase => {
            expect(querystring.stringify(testCase[1])).to.deep.equal(testCase[0]);
        });
    });

    it('should throw an error', () => {
        expect(querystring.parse(null)).to.be.an('object');
        expect(querystring.parse(undefined)).to.be.an('object');
    });

    it('should be able to set parse options', () => {
        expect(querystring.parse('foo:bar;foo:quux', ';', ':', {maxKeys: 10}))
            .to.deep.equal({'foo': ['bar', 'quux']});
    });

    it('should be able to encode URI component', () => {
        expect(querystring.stringify('foo:bar;foo:quux', ';', ':', 'test'))
            .to.equal('test:foo%3Abar%3Bfoo%3Aquux');
        expect(querystring.stringify('foo:bar;foo:quux', ';', ':', true))
            .to.equal('true:foo%3Abar%3Bfoo%3Aquux');
        expect(querystring.stringify('foo:bar;foo:quux', ';', ':', null))
            .to.equal('');
    });

    // to be moved to a separate test
    it('mondatory function should throw error', ()  => {
        expect(() => {mandatory('test')}).to.throw('test is mandatory property');
    })
});
