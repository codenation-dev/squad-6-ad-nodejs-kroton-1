import { Router } from 'express';

import UserController from './app/controllers/UserController';
import SessionController from './app/controllers/SessionController';
import LogController from './app/controllers/LogController';

import authMiddleware from './app/middlewares/auth';

const routes = new Router();

routes.post('/users', UserController.store);
routes.post('/session', SessionController.store);

// Todas as rotas abaixo desse middleware precisarão de autenticação
routes.use(authMiddleware);

routes.put('/users', UserController.update);

routes.get('/logs', LogController.searchLog);

routes.post('/logs', LogController.remove);

routes.post('/logs', LogController.toArchive);

export default routes;
