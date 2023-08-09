class SocketService {
    user = {};

    connection = (socket) => {
        let id = null;
        socket.on('connected_user', (userId) => {
            id = userId;
            this.user[userId] = socket.id;
        });

        socket.on('disconnect', () => {
            delete this.user[id];
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
                    socket
                        .to(this.user[userIdKey])
                        .emit('unliked_post', newPost);
                }
            });
        });

        // Comment
        socket.on('comment', (newPost) => {
            const ids = [...newPost.user.followers, newPost.user._id];
            Object.keys(this.user).forEach((userIdKey) => {
                if (ids.includes(userIdKey)) {
                    socket
                        .to(this.user[userIdKey])
                        .emit('created_comment', newPost);
                }
            });
        });

        socket.on('delete_comment', (newPost) => {
            const ids = [...newPost.user.followers, newPost.user._id];
            Object.keys(this.user).forEach((userIdKey) => {
                if (ids.includes(userIdKey)) {
                    socket
                        .to(this.user[userIdKey])
                        .emit('deleted_comment', newPost);
                }
            });
        });

        // Follow
        socket.on('follow_user', (newUser) => {
            socket.to(this.user[newUser._id]).emit('followed_user', newUser);
        });

        socket.on('unfollow_user', (newUser) => {
            socket.to(this.user[newUser._id]).emit('unfollowed_user', newUser);
        });
    };
}

module.exports = new SocketService();
