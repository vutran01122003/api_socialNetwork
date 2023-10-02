const createError = require('http-errors');
const User = require('../models/User');
const createTransporter = require('../config/transporter');
const client = require('../helper/connection.redis');
const otpGenerator = require('otp-generator');
const { signAccessToken, verifyAccessToken } = require('../services/jwt.service');
const { passwordValidation } = require('../helper/validation');
const hashPassword = require('../utils/hashPassword');

module.exports = {
    sendCode: async (req, res, next) => {
        try {
            const { email } = req.body;
            const user = await User.findOne({ email }).select('avatar username fullname');

            if (!user) {
                throw createError.NotFound('email not found');
            }

            const transporter = await createTransporter();
            const otp = otpGenerator.generate(6, {
                upperCaseAlphabets: false,
                specialChars: false
            });

            await client.set(`otp:${email}`, otp, {
                EX: 60
            });

            await transporter.sendMail({
                from: `Smedia <tranducvu234@gmail.com>`,
                to: email,
                subject: '[Smedia] You have changed your new password',
                html: `Your OTP: <b>${otp}</b>`
            });

            res.status(200).send({
                status: 'send email successful',
                user
            });
        } catch (error) {
            next(error);
        }
    },

    confirmCode: async (req, res, next) => {
        try {
            const { code, email, userId } = req.body;
            const codeRef = await client.get(`otp:${email}`);

            if (codeRef === code) {
                const token = await signAccessToken(userId);
                res.status(200).send({
                    status: 'confirm code successful',
                    token
                });
            } else {
                throw createError.BadRequest('wrong code');
            }
        } catch (error) {
            next(error);
        }
    },

    resetPassword: async (req, res, next) => {
        try {
            const { token, newPassword } = req.body;
            await passwordValidation({ password: newPassword });
            const hashedPassword = hashPassword(newPassword);
            const userId = (await verifyAccessToken(token)).id;

            const updatedUser = await User.updateOne({ _id: userId }, { password: hashedPassword });

            res.status(200).send({
                status: 'reset password successful',
                updatedUser
            });
        } catch (error) {
            next(error);
        }
    }
};
