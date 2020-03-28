const jwt = require('jsonwebtoken');

const Yup = require('yup');
const UserModel = require('../models/User');
const authConfig = require('../../config/auth');

class UserController {
  async store(req, res) {
    const schema = Yup.object().shape({
      name: Yup.string().required(),
      email: Yup.string().required(),
      password: Yup.string()
        .required()
        .min(6),
    });

    if (!(await schema.isValid(req.body))) {
      return res.status(400).json({ error: 'Validation fails' });
    }

    const user = await UserModel.findOne({
      where: { email: req.body.email },
    });

    if (user) {
      return res.status(400).json({ error: 'User already exists' });
    }

    const { id, name, email } = await UserModel.create(req.body);

    const token = await jwt.sign(
      {
        id,
        email,
        name,
      },
      authConfig.secret
    );

    return res.status(200).json({ id, name, email, token });
  }

  async show(req, res) {
    try {
      const { id } = req.params;
      const user = await UserModel.findOne({
        where: { id },
      });

      return res.status(200).json({ user });
    } catch (error) {
      return res.status(500).json({
        message: 'Geting user operation failed',
        error,
      });
    }
  }

  async update(req, res) {
    const schema = Yup.object().shape({
      name: Yup.string(),
      email: Yup.string(),
      oldPassword: Yup.string().min(6),
      password: Yup.string()
        .min(6)
        .when('oldPassword', (password, field) =>
          password ? field.required().oneOf([Yup.ref('password')]) : field
        ),
    });

    if (!(await schema.isValid(req.body))) {
      return res.status(400).json({ error: 'Validation fails' });
    }

    const { email, oldPassword } = req.body;

    const user = await UserModel.findByPk(req.userId);

    if (email !== user.email) {
      const userExists = await UserModel.findOne({
        where: { email },
      });

      if (userExists) {
        return res.status(400).json({ error: 'User already exists' });
      }
    }

    if (oldPassword && !(await user.checkPassword(oldPassword))) {
      return res.status(401).json({ error: 'Password does not match' });
    }

    const { id, name } = await user.update(req.body);

    return res.status(200).json({ id, name, email });
  }

  async delete(req, res) {
    try {
      const { id } = req.params;

      await UserModel.destroy({
        where: { id },
      });

      return res.status(200).json({ message: 'User deleted sucessfully' });
    } catch (error) {
      return res.status(500).json({
        message: 'Deleting user operation failed',
        error,
      });
    }
  }
}

module.exports = new UserController();
