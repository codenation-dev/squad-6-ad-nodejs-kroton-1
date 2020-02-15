// TODO implementar as funcionalidades de cada endpoint aqui. Criar o Model para fazer as consultas no banco.

class UserController {
  async store(req, res) {
    return res.json({ message: 'create user' });
  }

  async update(req, res) {
    return res.json({ message: 'update user' });
  }
}

export default new UserController();
