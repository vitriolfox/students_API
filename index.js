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

// handlebars
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

app.get('/students', (request, response) => {
  let limit = parseInt(request.query.limit) || 5;
  let pageFrom;
  let pageEnd;
  let pageNumber = parseInt(request.query.page) || 1;
  let next = pageNumber + 1;
  let prev = pageNumber - 1;
  let firstPage = pageNumber > 1;
  let lastPage = pageNumber < students.length / limit;

  let pages = [];
  let n = 1;
  for (let i = 0; i < students.length / limit; i++) {
    pages[i] = n;
    n++;
  }

  if (parseInt(request.query.page) <= 1 || request.query.page === undefined) {
    pageFrom = 0;
    pageEnd = limit;
  } else {
    pageFrom = (parseInt(request.query.page) - 1) * limit;
    pageEnd = pageFrom + limit;
  }
  let studentList = students.slice(pageFrom, pageEnd);
  response.format({
    'text/html': () => response.render('students/index', {
      students: studentList,
      pageNumber: pageNumber,
      next: next,
      prev: prev,
      firstPage: firstPage,
      lastPage: lastPage,
      pages: pages

    }),
    'application/json': () => response.json({students: studentList})
  });
});

app.get('/students/form', (request, response) => {
  response.render('students/form');
});

app.get('/students/:name/update', (request, response) => {
  let student = students.find(student => student.name === request.params.name);
  response.render('students/update', {student: student});
});

app.get('/students/:name', (request, response) => {
  let student = students.find(student => student.name === request.params.name);
  response.format({
    'text/html': () => response.render('students/show', {student: student}),
    'application/json': () => { response.json({student: student}); }
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
  const newStudent = {
    name: request.body.name,
    sex: request.body.sex,
    score: request.body.score,
    age: request.body.age
  };

  students.push(newStudent);

  response.format({
    'text/html': function () {
      response.redirect('/students');
    },
    'application/json': function () {
      response.json({student: newStudent});
    }
  });
});

app.put('/students/:name', (request, response) => {
  const updateStudent = {
    name: request.body.name,
    sex: request.body.sex,
    score: request.body.score,
    age: request.body.age
  };
  let indexOfUpdateStudent = students.indexOf(students.find(student => student.name === request.params.name));
  students.splice(indexOfUpdateStudent, 1);
  students.splice(indexOfUpdateStudent, 0, updateStudent);

  response.format({
    'text/html': function () {
      response.redirect('/students/' + updateStudent.name);
    },
    'application/json': function () {
      response.json({student: updateStudent});
    }
  });
});

app.delete('/students/:name', (request, response) => {
  students.splice(students.indexOf(students.find(student => student.name === request.params.name)), 1);
  response.format({
    'text/html': function () {
      response.redirect('/students/');
    },
    'application/json': function () {
      response.json({students: students});
    }
  });
});

app.listen(3000, () => console.log('Server is running on port 3000'));
