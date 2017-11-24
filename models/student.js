const Sequelize = require('sequelize');
const sequelize = require('../services/sequelize').getInstance();

const student = sequelize.define('student', {
  name: Sequelize.STRING,
  sex: Sequelize.BOOLEAN,
  score: Sequelize.INTEGER,
  age: Sequelize.INTEGER
});

module.exports = student;
