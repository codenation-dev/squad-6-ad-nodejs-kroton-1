const supertest = require('supertest');
const app = require('../src/app');
const UserModel =  require('../src/app/models/User');
const request = supertest(app);

let login = {}; 

beforeAll(async () => {
  await request
    .post('/users')
    .send({
      name: 'Vinicius',
      email: 'vinicius@codenation.com.br',
      password: '1234567'
    })
   
  const objLogin = await request.post('/login').send({
    email: 'vinicius@codenation.com.br',
    password: '1234567',
  });

  if (objLogin) {
    login = objLogin.body.token;
  };

});

afterAll(async () => {
 await UserModel.destroy({ truncate: true });
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

    const res = await request
      .post('/users')
      .send({
        "name": "Vinicius Ricci",
        "email": "viniciussricci@hotmail.com",
        "password": "123456"
      })

    expect(res.statusCode).toBe(400);
    expect(res.body).toMatchObject({
      message: 'This user already exists'
    });
  });

  it(`Return 201 as status code with a message of sucess and validation of the insertion in database`, async () => {
    expect.assertions(3);
    
    const res = await request
      .post('/users')
      .send({
        "name": "Adriano codenation",
        "email": "adriano@codenation.com.br",
        "password": "1234567"
      })

      expect(res.statusCode).toBe(201);
      expect(res.body).toMatchObject({
        message: 'User created sucessfully'  
      });

      const found = await UserModel.findOne({
        where: { email: 'adriano@codenation.com.br'}
      });

      expect(found).toBeTruthy();
  });

  it(`Return 500 as status code...`, async () => {
    expect.assertions(2)

    const res = await request
      .post('/users')
      .send({
        "name": "Vinicius Scudeler",
        "email": "vinicius@codenation.com",
        "password": ""
      })

    expect(res.statusCode).toBe(500);
    expect(Object.keys(res.body)).toMatchObject([
      'message',
      'error'
    ]);
  });
});

describe('The API on /users/UserID Endpoint at GET method should...', () => {
  let user;

  beforeEach(async () => {
    await UserModel.create({
      "name": "Vinicius Ricci",
      "email": "viniciussricci@hotmail.com",
      "password": "123456"
    }); 

    user = await UserModel.findOne({
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

    const res = await request
      .get(`/users/${user.id}`)
      .set('authorization', `Bearer ${login}`)
  
    expect(res.statusCode).toBe(200);
    expect(Object.keys(res.body)).toMatchObject([
      "user"
    ]); 
  });

  it(`Return 500 as status code...`, async () => {
    expect.assertions(2)

    const res = await request
      .get('/users/null')
      .set('authorization', `Bearer ${login}`)

    expect(res.statusCode).toBe(500);
    expect(Object.keys(res.body)).toMatchObject([
      'message',
      'error'
    ]);
  });
});

describe('The API on /users/UserID EndPoint at PUT method should...', () => {
  let user;

  beforeEach(async () => {
    await UserModel.create({
      "name": "Vinicius Ricci",
      "email": "viniciussricci@hotmail.com",
      "password": "123456"
    }); 

    user = await UserModel.findOne({
      where: { email: 'viniciussricci@hotmail.com' }
    });

    
  });

  afterEach(async () => {
    await UserModel.destroy({
      where: { email: 'viniciussricci@hotmail.com'}
    })
  });  

  it(`Return 200 as status code with sucess message and a validation of the update in database`, async () => {
    expect.assertions(3);

    const res = await request
      .put(`/users/${user.id}`)
      .set('authorization', `Bearer ${login}`)
      .send({
        "name": "Matheus Oliveira Pinhati",
        "email": "viniciussricci@hotmail.com",
        "password": "123456"
      })

    expect(res.statusCode).toBe(200);
    expect(res.body).toMatchObject({
      message: 'User updated sucessfully'
    });
    
    const found = await UserModel.findOne({
      where: {name: 'Matheus Oliveira Pinhati'}
    });

    expect(found).toBeTruthy();
  });

  it(`Return 500 as status code and error message if the user doesn't exists and couldn't be updated`, async () => {
    expect.assertions(2);

    const res = await request
      .put('/users/null')
      .set('Authorization', `Bearer ${login}`)
      .send({
        "name": "Vinicius Scudeler Ricci",
        "email": "viniciussricci@hotmail.com",
        "password": "123456"
      })
    
    expect(res.statusCode).toBe(500);
    expect(Object.keys(res.body)).toMatchObject([
      'message',
      'error'
    ]);
  });
});

describe('The API on /users/UserID Endpoint at DELETE method should...', () => {
  let user;

  beforeEach(async () => {
    await UserModel.create({
      "name": "Vinicius Ricci",
      "email": "viniciussricci@hotmail.com",
      "password": "123456"
    }); 

    user = await UserModel.findOne({
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

    const res = await request
      .delete(`/users/${user.id}`)
      .set('authorization', `Bearer ${login}`)
  
    expect(res.statusCode).toBe(200);
    expect(res.body).toMatchObject({
      message: 'User deleted sucessfully'
    });
  });

  it(`Return 500 as status code...`, async () => {
    expect.assertions(2)

    const res = await request
      .delete('/users/null')
      .set('authorization', `Bearer ${login}`)


    expect(res.statusCode).toBe(500);
    expect(Object.keys(res.body)).toMatchObject([
      'message',
      'error'
    ]);
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

    const res = await request
      .post('/login')
      .send({
        "email": "viniciussricci@hotmail.com",
        "password": "123456"
      })

    expect(res.statusCode).toBe(200);
    expect(Object.keys(res.body)).toMatchObject([
      'message',
      'token'
    ]);  
  });

  it(`Return 401 as status code and a Authentication failed message`, async () => {
    expect.assertions(2);

    const res = await request
      .post('/login')
      .send({
        "email": "viniciussricci@hotmail.com",
        "password": "123456789"  
      })

    expect(res.statusCode).toBe(401);
    expect(res.body).toMatchObject({
      message: 'Authentication failed'
    });
  });

  it(`Return 401 as status code and a does not exists user message`, async () => {
    expect.assertions(2);

    const res = await request
    .post('/login')
    .send({
      "email": "thiago@hotmail.com",
      "password": "12345"  
    })

    expect(res.statusCode).toBe(401);
    expect(res.body).toMatchObject({
      message: 'User does not exists'
    });
  });

  it(`Return 500 as status code...`, async () => {
    expect.assertions(2)

    const res = await request
    .post('/login')
    .send({
      "emaiil": "thiago@hotmail.com", 
      "password": "123456"
    })

    expect(res.statusCode).toBe(500);
    expect(Object.keys(res.body)).toMatchObject([
      'message',
      'error'
    ]);
  });
});



