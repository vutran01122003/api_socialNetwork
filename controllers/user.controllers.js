const User = require('../models/User');
const createError = require('http-errors');
const ObjectId = require('mongoose').Types.ObjectId;

module.exports = {
    searchUser: async (req, res) => {
        try {
            const { searchValue } = req.body;
            const regex = new RegExp(searchValue);

            const userList = await User.find({
                username: { $regex: regex, $options: 'i' }
            });

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
                throw createError.NotFound('User not found');
            const user = await User.findOne({ _id: id });
            if (!user) throw createError.NotFound('User not found');
            res.status(200).send({ user });
        } catch (error) {
            next(error);
        }
    }
};
