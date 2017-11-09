const express = require('express');
const students = require('./data');
const bodyParser = require('body-parser');
const hbs = require('hbs');
const methodOverride = require('method-override');
const path = require('path');
const mysql = require('mysql');
require('dotenv').config();

var connection = mysql.createConnection({
  host: process.env.DB_HOST,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_DATABASE
});

connection.connect();

const studentsTable = `create table if not exists students(
  id int auto_increment, 
  name varchar(100), 
  sex boolean, 
  score int, 
  age int, 
  primary key(id)
);`;

connection.query(studentsTable, function (err, rows, fields) {
  if (err) throw err;
  console.log('Students table created.');
});

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
  const list = `SELECT * FROM students;`;
  connection.query(list, function (err, rows, fields) {
    if (err) throw err;
    if (rows && rows.length > 0) {
      const students = rows;
      response.format({
        'text/html': () => response.render('students/index', {
          students: students
        }),
        'application/json': () => response.json({students: students})
      });
    } else {
      response.format({
        'text/html': () => response.render('students/index', {
          students: []
        }),
        'application/json': () => response.json({students: []})
      });
    }
  });
});

app.get('/students/form', (request, response) => {
  response.render('students/form');
});

app.get('/students/:id/update', (request, response) => {
  const updateStudentform = `SELECT * FROM students WHERE id='${request.params.id}';`;

  connection.query(updateStudentform, function (err, rows, fields) {
    if (err) throw err;
    if (rows && rows.length > 0) {
      const student = rows[0];

      response.format({
        'text/html': () => response.render('students/update', {
          student: student
        }),
        'application/json': () => response.json({student: student})
      });
    } else {
      response.format({
        'text/html': () => response.render('students/update', {
          student: []
        }),
        'application/json': () => response.json({student: []})
      });
    }
  });
});

app.get('/students/:id', (request, response) => {
  const show = `SELECT * FROM students WHERE id='${request.params.id}';`;
  connection.query(show, function (err, rows, fields) {
    if (err) throw err;
    if (rows && rows.length > 0) {
      const student = rows[0];

      response.format({
        'text/html': () => response.render('students/show', {
          student: student
        }),
        'application/json': () => response.json({student: student})
      });
    } else {
      response.format({
        'text/html': () => response.render('students/show', {
          student: []
        }),
        'application/json': () => response.json({student: []})
      });
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
  const createStudent = `insert into students (name, sex, score, age) values
  ('${request.body.name}', '${request.body.sex}', '${request.body.score}', '${request.body.age}');`;

  connection.query(createStudent, function (err, rows, fields) {
    if (err) throw err;
    response.format({
      'text/html': () => response.redirect('/students'),
      'application/json': () => response.redirect('/students')
    });
  });
});

app.put('/students/:id', (request, response) => {
  const changeStudent = `update students set name='${request.body.name}', sex='${request.body.sex}', 
  score='${request.body.score}', age='${request.body.age}' where id='${request.params.id}';`;

  connection.query(changeStudent, function (err, rows, fields) {
    let paramsID = request.params.id;
    if (err) throw err;
    response.format({
      'text/html': () => response.redirect('/students/' + paramsID),
      'application/json': () => response.redirect('/students/' + paramsID)
    });
  });
});

app.delete('/students/:id', (request, response) => {
  const deleteStudent = `DELETE FROM students WHERE id='${request.params.id}';`;
  connection.query(deleteStudent, function (err, rows, fields) {
    if (err) throw err;
    response.format({
      'text/html': () => response.redirect('/students'),
      'application/json': () => response.redirect('/students')
    });
  });
});

app.listen(3000, () => console.log('Server is running on port 3000'));
