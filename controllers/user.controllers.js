const validation = require('../helper/validation');
const User = require('../models/User');
const createError = require('http-errors');
const ObjectId = require('mongoose').Types.ObjectId;
const cloudinary = require('../utils/couldinary');

module.exports = {
    searchUser: async (req, res) => {
        try {
            const { searchValue } = req.body;
            const regex = new RegExp(searchValue);

            const userList = await User.find({
                username: { $regex: regex, $options: 'i' }
            }).select('username fullname avatar');

            res.status(200).send({
                status: userList.length === 0 ? 'nothing' : 'success',
                users: userList
            });
        } catch (error) {
            next(error);
        }
    },

    getUser: async (req, res, next) => {
        try {
            const { id } = req.params;
            if (!ObjectId.isValid(id))
                throw createError.NotFound('user not found');

            const user = await User.findOne({ _id: id });
            if (!user) throw createError.NotFound('user not found');

            res.status(200).send({ user });
        } catch (error) {
            next(error);
        }
    },

    updateUser: async (req, res, next) => {
        try {
            const { id } = req.params;
            const userData = req.body;

            if (!ObjectId.isValid(id))
                throw createError.NotFound('user not found');

            const check = await User.findOne({ username: userData.username });
            if (check?._id.toString() !== id && check)
                // Compare id's check and id's patch if equal then ignore else notify conflict
                // Check check variable has value or null
                throw createError.Conflict('username already exists');

            await validation.editProfileValidation(userData);

            if (Object.keys(req.files).length > 0) {
                const coverFile = req.files.cover;
                const coverDataBase64 = req.files.cover.data.toString('base64');
                const cover = await cloudinary.uploader.upload(
                    `data:${coverFile.mimetype};base64,${coverDataBase64}`,
                    {
                        folder: 'test'
                    }
                );
                userData.avatar = cover.secure_url;
            }

            const updatedUser = await User.findByIdAndUpdate(id, userData, {
                new: true
            });
            res.status(200).send({
                status: 'update user success',
                user: updatedUser
            });
        } catch (error) {
            console.log(error);
            next(error);
        }
    }
};
