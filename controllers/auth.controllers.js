const User = require('../models/User');
const createError = require('http-errors');
const validation = require('../helper/validation');
const jwtService = require('../helper/jwt.service');

module.exports = {
    register: async (req, res, next) => {
        try {
            const { email, password, username, fullname, gender } = req.body;
            const checkEmail = await User.findOne({ email });
            const checkUsername = await User.findOne({ username });
            if (!email || !password)
                throw createError.BadRequest('empty email or password');
            if (checkEmail || checkUsername)
                throw createError.Conflict('account was exists');
            await validation(req.body);
            const userCreated = new User({
                email,
                password,
                username,
                fullname,
                gender
            });

            userCreated.save();
            const accessToken = await jwtService.signAccessToken(
                userCreated._id
            );

            const refreshToken = await jwtService.signRefreshToken(
                userCreated._id
            );

            res.status(200)
                .cookie('accessToken', accessToken, {
                    httpOnly: 'true',
                    maxAge: 5 * 60 * 1000
                })
                .cookie('refreshToken', refreshToken, {
                    httpOnly: 'true',
                    maxAge: 365 * 24 * 60 * 60 * 1000
                })
                .send({
                    status: 'register success',
                    user: userCreated,
                    token: {
                        accessToken,
                        refreshToken
                    }
                });
        } catch (error) {
            next(error);
        }
    },
    login: async (req, res, next) => {
        try {
            const { email, password } = req.body;

            const user = await User.findOne({ email });
            if (!email || !password)
                throw createError.BadRequest('empty email or password');
            if (!user) throw createError.NotFound('email does not exists');
            const isValid = user.checkPassword(password);
            if (!isValid) {
                throw createError.Unauthorized('password is incorrect');
            }

            const accessToken = await jwtService.signAccessToken(user._id);

            const refreshToken = await jwtService.signRefreshToken(user._id);

            res.status(200)
                .cookie('accessToken', accessToken, {
                    httpOnly: 'true',
                    maxAge: 5 * 60 * 1000
                })
                .cookie('refreshToken', refreshToken, {
                    httpOnly: 'true',
                    maxAge: 365 * 24 * 60 * 60 * 1000
                })
                .send({
                    status: 'login success',
                    user,
                    token: {
                        accessToken,
                        refreshToken
                    }
                });
        } catch (error) {
            next(error);
        }
    },
    refreshToken: async (req, res, next) => {
        try {
            const id = res.locals.userId;
            const user = await User.findOne({ _id: id });
            const accessToken = await jwtService.signAccessToken(id);
            const refreshToken = await jwtService.signRefreshToken(id);

            res.status(200)
                .cookie('accessToken', accessToken, {
                    httpOnly: 'true',
                    maxAge: 5 * 60 * 1000
                })
                .cookie('refreshToken', refreshToken, {
                    httpOnly: 'true',
                    maxAge: 365 * 24 * 60 * 60 * 1000
                })
                .send({
                    status: 'refresh token success',
                    user,
                    token: {
                        accessToken,
                        refreshToken
                    }
                });
        } catch (error) {
            next(error);
        }
    },
    accessToken: async (req, res, next) => {
        try {
            const id = res.locals.userId;
            const accessToken = req.cookies.accessToken;
            const refreshToken = req.cookies.refreshToken;

            const user = await User.findOne({ _id: id });
            if (!user) throw createError.NotFound('user not exists');
            return res.status(200).send({
                user,
                token: {
                    accessToken,
                    refreshToken
                }
            });
        } catch (error) {
            next(error);
        }
    },
    logout: async (req, res) => {
        res.clearCookie('accessToken').send('logout');
    }
};
