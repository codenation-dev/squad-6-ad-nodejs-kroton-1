import supertest from 'supertest';
import app from '../src/app';
import db from '../src/database';
import Log from '../src/app/models/Log';

const request = supertest(app);

let login = {};

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
});

afterEach(async () => {
  await Log.destroy({});
});

describe('The API on /logs Endpoints at GET method should...', () => {
  it('Return a list of objects', async () => {
    expect.assertions(2);

    const result = await request.get('/logs').set('Authorization', login.token);

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

    const result = await request
      .get('/logs/1')
      .set('Authorization', login.token);

    expect(result.statusCode).toBe(200);

    expect(result.body).toMatchObject({
      meta: {
        total: 1,
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
      ],
    });
  });

  it('Return an error passing wrong id', async () => {
    expect.assertions(2);

    const result = await request
      .get('/logs/5')
      .set('Authorization', login.token);

    expect(result.statusCode).toBe(404);

    expect(result.body).toMatchObject({
      message: 'Cannot find with id especified',
    });
  });

  it('Return an error passing string for id', async () => {
    expect.assertions(2);

    const result = await request
      .get('/logs/null')
      .set('Authorization', login.token);

    expect(result.statusCode).toBe(400);

    expect(result.body).toMatchObject({ message: 'Something went wrong' });
  });
});

describe('The API on /logs Endpoints at PUT method should...', () => {
  it('Archive an object successfully', async () => {
    expect.assertions(2);

    const result = await request
      .put('/logs/1')
      .set('Authorization', login.token);

    expect(result.statusCode).toBe(200);

    expect(result.body).toMatchObject({ message: 'Archived successfully' });
  });

  it('Return an error passing wrong id', async () => {
    expect.assertions(2);

    const result = await request
      .put('/logs/5')
      .set('Authorization', login.token);

    expect(result.statusCode).toBe(404);

    expect(result.body).toMatchObject({
      message: 'Cannot archive, object not found',
    });
  });

  it('Return an error passing string for id', async () => {
    expect.assertions(2);

    const result = await request
      .put('/logs/null')
      .set('Authorization', login.token);

    expect(result.statusCode).toBe(400);

    expect(result.body).toMatchObject({ message: 'Something went wrong' });
  });
});

describe('The API on /logs Endpoints at DELETE method should...', () => {
  it('Delete an object successfully', async () => {
    expect.assertions(2);

    const result = await request
      .delete('/logs/1')
      .set('Authorization', login.token);

    expect(result.statusCode).toBe(204);

    expect(result.body).toMatchObject({});
  });

  it('Return an error passing wrong id', async () => {
    expect.assertions(2);

    const result = await request
      .put('/logs/5')
      .set('Authorization', login.token);

    expect(result.statusCode).toBe(404);

    expect(result.body).toMatchObject({
      message: 'Cannot drop, object not found',
    });
  });

  it('Return an error passing string for id', async () => {
    expect.assertions(2);

    const result = await request
      .put('/logs/null')
      .set('Authorization', login.token);

    expect(result.statusCode).toBe(400);

    expect(result.body).toMatchObject({ message: 'Something went wrong' });
  });
});
