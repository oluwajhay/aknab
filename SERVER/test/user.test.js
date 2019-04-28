/* eslint-disable no-console */
import chai from 'chai';
import chaiHttp from 'chai-http';
import server from '../index';
import queryProivider from '../models/userQuery';


chai.use(chaiHttp);
chai.should();
let token = '';
const acc = '';

before(() => {
  const email = 'tester@gmail.com';
  return queryProivider.deleteUserByEmailQuery(email).then((res) => {}).catch(() => {});
});

describe('UNIT TESTS FOR AUTHENTICATION CONTROLLER', () => {
  describe('/POST REQUEST', () => {
    it('it should make a post request if all fields are not empty ', (done) => {
      chai
        .request(server)
        .post('/api/v1/auth/signup')
        .send({
          lastname: 'Test',
          firstname: 'Tester',
          email: 'tester@gmail.com',
          password: 'testerr',
          type: 'staff',
          is_admin: 'true',
        })
        .end((err, res) => {
          res.body.should.have
            .property('message')
            .to.equals('Registration successful');
          res.body.should.have.property('status').to.equals(201);
          res.body.should.have.property('token').to.be.a('string');
          done();
        });
    });
    it('it should login user ', (done) => {
      chai
        .request(server)
        .post('/api/v1/auth/signin')
        .send({
          email: 'tester@gmail.com',
          password: 'testerr',
        })
        .end((err, res) => {
          res.body.should.have
            .property('message')
            .to.equals('lOGIN Successful');
          token = res.body.token;
          res.body.should.have.property('status').to.equals(200);
          res.body.should.have.property('data').to.be.an('object');
          res.body.should.have.property('token').to.be.a('string');
          done();
        });
    });

    it('it should not login user wrong email', (done) => {
      chai
        .request(server)
        .post('/api/v1/auth/signin')
        .send({
          email: 'tesster@gmail.com',
          password: 'testerr',
        })
        .end((err, res) => {
          res.should.have.status(400);
          done();
        });
    });

    it('it should not login user wrong password', (done) => {
      chai
        .request(server)
        .post('/api/v1/auth/signin')
        .send({
          email: 'tester@gmail.com',
          password: 'tester',
        })
        .end((err, res) => {
          res.should.have.status(400);
          done();
        });
    });

    it('it should not login user ', (done) => {
      chai
        .request(server)
        .post('/api/v1/auth/signin')
        .send({
          email: '',
          password: 'testerr',
        })
        .end((err, res) => {
          res.should.have.status(400);
          done();
        });
    });

    it('it should not make a post request if all fields are empty signin', (done) => {
      const body = {};

      chai
        .request(server)
        .post('/api/v1/auth/signin')
        .send(body)
        .end((err, res) => {
          res.should.have.status(400);
          res.body.should.be.deep.equal({
            status: 400,
            message: 'Please fill all fields',
          });
          done();
        });
    });

    it('it should not make a post request if some fields are empty ', (done) => {
      const body = {
        lastname: '',
        othername: 'Tester',
        firstname: 'Tester',
        email: 'tester@gmail.com',
        password: 'test',
      };

      chai
        .request(server)
        .post('/api/v1/auth/signup')
        .send(body)
        .end((err, res) => {
          res.should.have.status(400);
          res.body.should.be.deep.equal({
            status: 400,
            message: 'please enter a valid Last name not less than 3 letters',
          });
          done();
        });
    });

    it('it should not make a post request if all fields are empty signup', (done) => {
      const body = {};

      chai
        .request(server)
        .post('/api/v1/auth/signup')
        .send(body)
        .end((err, res) => {
          res.should.have.status(400);
          res.body.should.be.deep.equal({
            status: 400,
            message: 'Please fill all fields',
          });
          done();
        });
    });
    it('it should not make a post request if a field is not added ', (done) => {
      const body = {
        othername: 'Tester',
        firstname: 'Tester',
        email: 'tester@gmail.com',
        password: 'test',
      };

      chai
        .request(server)
        .post('/api/v1/auth/signup')
        .send(body)
        .end((err, res) => {
          res.should.have.status(400);
          res.body.should.be.deep.equal({
            status: 400,
            message: 'please enter a valid Last name not less than 3 letters',
          });
          done();
        });
    });

    it('it should not make a post request if a field is not added ', (done) => {
      const body = {
        othername: 'Tester',
        lastname: 'Tester',
        email: 'tester@gmail.com',
        password: 'test',
      };

      chai
        .request(server)
        .post('/api/v1/auth/signup')
        .send(body)
        .end((err, res) => {
          res.should.have.status(400);
          res.body.should.be.deep.equal({
            status: 400,
            message: 'please enter a valid First name not less than 3 letters',
          });
          done();
        });
    });

    it('it should throw an error when you try to add duplicate data ', (done) => {
      const data = {
        lastname: 'Test',
        firstname: 'Tester',
        email: 'tester@gmail.com',
        password: 'testerr',
        type: 'client',
        is_admin: 'true',
      };

      chai
        .request(server)
        .post('/api/v1/auth/signup')
        .send(data)
        .end((err, res) => {
          res.should.have.status(400);
          res.body.should.be.deep.equal({
            status: 400,
            message: 'User with this email tester@gmail.com exists already',
          });
          done();
        });
    });
  });
});