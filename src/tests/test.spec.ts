import chai, { expect } from 'chai';
import chaiHttp from 'chai-http';
import server from '../server'

chai.use(chaiHttp);

describe("Routes testing for/test.", function() {
 
  let error: Error, response: any;

  before(function(done) {
    chai.request(server).get("/test").end(function(err, res) {
      error = err, response = res;
      done();
    });
  });

  it("should return a success message", function() {
    expect(response.body.status).to.equal(true);
  });

  it("should return an array", function() {
    expect(response.body.data).to.be.an("array");
  });

});

describe("Routes testing for /error-test.", function() {
 
  let error: Error, response: any;

  before(function(done) {
    chai.request(server).get("/error-test").end(function(err, res) {
      error = err, response = res;
      done();
    });
  });

  it("should return a false message", function() {
    expect(response.body.status).to.equal(false);
  });

  it("should return a message", function() {
    expect(response.body.message).to.be.an("string");
  });

  it("should return the erros", function() {
    expect(response.body.erros).to.be.an("array");
  });

});