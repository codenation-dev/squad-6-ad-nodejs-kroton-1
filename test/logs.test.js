import supertest from 'supertest';
import app from '../src/app';
import Log from '../src/app/models/Log';
import User from '../src/app/models/User';

const request = supertest(app);

let login = {};

beforeAll(async () => {
  await request.post('/users').send({
    name: 'Tester',
    email: 'tester@squad6.com.br',
    password: '1234567',
  });

  const objLogin = await request.post('/login').send({
    email: 'tester@squad6.com.br',
    password: '1234567',
  });

  if (objLogin) {
    login = objLogin.body.token;
  }
});

afterAll(async () => {
  User.destroy({ truncate: true });
});

beforeEach(async () => {
  await Log.create({
    title: 'Teste',
    message: 'Log teste',
    user_token: 'AbC',
    events_number: 100,
    level: 'debug',
    environment: 'dev',
    source: 'supertest',
  });

  await Log.create({
    title: 'Teste 2',
    message: 'Log teste 2',
    user_token: 'def',
    events_number: 200,
    level: 'debug',
    environment: 'dev',
    source: 'supertest',
  });

  await Log.create({
    title: 'Teste 3',
    message: 'Log teste 3',
    user_token: 'ghi',
    events_number: 50,
    level: 'error',
    environment: 'homologacao',
    source: 'supertest',
  });

  await Log.create({
    title: 'Teste 4',
    message: 'Log teste 4',
    user_token: 'jkl',
    events_number: 1,
    level: 'critical_error',
    environment: 'producao',
    source: 'supertest',
  });

  await Log.create({
    title: 'Teste 5',
    message: 'Log teste 5',
    user_token: 'mno',
    events_number: 140,
    level: 'warning',
    environment: 'homologacao',
    source: 'supertest',
  });
});

afterEach(async () => {
  await Log.destroy({ truncate: true });
});

describe('The API on /logs Endpoints at GET method should...', () => {
  it('Return a list of objects', async () => {
    expect.assertions(2);

    const result = await request
      .get('/logs')
      .set('Authorization', `Bearer ${login}`);

    expect(result.statusCode).toBe(200);

    expect(result.body).toMatchObject({
      meta: {
        total: 5,
      },
      results: [
        {
          title: 'Teste',
          message: 'Log teste',
          user_token: 'AbC',
          events_number: 100,
          level: 'debug',
          environment: 'dev',
          source: 'supertest',
        },
        {
          title: 'Teste 2',
          message: 'Log teste 2',
          user_token: 'def',
          events_number: 200,
          level: 'debug',
          environment: 'dev',
          source: 'supertest',
        },
      ],
    });
  });

  it('Return a list of objects based on filters', async () => {
    expect.assertions(2);

    const result = await request
      .get('/logs')
      .set('Authorization', `Bearer ${login}`);

    expect(result.statusCode).toBe(200);

    expect(result.body).toMatchObject({
      meta: {
        total: 2,
      },
      results: [
        {
          title: 'Teste',
          message: 'Log teste',
          user_token: 'AbC',
          events_number: 100,
          level: 'debug',
          environment: 'dev',
          source: 'supertest',
        },
        {
          title: 'Teste 2',
          message: 'Log teste 2',
          user_token: 'def',
          events_number: 200,
          level: 'debug',
          environment: 'dev',
          source: 'supertest',
        },
      ],
    });
  });

  it('Return a single object based on its id', async () => {
    expect.assertions(2);

    const obj = (await Log.findOne({})).dataValues;

    const result = await request
      .get(`/logs/${obj.id}`)
      .set('Authorization', `Bearer ${login}`);

    expect(result.statusCode).toBe(200);

    expect(result.body).toMatchObject({
      title: 'Teste',
      message: 'Log teste',
      user_token: 'AbC',
      events_number: 100,
      level: 'debug',
      environment: 'dev',
      source: 'supertest',
    });
  });

  it('Return an error passing wrong id', async () => {
    expect.assertions(2);

    const result = await request
      .get('/logs/50000000')
      .set('Authorization', `Bearer ${login}`);

    expect(result.statusCode).toBe(404);

    expect(result.body).toMatchObject({
      message: 'Cannot find with id especified',
    });
  });

  it('Return an error passing string for id', async () => {
    expect.assertions(2);

    const result = await request
      .get('/logs/null')
      .set('Authorization', `Bearer ${login}`);

    expect(result.statusCode).toBe(400);

    expect(result.body).toMatchObject({ message: 'Something went wrong' });
  });
});

describe('The API on /logs Endpoints at PUT method should...', () => {
  it('Archive an object successfully', async () => {
    expect.assertions(2);

    const obj = (await Log.findOne({})).dataValues;

    const result = await request
      .put(`/logs/${obj.id}`)
      .set('Authorization', `Bearer ${login}`);

    expect(result.statusCode).toBe(200);

    expect(result.body).toMatchObject({ message: 'Archived successfully' });
  });

  it('Return an error passing wrong id', async () => {
    expect.assertions(2);

    const result = await request
      .put('/logs/500000')
      .set('Authorization', `Bearer ${login}`);

    expect(result.statusCode).toBe(404);

    expect(result.body).toMatchObject({
      message: 'Cannot archive, object not found',
    });
  });

  it('Return an error passing string for id', async () => {
    expect.assertions(2);

    const result = await request
      .put('/logs/acbd')
      .set('Authorization', `Bearer ${login}`);

    expect(result.statusCode).toBe(400);

    expect(result.body).toMatchObject({ message: 'Something went wrong' });
  });
});

describe('The API on /logs Endpoints at DELETE method should...', () => {
  it('Delete an object successfully', async () => {
    expect.assertions(2);

    const obj = (await Log.findOne({})).dataValues;

    const result = await request
      .delete(`/logs/${obj.id}`)
      .set('Authorization', `Bearer ${login}`);

    expect(result.statusCode).toBe(204);

    expect(result.body).toMatchObject({});
  });

  it('Return an error passing wrong id', async () => {
    expect.assertions(2);

    const result = await request
      .delete('/logs/500000')
      .set('Authorization', `Bearer ${login}`);

    expect(result.statusCode).toBe(404);

    expect(result.body).toMatchObject({
      message: 'Cannot drop, object not found',
    });
  });

  it('Return an error passing string for id', async () => {
    expect.assertions(2);

    const result = await request
      .delete('/logs/abcd')
      .set('Authorization', `Bearer ${login}`);

    expect(result.statusCode).toBe(400);

    expect(result.body).toMatchObject({ message: 'Something went wrong' });
  });
});
