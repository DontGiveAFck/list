const mocha = require('mocha');
const chai = require('chai');
const app = require('../server');

const assert = chai.assert;
const experct = chai.expect;

const userData = {
    login: 'hasheduser',
    password: '12345'
};

