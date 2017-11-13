const mysql = require('mysql');
require('dotenv').config();

class Model {
  constructor () {
    this.connection = null;
  }

  connect () {
    this.connection = mysql.createConnection({
      host: process.env.DB_HOST,
      user: process.env.DB_USER,
      password: process.env.DB_PASSWORD,
      database: process.env.DB_DATABASE
    });
    this.connection.connect();
  }

  init () {
    const studentsTable = `create table if not exists students(
      id int auto_increment, 
      name varchar(100), 
      sex boolean, 
      score int, 
      age int, 
      primary key(id)
    );`;

    this.connection.query(studentsTable, function (err, rows, fields) {
      if (err) throw err;
      console.log('Students table created.');
    });
  }

  findAll (callback) {
    const list = `SELECT * FROM students;`;
    this.connection.query(list, function (err, rows, fields) {
      if (err) {
        return callback(err);
      }
      if (rows && rows.length > 0) {
        return callback(null, rows);
      } else {
        return callback(null, []);
      }
    });
  }

  findOne (queryObject, callback) {
    let key = Object.keys(queryObject)[0];
    let value = queryObject[key];
    const findStudent = `SELECT * FROM students WHERE ${key}='${value}';`;
    this.connection.query(findStudent, function (err, rows, fields) {
      const student = rows[0];
      if (err) {
        return callback(err);
      }
      if (rows && rows.length > 0) {
        return callback(null, student);
      } else {
        return callback(null, []);
      }
    });
  }

  create (queryObject, callback) {
    const createStudent = `insert into students (name, sex, score, age) values
    ('${queryObject.name}', '${queryObject.sex}', '${queryObject.score}', '${queryObject.age}');`;

    this.connection.query(createStudent, function (err, rows, fields) {
      if (err) {
        return callback(err);
      }
      if (rows && rows.length > 0) {
        return callback(null, rows);
      } else {
        return callback(null, []);
      }
    });
  }

  delete (id, callback) {
    const deleteStudent = `DELETE FROM students WHERE id='${id}';`;
    this.connection.query(deleteStudent, function (err, rows, fields) {
      const student = rows[0];
      if (err) {
        return callback(err);
      }
      if (rows && rows.length > 0) {
        return callback(null, student);
      } else {
        return callback(null, []);
      }
    });
  }

  update (id, queryObject, callback) {
    const changeStudent = `update students set name='${queryObject.name}', sex='${queryObject.sex}', 
    score='${queryObject.score}', age='${queryObject.age}' where id='${id}';`;

    this.connection.query(changeStudent, function (err, rows, fields) {
      if (err) {
        return callback(err);
      }
      if (rows && rows.length > 0) {
        return callback(null, rows);
      } else {
        return callback(null, []);
      }
    });
  }

  count (callback) {
    const countStudents = `SELECT COUNT(id) FROM students;`;

    this.connection.query(countStudents, function (err, rows, fields) {
      if (err) {
        return callback(err);
      }
      if (rows && rows.length > 0) {
        return callback(null, rows[0]['COUNT(id)']);
      } else {
        return callback(null, []);
      }
    });
  }

  /* findAndCount */
}

module.exports = Model;
