const Model = require('./model');
const Student = new Model();
const express = require('express');
const students = require('./data');
const bodyParser = require('body-parser');
const hbs = require('hbs');
const methodOverride = require('method-override');
const path = require('path');

const app = express();
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());
app.use(methodOverride('_method'));

Student.connect();
Student.init();

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

app.get('/students/count', (request, response) => {
  Student.count(function (err, students) {
    if (err) {
      response.render('errors/500', {error: err});
    } else {
      response.json({count: students});
    }
  });
});

app.get('/students', (request, response) => {
  Student.findAll(function (err, students) {
    if (err) {
      response.render('errors/500', {error: err});
    } else {
      response.render('students/index', {students: students});
    }
  });
});

app.get('/students/form', (request, response) => {
  response.render('students/form');
});

app.get('/students/:id/update', (request, response) => {
  Student.findOne({id: request.params.id}, function (err, student) {
    if (err) {
      response.render('errors/500', {error: err});
    } else {
      response.render('students/update', {student: student});
    }
  });
});

app.get('/students/:id', (request, response) => {
  Student.findOne({id: request.params.id}, function (err, student) {
    if (err) {
      response.render('errors/500', {error: err});
    } else {
      response.render('students/show', {student: student});
    }
  });
});

app.get('/students', function (request, response) {
  response.format({
    'text/html': function () {
      response.render('students/form', {
        student: students
      });
    },
    'applicaton/json': function () {
      response.json({students: students});
    }
  });
});

app.post('/students', function (request, response) {
  Student.create(request.body, function (err, student) {
    if (err) {
      response.render('errors/500', {error: err});
    } else {
      response.redirect('/students/');
    }
  });
});

app.put('/students/:id', (request, response) => {
  Student.update(request.params.id, request.body, function (err, student) {
    if (err) {
      response.render('errors/500', {error: err});
    } else {
      response.redirect('/students/');
    }
  });
});

app.delete('/students/:id', (request, response) => {
  Student.delete(request.params.id, function (err, student) {
    if (err) {
      response.render('errors/500', {error: err});
    } else {
      response.redirect('/students/');
    }
  });
});

app.listen(3000, () => console.log('Server is running on port 3000'));
