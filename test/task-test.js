const mocha = require('mocha');
const chai = require('chai');
const request = require('supertest');
const app = require('../server');


const expect = chai.expect;

const userData = {
    login: 'hasheduser',
    password: '12345'
};

let authenticatedUser = request.agent(app);

const taskData = {
    title: 'testtitle',
    text: 'testtext'
};

const titleForRemove = {
    title: 'testtitle'
};

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

describe('GET /task/add', function (done) {
    it('User logged - should return 200', function (done) {
        authenticatedUser.get('/task/add')
            .expect(200, done)
    });

    it('User not logged - should return 400', function (done) {
        request(app).post('/task/add')
            .expect('Location', '/')
            .expect(302, done)
    });

});

describe('POST /task/add', function (done) {
   it('User logged - should return 200', function (done) {
       authenticatedUser.post('/task/add')
           .set('Accept', 'application/x-www-form-urlencoded')
           .set('Content-Type', 'application/x-www-form-urlencoded')
           .send(taskData)
           .expect(200, done)
   });

   it('User not logged - should return 400', function (done) {
      request(app).post('/task/add')
          .set('Accept', 'application/x-www-form-urlencoded')
          .set('Content-Type', 'application/x-www-form-urlencoded')
          .send(taskData)
          .expect(302, done)
   });

});

describe('POST /task/remove', function (done) {

   it('User logged - should return 200', function (done) {
       authenticatedUser.post('/task/remove')
           .set('Accept', 'application/x-www-form-urlencoded')
           .set('Content-Type', 'application/x-www-form-urlencoded')
           .send(titleForRemove)
           .expect(200, done)
   });

   it('User not logged - should return 302', function (done) {
       request(app).post('/task/remove')
           .set('Accept', 'application/x-www-form-urlencoded')
           .set('Content-Type', 'application/x-www-form-urlencoded')
           .send(titleForRemove)
           .expect(302, done)
   });
});