// routes/students.js
const express = require('express');
const { searchStudents } = require('../controllers/studentController');

const router = express.Router();

router.get('/search', searchStudents);

module.exports = router;
