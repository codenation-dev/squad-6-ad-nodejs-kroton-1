// TODO implementar as funcionalidades de cada endpoint aqui. Criar o Model para fazer as consultas no banco.

class ErrorController {
  async searchError(req, res) {
    return res.json({ message: 'Search error' });
  }

  async remove(req, res) {
    return res.json({ message: 'remoce error' });
  }

  async toArchive(req, res) {
    return res.json({ message: 'archieve error' });
  }
}

export default new ErrorController();
