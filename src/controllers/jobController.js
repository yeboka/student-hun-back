const Job = require('../models/Job');
const {logger} = require("sequelize/lib/utils/logger");

// Create Job
const createJob = async (req, res) => {
    try {
        const job = await Job.create({ ...req.body, userId: req.user.id });
        res.status(201).json(job);
    } catch (err) {
        res.status(500).json({ message: `Ошибка при создании: ${err.message}` });
    }
};

// Get all jobs
const getAllJobs = async (req, res) => {
    try {
        const jobs = await Job.findAll({ order: [['createdAt', 'DESC']] });
        res.json(jobs);
    } catch (err) {
        res.status(500).json({ message: 'Ошибка при получении вакансий' });
    }
};

// Get single job
const getJob = async (req, res) => {
    try {
        const job = await Job.findByPk(req.params.id);
        if (!job) return res.status(404).json({ message: 'Вакансия не найдена' });
        res.json(job);
    } catch (err) {
        res.status(500).json({ message: 'Ошибка при получении вакансии' });
    }
};

const searchJobsText = async (req, res) => {
    const { query } = req.query;
    console.log("search")
    try {
        // Если нет запроса — вернём первые 12 вакансий
        if (!query || query.trim() === "") {
            const jobs = await Job.findAll({
                order: [['createdAt', 'DESC']],
                limit: 12,
            });
            return res.json(jobs);
        }

        const words = query.toLowerCase().split(/\s+/);
        const allJobs = await Job.findAll();

        const filtered = allJobs.filter(job => {
            const text = `${job.title} ${job.description} ${job.requirements} ${job.schedule} ${job.company_name}`.toLowerCase();
            return words.some(word => text.includes(word));
        });

        res.json(filtered);
    } catch (err) {
        console.error("Ошибка при поиске:", err); // лог в терминал
        res.status(500).json({ message: `Ошибка при поиске: ${err.message}` });
    }
};


// Update job
const updateJob = async (req, res) => {
    try {
        const job = await Job.findByPk(req.params.id);
        if (!job || job.userId !== req.user.id)
            return res.status(403).json({ message: 'Нет доступа' });

        await job.update(req.body);
        res.json({ message: 'Вакансия обновлена', job });
    } catch (err) {
        res.status(500).json({ message: 'Ошибка при обновлении' });
    }
};

// Delete job
const deleteJob = async (req, res) => {
    try {
        const job = await Job.findByPk(req.params.id);
        if (!job || job.userId !== req.user.id)
            return res.status(403).json({ message: 'Нет доступа' });

        await job.destroy();
        res.json({ message: 'Вакансия удалена' });
    } catch (err) {
        res.status(500).json({ message: `Ошибка при удалении ${err.message}` });
    }
};

module.exports = { createJob, getAllJobs, getJob, searchJobsText, updateJob, deleteJob };
