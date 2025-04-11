// controllers/studentController.js
const User = require('../models/User');

const searchStudents = async (req, res) => {
    const { query } = req.query;

    try {
        const baseWhere = { is_active_resume: true };
        const users = await User.findAll({ where: baseWhere });

        if (!query || query.trim() === '') {
            // Вернуть первые 12
            return res.json(users.slice(0, 12));
        }

        const words = query.toLowerCase().split(/\s+/);
        const filtered = users.filter(user => {
            const text = `${user.first_name} ${user.last_name} ${user.description} ${user.skills} ${user.available_time}`.toLowerCase();
            return words.some(word => text.includes(word));
        });

        res.json(filtered);
    } catch (err) {
        console.error("Ошибка при поиске студентов:", err);
        res.status(500).json({ message: `Ошибка при поиске студентов: ${err.message}` });
    }
};

module.exports = { searchStudents };
