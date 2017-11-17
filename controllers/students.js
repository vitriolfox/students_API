//const Model = require('../models/student');
const Student = require('../index');

/* Student.connect((err, message) => {
  if (err) {
    console.log(err);
  } else {
    console.log(message);
  }
});

Student.init((err, message) => {
  if (err) {
    console.log(err);
  } else {
    console.log(message);
  }
}); */

module.exports = {
  index: (request, response) => {
    Student.findAll((err, students) => {
      if (err) {
        response.render('errors/500', {error: err});
      } else {
        response.render('students/index', {students: students});
      }
    });
  },

  show: (request, response) => {
    Student.findOne({id: request.params.id}, (err, student) => {
      if (err) {
        response.render('errors/500', {error: err});
      } else {
        response.render('students/show', {student: student});
      }
    });
  },

  new: (request, response) => {
    response.render('students/new');
  },

  create: (request, response) => {
    Student.create(request.body, (err, student) => {
      if (err) {
        response.render('errors/500', {error: err});
      } else {
        response.redirect('/students/');
      }
    });
  },

  edit: (request, response) => {
    Student.findOne({id: request.params.id}, (err, student) => {
      if (err) {
        response.render('errors/500', {error: err});
      } else {
        response.render('students/edit', {student: student});
      }
    });
  },

  update: (request, response) => {
    Student.update(request.params.id, request.body, (err, student) => {
      if (err) {
        response.render('errors/500', {error: err});
      } else {
        response.redirect('/students/');
      }
    });
  },

  delete: (request, response) => {
    Student.delete(request.params.id, (err, student) => {
      if (err) {
        response.render('errors/500', {error: err});
      } else {
        response.redirect('/students/');
      }
    });
  },

  count: (request, response) => {
    Student.count((err, students) => {
      if (err) {
        response.render('errors/500', {error: err});
      } else {
        response.json({count: students});
      }
    });
  }
};
