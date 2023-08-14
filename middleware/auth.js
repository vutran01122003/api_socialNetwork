const createError = require('http-errors');
const jwtService = require('../services/jwt.service');
const { findOneUserService } = require('../services/user.service');

module.exports = {
    auth: async (req, res, next) => {
        try {
            const accessToken = req?.headers['x-token'] || req.cookies?.accessToken;
            const routes = ['/posts', '/posts_discover', '/suggested_users'];

            const data = await jwtService.verifyAccessToken(accessToken);

            if (routes.includes(req.route.path)) {
                const user = await findOneUserService({ _id: data.id });
                req.user = user;
            }

            res.locals.userId = data.id;

            next();
        } catch (error) {
            if (['JsonWebTokenError', 'TokenExpiredError'].includes(error.name)) {
                next({ status: 200, code: 401, message: error.message });
            }
            next(error);
        }
    },

    checkRefreshToken: async (req, res, next) => {
        try {
            const refreshToken = req.cookies.refreshToken;
            if (!refreshToken) throw createError.Forbidden('you need to login');
            const data = await jwtService.verifyRefreshToken(refreshToken);
            if (data) {
                res.locals.userId = data.id;
                next();
            }
        } catch (error) {
            next(error);
        }
    }
};
