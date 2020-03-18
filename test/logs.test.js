const supertest = require('supertest');
const app = require('../src/app');

const request = supertest(app);
const db = require('../src/database');
const { User, Log } = require('../src/app/models');

let login;

beforeAll(async () => {
  await request()
    .post('/users')
    .send({
      name: 'Tester',
      email: 'tester@squad6.com.br',
      password: '1234567',
    });

  login = await request()
    .post('/login')
    .send({
      email: 'tester@squad6.com.br',
      password: '1234567',
    });
});

afterAll(async () => {
  await db.sequelize.query('');
  await db.sequelize.close();
});

describe('The API on /logs Endpoints at GET method sould...', () => {
  it('Return a list of objects', async () => {
    console.info(login);
  });
});
