const studentsControllers = require('./controllers/students');
const express = require('express');

const router = express.Router();

router.get('/students', studentsControllers.index);

router.get('/students/new', studentsControllers.new);

router.get('/students/:id', studentsControllers.show);

router.post('/students', studentsControllers.create);

router.get('/students/:id/edit', studentsControllers.edit);

router.put('/students/:id', studentsControllers.update);

router.delete('/students/:id', studentsControllers.delete);

router.get('/students/count', studentsControllers.count);

module.exports = router;
