const express = require('express');
const { createJob, getAllJobs, getJob, searchJobsText, updateJob, deleteJob } = require('../controllers/jobController');
const authenticateJWT = require('../middleware/auth');

const router = express.Router();

router.get('/', getAllJobs);
router.get('/search', searchJobsText);
router.get('/:id', getJob);
router.post('/', authenticateJWT, createJob);
router.put('/:id', authenticateJWT, updateJob);
router.delete('/:id', authenticateJWT, deleteJob);

module.exports = router;
