require('dotenv').config();
const jwt = require('jsonwebtoken');
const createError = require('http-errors');
const { ACCESS_TOKEN_SECRET, REFRESH_TOKEN_SECRET } = process.env;
module.exports = {
    signAccessToken: (id) => {
        return new Promise((resolve, reject) => {
            jwt.sign(
                { id },
                ACCESS_TOKEN_SECRET,
                {
                    expiresIn: '5m'
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
                expiresIn: '1y'
            });
            return refreshToken;
        } catch (error) {
            throw createError.Forbidden(error);
        }
    },
    verifyAccessToken: async (req, res, next) => {
        try {
            const accessToken = req.cookies.accessToken;
            if (!accessToken) throw createError.Unauthorized();
            jwt.verify(accessToken, ACCESS_TOKEN_SECRET, (err, data) => {
                if (err) {
                    throw createError.Forbidden();
                }
                res.locals.userId = data.id;
                next();
            });
        } catch (error) {
            next(error);
        }
    },
    verifyRefreshToken: async (req, res, next) => {
        try {
            const refreshToken = req.cookies.refreshToken;
            if (!refreshToken) throw createError.Unauthorized();
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
