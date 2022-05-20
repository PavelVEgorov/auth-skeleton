const {
  Model,
} = require('sequelize');

module.exports = (sequelize, DataTypes) => {
  class User extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
    }
  }
  User.init({
    username: {
      type: DataTypes.STRING,
      allowNull: false,
      len: [4, 20],
      is: /^[A-Z]\w+$/i,
    },
    password: {
      type: DataTypes.STRING,
      allowNull: false,
      len: [8, 20],
    },
    email: {
      type: DataTypes.STRING,
      allowNull: false,
      len: [3, 30],
      is: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
    },
  }, {
    sequelize,
    modelName: 'User',
  });
  return User;
};
