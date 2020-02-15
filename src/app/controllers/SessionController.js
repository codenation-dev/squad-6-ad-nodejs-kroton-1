class SessionController {
  async store(req, res) {
    return res.json({ message: 'create session' });
  }
}

export default new SessionController();
