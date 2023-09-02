const User = require('../models/User');
const { queryDB } = require('../helper/pagination.query');
module.exports = {
    searchUsersService: async ({ queryUrl, searchValue, select }) => {
        const regex = new RegExp(searchValue);
        const users = queryDB(
            User.find({
                username: { $regex: regex, $options: 'i' }
            }).select(select),
            queryUrl,
            5
        );
        return users;
    },

    findOneUserService: async (filter) => {
        return User.findOne(filter).exec();
    },

    getUserService: async (filter, select) => {
        return User.findOne(filter)
            .select(select)
            .populate([
                {
                    path: 'followers',
                    model: 'user',
                    select: 'fullname username avatar'
                },
                {
                    path: 'following',
                    model: 'user',
                    select: 'fullname username avatar following'
                }
            ])
            .exec();
    },

    getSuggestedUserSerive: async (user, limit) => {
        return User.aggregate([
            {
                $match: {
                    _id: { $nin: [user._id, ...user.following] }
                }
            },
            { $sample: { size: limit } },
            { $project: { username: 1, avatar: 1, fullname: 1 } }
        ]);
    },

    updateEditUserService: async ({ userId, userData }, select) => {
        return User.findByIdAndUpdate(userId, userData, {
            new: true
        }).select(select);
    },

    updateFollowerUserService: async ({ authId, userId }) => {
        return User.findByIdAndUpdate(userId, { $push: { followers: authId } }, { new: true })
            .select('-password')
            .populate([
                {
                    path: 'followers',
                    model: 'user',
                    select: 'fullname username avatar'
                },
                {
                    path: 'following',
                    model: 'user',
                    select: 'fullname username avatar following'
                }
            ])
            .exec();
    },

    updateFollowingUserService: async ({ authId, userId }) => {
        return User.findByIdAndUpdate(authId, { $push: { following: userId } }, { new: true })
            .select('-password')
            .populate([
                {
                    path: 'followers',
                    model: 'user',
                    select: 'fullname username avatar'
                },
                {
                    path: 'following',
                    model: 'user',
                    select: 'fullname username avatar following'
                }
            ])
            .exec();
    },

    updateUnfollowerUserService: async ({ authId, userId }) => {
        return User.findByIdAndUpdate(userId, { $pull: { followers: authId } }, { new: true })
            .select('-password')
            .populate([
                {
                    path: 'followers',
                    model: 'user',
                    select: 'fullname username avatar'
                },
                {
                    path: 'following',
                    model: 'user',
                    select: 'fullname username avatar following'
                }
            ])
            .exec();
    },

    updateUnfollowingUserService: async ({ authId, userId }) => {
        return User.findByIdAndUpdate(authId, { $pull: { following: userId } }, { new: true })
            .select('-password')
            .populate([
                {
                    path: 'followers',
                    model: 'user',
                    select: 'fullname username avatar'
                },
                {
                    path: 'following',
                    model: 'user',
                    select: 'fullname username avatar following'
                }
            ])
            .exec();
    }
};
