import chai, { expect } from 'chai';
import chaiHttp from 'chai-http';
import server from '../../server'

chai.use(chaiHttp);

let response: any;

describe('Testing user info route for exception flows', function() {
  beforeEach(function (done) {
    chai.request(server)
        .get('/user/me')
        .end((err, res) => {
          response = res;
          done();
        });
  });

  describe('Accessing the route not logged in', function() {

    it('it should return statusCode unauthorized (401)', function() {
      expect(response.statusCode).to.be.eql(401);
    });

    it('it should not return user info', function() {
      expect(response.body.data).to.be.eql(null);
    });

  });
});

describe('Testing user info route for acceptance flows', function() {
  const requestData = {
    'email':  'user@gmail.com',
    'password':  '12345'
  }

  beforeEach(function (done) {
    chai.request(server)
    .post('/login')
    .send(requestData)
    .then((res) => {
      const token = res.body.data.token
      chai.request(server)
        .get('/user/me')
        .set({ "Authorization": `Bearer ${token}` })
        .end((err, res) => {
          response = res;
          done();
        });
    });
  });
  

  describe('Accessing the route not logged in', function() {

    it('it should return statusCode success (200)', function() {
      expect(response.statusCode).to.be.eql(200);
    });

    it('it should return user info', function() {
      expect(response.body.data).to.have.property('email')
    });

  });
});