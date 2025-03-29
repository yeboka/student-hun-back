// server.js

const express = require('express');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const dotenv = require('dotenv');
const cors = require('cors');
const User = require('./models/User');
const sequelize = require('./config/database');

dotenv.config();

const app = express();

// Middleware
app.use(cors());
app.use(express.json());

// Подключение к базе данных и синхронизация моделей
sequelize.sync()
    .then(() => {
        console.log("Database connected and models synchronized.");
    })
    .catch((err) => {
        console.log("Error connecting to the database: ", err);
    });

// Регистрация и логика пользователя
const registerUser = async (req, res) => {
    const { first_name, last_name, email, password } = req.body;

    try {
        // Проверка, существует ли пользователь с таким email
        const userExists = await User.findOne({ where: { email } });
        if (userExists) {
            return res.status(400).json({ message: "Пользователь с таким email уже существует" });
        }

        // Хеширование пароля перед сохранением
        const hashedPassword = await bcrypt.hash(password, 10);
        const user = await User.create({
            first_name,
            last_name,
            email,
            password: hashedPassword,
        });

        // Генерация JWT токена
        const token = jwt.sign({ id: user.id }, process.env.JWT_SECRET, { expiresIn: '30d' });

        res.status(201).json({
            message: "Регистрация прошла успешно",
            token,
            user: {
                id: user.id,
                first_name: user.first_name,
                last_name: user.last_name,
                email: user.email,
            },
        });
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: "Ошибка сервера" });
    }
};

// Логин пользователя
const loginUser = async (req, res) => {
    const { email, password } = req.body;

    try {
        const user = await User.findOne({ where: { email } });
        if (!user) {
            return res.status(400).json({ message: "Неверный email или пароль" });
        }

        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) {
            return res.status(400).json({ message: "Неверный email или пароль" });
        }

        const token = jwt.sign({ id: user.id }, process.env.JWT_SECRET, { expiresIn: '30d' });

        res.json({
            message: "Вход выполнен успешно",
            token,
            user: {
                id: user.id,
                first_name: user.first_name,
                last_name: user.last_name,
                email: user.email,
            },
        });
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: "Ошибка сервера" });
    }
};

// Получение данных профиля пользователя (первое и последнее имя)
const getProfile = async (req, res) => {
    const userId = req.user.id; // Извлекаем ID пользователя из токена

    try {
        const user = await User.findByPk(userId);
        if (!user) {
            return res.status(404).json({ message: "Пользователь не найден" });
        }

        res.json({
            first_name: user.first_name,
            last_name: user.last_name,
        });
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: "Ошибка сервера" });
    }
};

// Роуты для регистрации, логина и получения профиля
app.post("/api/auth/register", registerUser);
app.post("/api/auth/login", loginUser);
app.get("/api/auth/profile", authenticateJWT, getProfile); // Новый маршрут для получения профиля

// Middleware для аутентификации JWT
function authenticateJWT(req, res, next) {
    const token = req.header("Authorization")?.replace("Bearer ", "");
    if (!token) {
        return res.status(403).json({ message: "Токен не предоставлен" });
    }

    jwt.verify(token, process.env.JWT_SECRET, (err, user) => {
        if (err) {
            return res.status(403).json({ message: "Неверный токен" });
        }
        req.user = user;
        next();
    });
}

// Запуск сервера
const PORT = process.env.PORT || 8080;
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});
