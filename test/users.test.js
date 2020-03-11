const supertest = require('supertest');
const app = require('../src/app');
const request = supertest(app);
const db = require('../src/database');
const model = require('../models/User');


beforeAll(async () => {
  await db.sequelize.query('');
  await db.sequelize.sync();
});

afterAll(async () => {
  await db.sequelize.query('');
  await db.sequelize.close();
});

describe('The API on /users Endpoint at POST method should...',  () => {

  beforeEach(async () => {
    await UserModel.create({
      "name": "Vinicius Ricci",
      "email": "viniciussricci@hotmail.com",
      "password": "123456"
    });
  });

  afterEach(async () => {
    await db.sequelize.query('TRUNCATE TABLE users;')
  });

  it(`Return 400 as status code and error message if the users already exist`, async () => {
    expect.assertions(2);

    const res = await request()
      .post('/users')
      .send({
        "name": "Vinicius Ricci",
        "email": "viniciussricci@hotmail.com",
        "password": "123456"
      })

    expect(res.statusCode).toEqual(400);
    expect(res.body).toMatchObject({
      message: 'This user alredy exists'
    });
    
    done();
  });

  it(`Return 201 as status code with a message of sucess and validation of the insertion in database`, async () => {
    expect.assertions(3);
    
    const res = await request()
      .post('/users')
      .send({
        "name": "Adriano codenation",
        "email": "adriano@codenation.com.br",
        "password": "1234567"
      })

      expect(res.statusCode).toEqual(201);
      expect(res.body).toMatchObject({
        message: 'User created sucessfully'  
      });

      const found = await model.findOne({
        where: { email: 'adriano@codenation.com.br'}
      });

      expect(found).toBeTruthy();

      done();
  });
});

describe('The API on /users')

describe('The API on /users/UserID EndPoint at PUT method shloud...', () => {

  beforeEach(async () => {
    await UserModel.create({
      "name": "Vinicius Ricci",
      "email": "viniciussricci@hotmail.com",
      "password": "123456"
    }); 
  });

  afterEach(async () => {
    await db.sequelize.query('TRUNCATE TABLE users;')
  });  

  it(`Return 200 as status code with sucess message and a validation of the update in database`, async () => {
    expect.assertions(3);

    const res = await request()
      .put('/users/1')
      .send({
        "name": "Vinicius Scudeler Ricci",
        "email": "viniciussricci@hotmail.com",
        "password": "123456"
      })

    expect(res.statusCode).toEqual(200);
    expect(res.body).toMatchObject({
      message: 'User updated sucessfully'
    });
    
    const found = model.findOne({
      where: {name: 'Vinicius Scudeler Ricci'}
    });

    expect(found).toBeTruthy();

    done();
  });

  it(`Return 404 as status code and error message if the user doesn't exists and couldn't be updated`, async () => {
    expect.assertions(2);

    const res = await request()
      .put('/users/2')
      .send({
        "name": "Vinicius Scudeler Ricci",
        "email": "viniciussricci@hotmail.com",
        "password": "123456"
      })
    
    expect(res.statusCode).toEqual(404);
    expect(res.body).toMatchObject({
      message: 'This user doesnt exists'
    });

    done(); 
  });

  // it('the fetch fails with an error', () => {
  //   expect.assertions(1);
  //   return fetchData().catch(e => expect(e).toMatch('error'));
  // });
});

describe('The API on /login EndPoint at GET method shloud...', () => {
  
  beforeEach(async () => {
    await UserModel.create({
      "name": "Vinicius Ricci",
      "email": "viniciussricci@hotmail.com",
      "password": "123456"
    });  
  });

  afterEach(async () => {
    await db.sequelize.query('TRUNCATE TABLE users;')
  });  

  it(`Return 200 as status code and a sucessfull login message`, async () => {
    expect.assertions(2);

    const res = await request()
      .post('/login')
      .send({
        "email": "viniciussricci@hotmail.com",
        "password": "123456"
      })

    expect(res.statusCode).toEqual(200);
    expect(Object.keys(res.body)).toMatchObject([
      'message',
      'token'
    ]);  

    done();
  });

  it(`Return 401 as status code and a Authentication failed message`, async () => {
    expect.assertions(2);

    const res = await request()
      .post('/login')
      .send({
        "email": "viniciussricci@hotmail.com",
        "password": "123456789"  
      })

    expect(res.statusCode).toEqual(401);
    expect(res.body).toMatchObject({
      message: 'Authentication failed'
    });
    
    done();
  });

  it(`Return 401 as status code and a does not exists user message`, async () => {
    expect.assertions(2);

    const res = await request()
    .post('/login')
    .send({
      "email": "thiago@hotmail.com",
      "password": "12345"  
    })

    expect(res.body).toEqual(401);
    expect(res.body).toMatchObject({
      message: 'User does not exists'
    });

    done();
  });
});



