const express = require('express');
const {
    createJob,
    getAllJobs,
    getJob,
    searchJobsText,
    updateJob,
    deleteJob,
    getUserJobs,
    getJobsWithApplications,
    getApplicantsForJob
} = require('../controllers/jobController');
const authenticateJWT = require('../middleware/auth');

const router = express.Router();

router.get('/', getAllJobs);
router.get('/search', searchJobsText);
router.get('/user', authenticateJWT, getUserJobs);
router.get('/my-applications', authenticateJWT, getJobsWithApplications);
router.get('/:jobId/applicants', authenticateJWT, getApplicantsForJob);
router.get('/:id', getJob);
router.post('/', authenticateJWT, createJob);
router.put('/:id', authenticateJWT, updateJob);
router.delete('/:id', authenticateJWT, deleteJob);

module.exports = router;
