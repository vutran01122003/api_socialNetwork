const createError = require('http-errors');
const validation = require('../helper/validation');
const jwtService = require('../services/jwt.service');
const {
    getUserService,
    populateUserService,
    createUserService
} = require('../services/auth.service');

module.exports = {
    register: async (req, res, next) => {
        try {
            const { email, password, username } = req.body;

            const checkEmail = await getUserService({ email });
            const checkUsername = await getUserService({ username });

            if (!email || !password) throw createError.BadRequest('empty email or password');
            if (checkEmail) throw createError.Conflict('email was exists');
            if (checkUsername) throw createError.Conflict('username was exists');

            await validation.registerValidation(req.body);

            const userCreated = await createUserService(req.body);
            console.log(userCreated);

            const accessToken = await jwtService.signAccessToken(userCreated._id);

            const refreshToken = await jwtService.signRefreshToken(userCreated._id);

            res.status(200)
                .cookie('accessToken', accessToken, {
                    httpOnly: 'true'
                })
                .cookie('refreshToken', refreshToken, {
                    httpOnly: 'true'
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
            console.log(error);
            next(error);
        }
    },
    login: async (req, res, next) => {
        try {
            const { email, password } = req.body;

            const user = await populateUserService({ email });

            if (!email || !password) throw createError.BadRequest('empty email or password');
            if (!user) throw createError.NotFound('email does not exists');
            const isValid = user.checkPassword(password);
            if (!isValid) {
                throw createError.Unauthorized('password is incorrect');
            }

            const accessToken = await jwtService.signAccessToken(user._id);

            const refreshToken = await jwtService.signRefreshToken(user._id);

            res.status(200)
                .cookie('accessToken', accessToken, {
                    httpOnly: 'true'
                })
                .cookie('refreshToken', refreshToken, {
                    httpOnly: 'true'
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

            const user = await populateUserService({ _id: id }, '-password');

            const accessToken = await jwtService.signAccessToken(id);
            const refreshToken = await jwtService.signRefreshToken(id);

            res.status(200)
                .cookie('accessToken', accessToken, {
                    httpOnly: 'true'
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

            const user = await populateUserService({ _id: id }, '-password');

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
        res.clearCookie('accessToken').clearCookie('refreshToken').send('success logout');
    }
};
