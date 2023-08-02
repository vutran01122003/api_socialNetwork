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
    verifyAccessToken: async (req, res, next) => {
        try {
            const accessToken =
                req?.headers['x-token'] || req.cookies?.accessToken;
            const routes = ['/posts', '/posts_discover'];

            const data = await jwt.verify(accessToken, ACCESS_TOKEN_SECRET);

            if (routes.includes(req.route.path)) {
                const user = await User.findById(data.id);
                req.user = user;
            }

            res.locals.userId = data.id;

            next();
        } catch (error) {
            if (
                ['JsonWebTokenError', 'TokenExpiredError'].includes(error.name)
            ) {
                next({ status: 200, code: 401, message: error.message });
            }
            next(error);
        }
    },
    verifyRefreshToken: async (req, res, next) => {
        try {
            const refreshToken = req.cookies.refreshToken;
            if (!refreshToken) throw createError.Forbidden('you need to login');
            jwt.verify(refreshToken, REFRESH_TOKEN_SECRET, (err, data) => {
                if (err) {
                    throw createError.Forbidden();
                }
                res.locals.userId = data.id;
                next();
            });
        } catch (error) {
            next(error);
        }
    }
};
