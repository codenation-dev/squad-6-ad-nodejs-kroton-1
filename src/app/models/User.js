const Sequelize = require('sequelize');
const { Model } = require('sequelize');
const bcrypt = require('bcryptjs');

class User extends Model {
  static init(sequelize) {
    super.init(
      {
        name: {
         type: Sequelize.STRING,
         allowNull: false,
         validate: {
           notEmpty: true,
           notNull: true,
         },
        },  
        email: { 
          type: Sequelize.STRING,
          allowNull: false,
          validate: {
            notEmpty: true,
            notNull: true,
          },
        },
        password: {
          type: Sequelize.VIRTUAL,
          allowNull: false,
          validate: {
            notEmpty: true,
            notNull: true,
          },
        },  
        password_hash: Sequelize.STRING,
      },
      {
        sequelize,
      }
    );

    this.addHook('beforeSave', async user => {
      if (user.password) {
        user.password_hash = await bcrypt.hash(user.password, 8);
      }
    });
    return this;
  }

  checkPassword(password) {
    return bcrypt.compare(password, this.password_hash);
  }
}

module.exports = User;
