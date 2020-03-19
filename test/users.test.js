const supertest = require('supertest');
const app = require('../src/app');
const request = supertest(app);
const db = require('../src/database');
const model = require('../models/User');

const login;

beforeAll(async () => {
  await request()
    .post('/users')
    .send({
      "name": "Vinicius",
      "email": "vinicius@codenation.com.br",
      "password": "1234567"
    })

  login = await request()
    .post('/login')
    .send({
      "email": "vinicius@codenation.com.br",
      "password": "1234567"
    })    
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
    await UserModel.destroy({
      where: { email: 'viniciussricci@hotmail.com' }  
    });
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

describe('The API on /users/UserID Endpoint at GET method should...', () => {
  const user;

  beforeEach(async () => {
    await UserModel.create({
      "name": "Vinicius Ricci",
      "email": "viniciussricci@hotmail.com",
      "password": "123456"
    }); 

    user = UserModel.findOne({
      where: { email: 'viniciussricci@hotmail.com' }
    })
  });

  afterEach(async () => {
    await UserModel.destroy({
      where: { email: 'viniciussricci@hotmail.com'}
    })
  }); 

  it(`Return 200 as status code with the user data`, async () => {
    expect.assertions(2)

    const res = await request()
      .get(`/users/${user.id}`)
      .set('authorization', login.token)
  
    expect(res.statusCode).toEqual(200);
    expect(res.body).toMatchObject({
      "name": "Vinicius Ricci",
      "email": "viniciussricci@hotmail.com",
      "password": "123456"
    }); 
  
    done();
  });

  it(`Return 505 as status code...`, async () => {
    expect.assertions(2)

    const res = await request()
      .get('/users/65')
      .set('authorization', login.token)

    expect(res.statusCode).toEqual();
    expect(res.body).toMatchObject({

    });
    
    done();
  });
});

describe('The API on /users/UserID EndPoint at PUT method should...', () => {
  const user;

  beforeEach(async () => {
    await UserModel.create({
      "name": "Vinicius Ricci",
      "email": "viniciussricci@hotmail.com",
      "password": "123456"
    }); 

    user = UserModel.findOne({
      where: { email: 'viniciussricci@hotmail.com' }
    })
  });

  afterEach(async () => {
    await UserModel.destroy({
      where: { email: 'viniciussricci@hotmail.com'}
    })
  });  

  it(`Return 200 as status code with sucess message and a validation of the update in database`, async () => {
    expect.assertions(3);

    const res = await request()
      .put(`/users/${user.id}`)
      .set('authorization', login.token)
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
      .put('/users/15')
      .set('Authorization', login.token)
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
});

describe('The API on /users/UserID Endpoint at DELETE method should...', () => {
  const user;

  beforeEach(async () => {
    await UserModel.create({
      "name": "Vinicius Ricci",
      "email": "viniciussricci@hotmail.com",
      "password": "123456"
    }); 

    user = UserModel.findOne({
      where: { email: 'viniciussricci@hotmail.com' }
    })
  });

  afterEach(async () => {
    await UserModel.destroy({
      where: { email: 'viniciussricci@hotmail.com'}
    })
  }); 

  it(`Return 200 as status code with the success message`, async () => {
    expect.assertions(2)

    const res = await request()
      .delete(`/users/${user.id}`)
      .set('authorization', login.token)
  
    expect(res.statusCode).toEqual(200);
    expect(res.body).toMatchObject({
      message: 'User deleted sucessfully'
    });
    
    done();
  });

  it(`Return 505 as status code...`, async () => {
    expect.assertions(2)

    const res = await request()
      .delete('/users/65')
      .set('authorization', login.token)


    expect(res.statusCode).toEqual();
    expect(res.body).toMatchObject({

    });
    
    done();
  });
});

describe('The API on /login EndPoint at POST method shloud...', () => {
  
  beforeEach(async () => {
    await UserModel.create({
      "name": "Vinicius Ricci",
      "email": "viniciussricci@hotmail.com",
      "password": "123456"
    });  
  });

  afterEach(async () => {
    await UserModel.destroy({
      where: { email: 'viniciussricci@hotmail.com' }  
    });
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



