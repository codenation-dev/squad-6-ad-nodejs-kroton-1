const supertest = require('supertest');
const app = require('../src/app');

const request = supertest(app);
const db = require('../src/database');
const { User, Log } = require('../src/app/models');
