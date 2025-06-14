const validation = require('../helper/validation');
const createError = require('http-errors');
const {
    getUserService,
    getSuggestedUserSerive,
    updateEditUserService,
    updateFollowerUserService,
    updateFollowingUserService,
    updateUnfollowerUserService,
    updateUnfollowingUserService,
    searchUsersService
} = require('../services/user.service');
const ObjectId = require('mongoose').Types.ObjectId;

module.exports = {
    searchUser: async (req, res, next) => {
        try {
            const userList = await searchUsersService({
                queryUrl: req.query,
                searchValue: req.body.searchValue,
                select: 'username fullname avatar'
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
            if (!ObjectId.isValid(id)) throw createError.NotFound('user not found');

            const user = await getUserService({ _id: id }, '-password');
            if (!user) throw createError.NotFound('User not found');

            res.status(200).send({ user });
        } catch (error) {
            next(error);
        }
    },

    getSuggestedUser: async (req, res, next) => {
        try {
            const user = req.user;
            const users = await getSuggestedUserSerive(user, 10);

            res.status(200).send({
                status: 'Get suggested users successfully',
                suggestedUsers: users
            });
        } catch (error) {
            next(error);
        }
    },

    updateUser: async (req, res, next) => {
        try {
            const { id } = req.params;
            const userData = req.body;

            if (!ObjectId.isValid(id)) throw createError.NotFound('user not found');

            const check = await getUserService({ username: userData.username });

            if (check?._id.toString() !== id && check)
                // Compare id's check and id's patch if equal then ignore else notify conflict
                // Check check variable has value or null
                throw createError.Conflict('Username already exists');

            await validation.editProfileValidation(userData);

            const updatedUser = await updateEditUserService(
                {
                    userId: id,
                    userData
                },
                '-password'
            );

            res.status(200).send({
                status: 'Update user successfully',
                user: updatedUser
            });
        } catch (error) {
            next(error);
        }
    },

    follow: async (req, res, next) => {
        try {
            const userId = req.params.id;
            const authId = req.body.authId;

            const updatedUser = await updateFollowerUserService({
                authId,
                userId
            });

            const updatedAuthUser = await updateFollowingUserService({
                authId,
                userId
            });

            res.status(200).send({
                user: updatedUser,
                authUser: updatedAuthUser
            });
        } catch (error) {
            next(error);
        }
    },

    unfollow: async (req, res, next) => {
        try {
            const userId = req.params.id;
            const authId = req.body.authId;

            const updatedUser = await updateUnfollowerUserService({
                userId,
                authId
            });

            const updatedAuthUser = await updateUnfollowingUserService({
                userId,
                authId
            });

            res.status(200).send({
                user: updatedUser,
                authUser: updatedAuthUser
            });
        } catch (error) {
            next(error);
        }
    }
};
