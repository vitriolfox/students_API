const express = require('express');
const bodyParser = require('body-parser');
const hbs = require('hbs');
const methodOverride = require('method-override');
const path = require('path');

require('dotenv').config();

const Sequelize = require('sequelize');
const sequelize = new Sequelize(process.env.DB_DATABASE, process.env.DB_USER, process.env.DB_PASSWORD, {host: 'localhost', dialect: 'mysql'});
const student = sequelize.define('student', {
  name: Sequelize.STRING,
  sex: Sequelize.BOOLEAN,
  score: Sequelize.INTEGER,
  age: Sequelize.INTEGER
});

const router = require('./routes');

const app = express();
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());
app.use(methodOverride('_method'));

app.set('views', './views/');
app.set('view engine', 'hbs');
app.engine('hbs', require('hbs').__express);

hbs.registerHelper('currentPage', (pages, pageNumber, options) => {
  if (pages === pageNumber) {
    return options.fn(pageNumber);
  }
  return options.inverse(this);
});
hbs.registerPartials(path.join(__dirname, '/views/partials'));
app.use('/', router);

sequelize.sync()
.then(() => app.listen(3000));

module.exports = student;
