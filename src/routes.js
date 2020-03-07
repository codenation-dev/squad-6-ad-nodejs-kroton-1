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

routes.get('/logs/:id', LogController.getLogById);

routes.delete('/logs', LogController.remove);

routes.put('/logs', LogController.toArchive);

export default routes;
