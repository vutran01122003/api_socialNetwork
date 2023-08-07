require('dotenv').config();
const jwt = require('jsonwebtoken');
const createError = require('http-errors');
const User = require('../models/User');
const { ACCESS_TOKEN_SECRET, REFRESH_TOKEN_SECRET } = process.env;

module.exports = {
    signAccessToken: (id) => {
        return new Promise((resolve, reject) => {
            jwt.sign(
                { id },
                ACCESS_TOKEN_SECRET,
                {
                    expiresIn: '1h'
                },
                (err, data) => {
                    if (err) {
                        reject(err);
                    }
                    resolve(data);
                }
            );
        });
    },

    signRefreshToken: async (id) => {
        try {
            const refreshToken = await jwt.sign({ id }, REFRESH_TOKEN_SECRET, {
                expiresIn: '30d'
            });
            return refreshToken;
        } catch (error) {
            throw createError.Forbidden(error);
        }
    },

    verifyAccessToken: async (accessToken) => {
        try {
            const data = await jwt.verify(accessToken, ACCESS_TOKEN_SECRET);
            return data;
        } catch (error) {
            throw error;
        }
    },

    verifyRefreshToken: async (refreshToken) => {
        try {
            const data = await jwt.verify(refreshToken, REFRESH_TOKEN_SECRET);
            return data;
        } catch (error) {
            throw error;
        }
    }
};
