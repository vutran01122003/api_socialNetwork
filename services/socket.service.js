class SocketService {
    user = {};

    connection = (socket) => {
        let id = null;
        socket.on('connected_user', (userId) => {
            id = userId;
            this.user[userId] = socket.id;
            global._io.emit('user_online_list', this.user);
        });

        socket.on('disconnect', () => {
            delete this.user[id];
            global._io.emit('user_online_list', this.user);
        });
        // Create post
        socket.on('notification_createdPost', (createdNotification) => {
            Object.keys(this.user).forEach((userIdKey) => {
                if (createdNotification.receiver.includes(userIdKey)) {
                    socket
                        .to(this.user[userIdKey])
                        .emit('notification_createdPost', createdNotification);
                }
            });
        });

        // Like Post
        socket.on('like_post', (newPost) => {
            const ids = [...newPost.user.followers, newPost.user._id];
            Object.keys(this.user).forEach((userIdKey) => {
                if (ids.includes(userIdKey)) {
                    socket.to(this.user[userIdKey]).emit('liked_post', newPost);
                }
            });
        });

        socket.on('unlike_post', (newPost) => {
            const ids = [...newPost.user.followers, newPost.user._id];
            Object.keys(this.user).forEach((userIdKey) => {
                if (ids.includes(userIdKey)) {
                    socket.to(this.user[userIdKey]).emit('unliked_post', newPost);
                }
            });
        });

        socket.on('notification_liked', (createdNotification) => {
            socket
                .to(this.user[createdNotification.postOwnerId])
                .emit('notification_liked', createdNotification);
        });

        // Comment
        socket.on('comment', (newPost) => {
            const ids = [...newPost.user.followers, newPost.user._id];
            Object.keys(this.user).forEach((userIdKey) => {
                if (ids.includes(userIdKey)) {
                    socket.to(this.user[userIdKey]).emit('created_comment', newPost);
                }
            });
        });

        socket.on('delete_comment', (newPost) => {
            const ids = [...newPost.user.followers, newPost.user._id];
            Object.keys(this.user).forEach((userIdKey) => {
                if (ids.includes(userIdKey)) {
                    socket.to(this.user[userIdKey]).emit('deleted_comment', newPost);
                }
            });
        });

        socket.on('notification_commentedPost', (createdNotification) => {
            socket
                .to(this.user[createdNotification.postOwnerId])
                .emit('notification_commentedPost', createdNotification);
        });

        // Follow
        socket.on('follow_user', (newUser) => {
            socket.to(this.user[newUser._id]).emit('followed_user', newUser);
        });

        socket.on('unfollow_user', (newUser) => {
            socket.to(this.user[newUser._id]).emit('unfollowed_user', newUser);
        });

        // Save
        socket.on('notification_saved', (createdNotification) => {
            console.log(createdNotification);

            socket
                .to(this.user[createdNotification.postOwnerId])
                .emit('notification_saved', createdNotification);
        });

        // Follow
        socket.on('notification_followedUser', (createdNotification) => {
            socket
                .to(this.user[createdNotification.receiver[0]])
                .emit('notification_followedUser', createdNotification);
        });
    };
}

module.exports = new SocketService();
