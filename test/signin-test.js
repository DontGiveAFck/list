const mocha = require('mocha');
const chai = require('chai');
const request = require('supertest');
const app = require('../server');

const expect = chai.expect;

const userData = {
    login: 'admin',
    password: '12345'
};

let authenticatedUser = request.agent(app);

before(function(done){
    authenticatedUser
        .post('/profile')
        .send(userData)
        .end(function(err, response){
            expect(response.statusCode).to.equal(200);
            expect('Location', '/profile');
            done();
        });
});

describe('GET /profile', function (done) {

    it('should return a 200 response if the user is logged in', function (done) {
        authenticatedUser.get('/profile')
            .expect(200, done);
    });

    it('should return a 302 response and redirect to /', function (done) {
        request(app).get('/profile')
            .expect('Location', '/')
            .expect(302, done);
    })
});