require('dotenv').config();
const express = require('express');
const bodyParser = require('body-parser');
const hbs = require('hbs');
const methodOverride = require('method-override');
const path = require('path');
const sequelize = require('./services/sequelize');

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

sequelize.init()
.then(() => app.listen(3000))
.catch(console.log);
