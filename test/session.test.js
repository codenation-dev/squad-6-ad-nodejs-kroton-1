const supertest = require('supertest');
const app = require('../src/app');
const UserModel = require('../src/app/models/User');

const request = supertest(app);

beforeAll(async () => {
  await UserModel.destroy({ truncate: true });
});

afterAll(async () => {
  await UserModel.destroy({ truncate: true });
});

describe('The API on /session EndPoint at POST method shloud...', () => {
  beforeEach(async () => {
    await UserModel.create({
      name: 'Vinicius Ricci',
      email: 'viniciussricci@hotmail.com',
      password: '123456',
    });
  });

  afterEach(async () => {
    await UserModel.destroy({
      where: { email: 'viniciussricci@hotmail.com' },
    });
  });

  it(`Return 200 as status code and a sucessfull login message`, async () => {
    expect.assertions(1);

    const res = await request.post('/session').send({
      email: 'viniciussricci@hotmail.com',
      password: '123456',
    });

    expect(Object.keys(res.body)).toMatchObject(['user', 'token']);
  });

  it(`Return 401 as status code and a Authentication failed message`, async () => {
    expect.assertions(2);

    const res = await request.post('/session').send({
      email: 'viniciussricci@hotmail.com',
      password: '123456789',
    });

    expect(res.statusCode).toBe(401);
    expect(res.body).toMatchObject({
      error: 'Password does not match',
    });
  });

  it(`Return 401 as status code and a does not exists user message`, async () => {
    expect.assertions(2);

    const res = await request.post('/session').send({
      email: 'thiago@hotmail.com',
      password: '12345',
    });

    expect(res.statusCode).toBe(401);
    expect(res.body).toMatchObject({
      error: 'User not found',
    });
  });

  it(`Return 400 as status code and a validation fails message...`, async () => {
    expect.assertions(2);

    const res = await request.post('/session').send({
      emaiil: 'thiago',
      password: '123456',
    });

    expect(res.statusCode).toBe(400);
    expect(res.body).toMatchObject({
      error: 'Validation fails',
    });
  });
});
