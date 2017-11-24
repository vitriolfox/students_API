const Student = require('../models/student');

module.exports = {
  index: (request, response) => {
    Student.findAll()
      .then((students) => response.render('students/index', {students: students}))
      .catch((err) => response.render('errors/500', {error: err}));
  },

  show: (request, response) => {
    Student.findById(request.params.id)
      .then((student) => response.render('students/show', {student: student}))
      .catch((err) => response.render('errors/500', {error: err}));
  },

  new: (request, response) => {
    response.render('students/new');
  },

  create: (request, response) => {
    Student.create(request.body)
      .then(() => response.redirect('/students/'))
      .catch((err) => response.render('errors/500', {error: err}));
  },

  edit: (request, response) => {
    Student.findById(request.params.id)
      .then((student) => response.render('students/edit', {student: student}))
      .catch((err) => response.render('errors/500', {error: err}));
  },

  update: (request, response) => {
    Student.findById(request.params.id)
      .then((student) => student.update(request.body))
      .then(() => response.redirect('/students/'))
      .catch((err) => response.render('errors/500', {error: err}));
  },

  delete: (request, response) => {
    console.log({id: request.params.id});
    Student.findById(request.params.id)
      .then((student) => student.destroy())
      .then(() => response.redirect('/students/'))
      .catch((err) => response.render('errors/500', {error: err}));
  },

  count: (request, response) => {
    Student.count()
      .then((students) => response.json({count: students}))
      .catch((err) => response.render('errors/500', {error: err}));
  }
};
