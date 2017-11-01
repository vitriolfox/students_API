const express = require('express');
const students = require('./data');
const bodyParser = require('body-parser');

const app = express();
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

app.get('/students', (request, response) => {
  response.json({students: students});
});

app.get('/students/:name', (request, response) => {
  let student = students.find(student => student.name === request.params.name);
  response.json({student: student});
});

app.post('/students', (request, response) => {
  const newStudent = {
    name: request.body.name,
    sex: request.body.sex,
    score: request.body.score,
    age: request.body.age
  };
  students.push(newStudent);
  response.json({student: newStudent});
});

// update adott tömbelemet frissít név szerint
// delete, post keveréke
// handlebars, templatenek, lapozás
app.post('/students/:name', (request, response) => {
  const updateStudent = {
    name: request.body.name,
    sex: request.body.sex,
    score: request.body.score,
    age: request.body.age
  };
  let indexOfUpdateStudent = students.indexOf(students.find(student => student.name === request.params.name));
  students.splice(indexOfUpdateStudent, 1);
  students.splice(indexOfUpdateStudent, 0, updateStudent);
  response.json({student: students});
});

app.delete('/students/:name', (request, response) => {
  students.splice(students.indexOf(students.find(student => student.name === request.params.name)), 1);
  response.json({students: students});
});

app.listen(3000, () => {
  console.log('Server is running on port 3000');
});
