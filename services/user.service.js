const User = require('../models/User');
const { queryDB } = require('../helper/pagination.query');
module.exports = {
    searchUsersService: async ({ queryUrl, searchValue, select }) => {
        const regex = new RegExp(searchValue);
        const users = queryDB(
            User.find({
                username: { $regex: regex, $options: 'i' }
            })
                .select(select)
                .lean(),
            queryUrl,
            5
        );
        return users;
    },

    findOneUserService: async (filter) => {
        return User.findOne(filter).lean();
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
            .lean();
    },

    getSuggestedUserSerive: async (user, limit) => {
        return await User.aggregate([
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
        return await User.findByIdAndUpdate(userId, userData, {
            new: true
        })
            .select(select)
            .lean();
    },

    updateFollowerUserService: async ({ authId, userId }) => {
        return await User.findByIdAndUpdate(userId, { $push: { followers: authId } }, { new: true })
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
            .lean();
    },

    updateFollowingUserService: async ({ authId, userId }) => {
        return await User.findByIdAndUpdate(authId, { $push: { following: userId } }, { new: true })
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
            .lean();
    },

    updateUnfollowerUserService: async ({ authId, userId }) => {
        return await User.findByIdAndUpdate(userId, { $pull: { followers: authId } }, { new: true })
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
            .lean();
    },

    updateUnfollowingUserService: async ({ authId, userId }) => {
        return await User.findByIdAndUpdate(authId, { $pull: { following: userId } }, { new: true })
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
            .lean();
    }
};
