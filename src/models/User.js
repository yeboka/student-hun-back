// models/User.js
const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const User = sequelize.define('User', {
    first_name: {
        type: DataTypes.STRING,
        allowNull: false,
    },
    last_name: {
        type: DataTypes.STRING,
        allowNull: false,
    },
    email: {
        type: DataTypes.STRING,
        allowNull: false,
        unique: true,
    },
    password: {
        type: DataTypes.STRING,
        allowNull: false,
    },
    skills: {
        type: DataTypes.STRING,
    },
    available_time: {
        type: DataTypes.STRING,
    },
    profile_picture: {
        type: DataTypes.STRING,
    },
});

module.exports = User;
