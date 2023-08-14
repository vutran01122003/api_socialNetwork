const Joi = require('joi');
const createError = require('http-errors');

module.exports = {
    registerValidation: async (user) => {
        try {
            const schema = Joi.object({
                username: Joi.string().alphanum().min(3).max(30).required(),
                password: Joi.string().min(5).max(20).required(),
                cf_password: Joi.any().valid(Joi.ref('password')).required().messages({
                    'any.only': 'Password must match'
                }),
                email: Joi.string().email().required(),
                fullname: Joi.string().min(5).max(30).required(),
                gender: Joi.string().required()
            });

            const { error } = await schema.validate(user);
            if (error) throw createError.BadRequest(error.details[0].message);
        } catch (error) {
            throw error;
        }
    },
    editProfileValidation: async (user) => {
        try {
            const schema = Joi.object({
                username: Joi.string().alphanum().min(5).max(25).required(),
                fullname: Joi.string().min(5).max(25).required(),
                story: Joi.string().min(0).max(150).required(),
                website: Joi.string().uri().required().allow(''),
                gender: Joi.string().required(),
                avatar: Joi.string()
            });

            const { error } = await schema.validate(user);
            if (error) throw createError.BadRequest(error.details[0].message);
        } catch (error) {
            throw error;
        }
    }
};
