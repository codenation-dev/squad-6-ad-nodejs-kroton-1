const supertest = require('supertest');
const app = require('../src/app');
const Log = require('../src/app/models/Log');
const User = require('../src/app/models/User');
const db = require('../src/database/index');

const request = supertest(app);

let login = '';

beforeAll(async () => {
  const objLogin = await request.post('/users').send({
    name: 'Tester',
    email: 'tester@squad6.com.br',
    password: '1234567',
  });

  if (objLogin) {
    login = objLogin.body.token;
  }
});

afterAll(async () => {
  await User.destroy({ truncate: true });
  await db.close();
});

beforeEach(async () => {
  await Log.create({
    title: 'Teste',
    message: 'Log teste',
    user_token: 'AbC',
    events_number: 100,
    level: 'DEBUG',
    environment: 'DEV',
    source: 'supertest',
    timestamp: Date.now(),
  });

  await Log.create({
    title: 'Teste 2',
    message: 'Log teste 2',
    user_token: 'def',
    events_number: 200,
    level: 'DEBUG',
    environment: 'DEV',
    source: 'supertest',
    timestamp: Date.now(),
  });

  await Log.create({
    title: 'Teste 3',
    message: 'Log teste 3',
    user_token: 'ghi',
    events_number: 50,
    level: 'ERROR',
    environment: 'HOMOLOGACAO',
    source: 'supertest',
    timestamp: Date.now(),
  });

  await Log.create({
    title: 'Teste 4',
    message: 'Log teste 4',
    user_token: 'jkl',
    events_number: 1,
    level: 'CRITICAL_ERROR',
    environment: 'PRODUCAO',
    source: 'supertest',
    timestamp: Date.now(),
  });

  await Log.create({
    title: 'Teste 5',
    message: 'Log teste 5',
    user_token: 'mno',
    events_number: 140,
    level: 'WARNING',
    environment: 'HOMOLOGACAO',
    source: 'supertest',
    timestamp: Date.now(),
  });

  await Log.create({
    title: 'Teste 6',
    message: 'Log teste 6',
    user_token: 'pqr',
    events_number: 75,
    level: 'ERROR',
    environment: 'DEV',
    source: 'supertest',
    timestamp: Date.now(),
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
        total: 6,
      },
      results: [
        {
          title: 'Teste',
          message: 'Log teste',
          user_token: 'AbC',
          events_number: 100,
          level: 'DEBUG',
          environment: 'DEV',
          source: 'supertest',
        },
        {
          title: 'Teste 2',
          message: 'Log teste 2',
          user_token: 'def',
          events_number: 200,
          level: 'DEBUG',
          environment: 'DEV',
          source: 'supertest',
        },
        {
          title: 'Teste 3',
          message: 'Log teste 3',
          user_token: 'ghi',
          events_number: 50,
          level: 'ERROR',
          environment: 'HOMOLOGACAO',
          source: 'supertest',
        },
        {
          title: 'Teste 4',
          message: 'Log teste 4',
          user_token: 'jkl',
          events_number: 1,
          level: 'CRITICAL_ERROR',
          environment: 'PRODUCAO',
          source: 'supertest',
        },
        {
          title: 'Teste 5',
          message: 'Log teste 5',
          user_token: 'mno',
          events_number: 140,
          level: 'WARNING',
          environment: 'HOMOLOGACAO',
          source: 'supertest',
        },
        {
          title: 'Teste 6',
          message: 'Log teste 6',
          user_token: 'pqr',
          events_number: 75,
          level: 'ERROR',
          environment: 'DEV',
          source: 'supertest',
        },
      ],
    });
  });

  it('Return a limited list of objects', async () => {
    expect.assertions(3);

    const result = await request
      .get('/logs')
      .query({ limit: '2', offset: '2' })
      .set('Authorization', `Bearer ${login}`);

    expect(result.statusCode).toBe(200);

    expect(Object.keys(result.body.meta)).toMatchObject([
      'next',
      'previous',
      'total',
    ]);

    expect(result.body).toMatchObject({
      meta: {
        total: 6,
      },
      results: [
        {
          title: 'Teste 3',
          message: 'Log teste 3',
          user_token: 'ghi',
          events_number: 50,
          level: 'ERROR',
          environment: 'HOMOLOGACAO',
          source: 'supertest',
        },
        {
          title: 'Teste 4',
          message: 'Log teste 4',
          user_token: 'jkl',
          events_number: 1,
          level: 'CRITICAL_ERROR',
          environment: 'PRODUCAO',
          source: 'supertest',
        },
      ],
    });
  });

  it('Return a limited list of objects with queries', async () => {
    expect.assertions(3);

    const result = await request
      .get('/logs')
      .query({ env: 'DEV', limit: '1', offset: '1' })
      .set('Authorization', `Bearer ${login}`);

    expect(result.statusCode).toBe(200);

    expect(Object.keys(result.body.meta)).toMatchObject([
      'next',
      'previous',
      'total',
    ]);

    expect(result.body).toMatchObject({
      meta: {
        total: 3,
      },
      results: [
        {
          title: 'Teste 2',
          message: 'Log teste 2',
          user_token: 'def',
          events_number: 200,
          level: 'DEBUG',
          environment: 'DEV',
          source: 'supertest',
        },
      ],
    });
  });

  it('Return a list of objects based on queryBy level', async () => {
    expect.assertions(2);

    const result = await request
      .get('/logs')
      .query({ queryBy: 'level', queryValue: 'DEBUG' })
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
          level: 'DEBUG',
          environment: 'DEV',
          source: 'supertest',
        },
        {
          title: 'Teste 2',
          message: 'Log teste 2',
          user_token: 'def',
          events_number: 200,
          level: 'DEBUG',
          environment: 'DEV',
          source: 'supertest',
        },
      ],
    });
  });

  it('Return a list of objects based on queryBy message', async () => {
    expect.assertions(2);

    const result = await request
      .get('/logs')
      .query({ queryBy: 'message', queryValue: 'teste 5' })
      .set('Authorization', `Bearer ${login}`);

    expect(result.statusCode).toBe(200);

    expect(result.body).toMatchObject({
      meta: {
        total: 1,
      },
      results: [
        {
          title: 'Teste 5',
          message: 'Log teste 5',
          user_token: 'mno',
          events_number: 140,
          level: 'WARNING',
          environment: 'HOMOLOGACAO',
          source: 'supertest',
        },
      ],
    });
  });

  it('Return a list of objects based on environment', async () => {
    expect.assertions(2);

    const result = await request
      .get('/logs')
      .query({ env: 'HOMOLOGACAO' })
      .set('Authorization', `Bearer ${login}`);

    expect(result.statusCode).toBe(200);

    expect(result.body).toMatchObject({
      meta: {
        total: 2,
      },
      results: [
        {
          title: 'Teste 3',
          message: 'Log teste 3',
          user_token: 'ghi',
          events_number: 50,
          level: 'ERROR',
          environment: 'HOMOLOGACAO',
          source: 'supertest',
        },
        {
          title: 'Teste 5',
          message: 'Log teste 5',
          user_token: 'mno',
          events_number: 140,
          level: 'WARNING',
          environment: 'HOMOLOGACAO',
          source: 'supertest',
        },
      ],
    });
  });

  it('Return a list of objects based on sortBy events_number', async () => {
    expect.assertions(2);

    const result = await request
      .get('/logs')
      .query({ sortBy: 'events_number' })
      .set('Authorization', `Bearer ${login}`);

    expect(result.statusCode).toBe(200);

    expect(result.body).toMatchObject({
      meta: {
        total: 6,
      },
      results: [
        {
          title: 'Teste 2',
          message: 'Log teste 2',
          user_token: 'def',
          events_number: 200,
          level: 'DEBUG',
          environment: 'DEV',
          source: 'supertest',
        },
        {
          title: 'Teste 5',
          message: 'Log teste 5',
          user_token: 'mno',
          events_number: 140,
          level: 'WARNING',
          environment: 'HOMOLOGACAO',
          source: 'supertest',
        },
        {
          title: 'Teste',
          message: 'Log teste',
          user_token: 'AbC',
          events_number: 100,
          level: 'DEBUG',
          environment: 'DEV',
          source: 'supertest',
        },
        {
          title: 'Teste 6',
          message: 'Log teste 6',
          user_token: 'pqr',
          events_number: 75,
          level: 'ERROR',
          environment: 'DEV',
          source: 'supertest',
        },
        {
          title: 'Teste 3',
          message: 'Log teste 3',
          user_token: 'ghi',
          events_number: 50,
          level: 'ERROR',
          environment: 'HOMOLOGACAO',
          source: 'supertest',
        },
        {
          title: 'Teste 4',
          message: 'Log teste 4',
          user_token: 'jkl',
          events_number: 1,
          level: 'CRITICAL_ERROR',
          environment: 'PRODUCAO',
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
      level: 'DEBUG',
      environment: 'DEV',
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

describe('The API on /logs Endpoints at POST method should...', () => {
  it('Save a log successfully', async () => {
    expect.assertions(3);

    const body = {
      title: 'Error Test',
      message: 'Quebrou aqui',
      events_number: 1,
      level: 'DEBUG',
      environment: 'DEV',
      source: 'localhost',
      timestamp: '2020-03-14 10:53:00',
    };

    const result = await request
      .post('/logs')
      .set('Authorization', `Bearer ${login}`)
      .send(body);

    expect(result.statusCode).toBe(201);

    expect(result.body).toMatchObject({
      title: 'Error Test',
      message: 'Quebrou aqui',
      events_number: 1,
      level: 'DEBUG',
      environment: 'DEV',
      source: 'localhost',
    });

    expect(Object.keys(result.body)).toMatchObject([
      'toArchive',
      'id',
      'title',
      'message',
      'events_number',
      'level',
      'environment',
      'source',
      'timestamp',
      'user_token',
      'updatedAt',
      'createdAt',
    ]);
  });

  it('Not save a log with missing fields', async () => {
    expect.assertions(2);

    const body = {
      title: 'Error Test',
      events_number: 1,
      level: 'DEBUG',
      environment: 'DEV',
      source: 'localhost',
      timestamp: '2020-03-14 10:53:00',
    };

    const result = await request
      .post('/logs')
      .set('Authorization', `Bearer ${login}`)
      .send(body);

    expect(result.statusCode).toBe(400);

    expect(result.body).toMatchObject({
      error: 'Validation Errors',
    });
  });
});
