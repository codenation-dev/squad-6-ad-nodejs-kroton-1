const { Router } = require('express');
const swaggerUi = require('swagger-ui-express');
const swaggerDoc = require('./swagger.json');

const UserController = require('./app/controllers/UserController');
const SessionController = require('./app/controllers/SessionController');
const LogController = require('./app/controllers/LogController');

const authMiddleware = require('./app/middlewares/auth');

const routes = new Router();

routes.use('/api-docs', swaggerUi.serve);
routes.use('/api-docs', swaggerUi.setup(swaggerDoc));

routes.post('/users', UserController.store);
routes.post('/session', SessionController.store);

// Todas as rotas abaixo desse middleware precisarão de autenticação
routes.use(authMiddleware);

routes.get('/users/:id', UserController.show);
routes.put('/users', UserController.update);
routes.delete('/users/:id', UserController.delete);

routes.post('/logs', LogController.saveLog);

routes.get('/logs', LogController.searchLog);

routes.get('/logs/:id', LogController.getLogById);

routes.delete('/logs/:id', LogController.remove);

routes.put('/logs/:id', LogController.toArchive);

module.exports = routes;
