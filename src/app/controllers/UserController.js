import jwt from 'jsonwebtoken';

import UserModel from '../models/User';
import authConfig from '../../config/auth';

class UserController {
  async store(req, res) {
    try {
      const { name, email, password } = req.body;

      // Check if this user already exists
      const found = await UserModel.findOne({
        where: { email }
      });
      if (found)
        return res.status(400).json({ message: 'This user already exists' });

      await UserModel.create({ name, email, password });
      
      return res.status(201).json({ message: 'User created sucessfully' });
    } catch (error) {
      return res.status(500).json({
        message: 'Creating user operation failed',
        error: error,
      });
    }
  }

  async show(req, res) {
    try {
      const { id } = req.params;
      const user = await UserModel.findOne({
          where: { id }
      });

      return res.status(200).json({ user });
    } catch (error) {
      return res.status(500).json({
        message: 'Geting user operation failed',
        error: error,
      });
    }
  }

  async update(req, res) {
    try {
      const { id } = req.params;
      const { name, email, password } = req.body;

      await UserModel.update(
        { name, email, password },
        {
          where: { id },
        }
      );

      return res.status(200).json({ message: 'User updated sucessfully' });
    } catch (error) {
      return res.status(500).json({
        message: 'Updating user operation failed',
        error: error,
      });
    }
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
        error: error,
      });
    }
  }

  async login(req, res) {
    try {
      const { email, password } = req.body;

      const user = await UserModel.findOne({
        where: { email },
      });
      if (!user)
        return res.status(401).json({ message: 'User does not exists' });

      if (!(await user.checkPassword(password))) {
        return res.status(401).json({ message: 'Authentication failed' });
      }

      const token = await jwt.sign(
        {
          id: user.id,
          email: user.email,
          name: user.name,
        },
        authConfig.secret,
        {
          expiresIn: authConfig.expiresIn,
        }
      );

      return res.status(200).json({ message: 'Sucessfull login', token });
    } catch (error) {
      return res.status(500).json({
        message: 'Login operation failed',
        error: error,
      });
    }
  }
}

export default new UserController();
