const mocha = require('mocha');
const chai = require('chai');
const request = require('supertest');
const app = require('../server');


const expect = chai.expect;


const userData = {
    login: 'hasheduser',
    email: 'asdsa@asads.ru',
    password: '12345'
};

const newUserData = {
    login: 'newUser',
    email: 'newemail@mail.ru',
    password: '12345',
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

describe('GET /signup', function (done) {

    it('should return 302 and redirect to /profile', function (done) {
       authenticatedUser.get('/signup')
           .expect('Location', '/profile')
           .expect(302, done);
    });
    
    it('should return 200 and location /signup', function (done) {
        request(app).get('/signup')
            .expect(200, done);
    })
});

describe('POST /signup', function (done) {

    it('Already logged - should return 302 and redirect to /profile', function (done) {
       authenticatedUser.post('/signup')
           .expect('Location', '/profile')
           .expect(302, done);
    });

    it('User exists - should return 400', function (done) {
        request(app).post('/signup')
            .set('Accept', 'application/x-www-form-urlencoded')
            .set('Content-Type', 'application/x-www-form-urlencoded')
            .send(userData)
            .expect(400, done);
    });

    it('Sign up success - should return 200 (if error - maybe this user signed up, check signup-test.js newUserData)', function (done) {
        request(app).post('/signup')
            .set('Accept', 'application/x-www-form-urlencoded')
            .set('Content-Type', 'application/x-www-form-urlencoded')
            .send(newUserData)
            .expect(200, done)
    });

});

