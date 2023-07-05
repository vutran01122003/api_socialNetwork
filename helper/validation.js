const Joi = require('joi');
const createError = require('http-errors');

module.exports = async (user) => {
    try {
        console.log(user);
        const schema = Joi.object({
            username: Joi.string().alphanum().min(3).max(30).required(),
            password: Joi.string().min(5).max(20).required(),
            cf_password: Joi.any()
                .valid(Joi.ref('password'))
                .required()
                .messages({
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
};
