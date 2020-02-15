import { Router } from 'express';

import UserController from './app/controllers/UserController';
import SessionController from './app/controllers/SessionController';
import ErrorController from './app/controllers/ErrorController';

import authMiddleware from './app/middlewares/auth';

const routes = new Router();

routes.post('/users', UserController.store);
routes.post('/session', SessionController.store);

// Todas as rotas abaixo desse middleware precisarão de autenticação
routes.use(authMiddleware);

routes.put('/users', UserController.update);

routes.get('/errors', ErrorController.searchError);

routes.post('/errors', ErrorController.remove);

routes.post('/errors', ErrorController.toArchive);

export default routes;
