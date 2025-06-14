class SocketService {
    user = {};

    connection = (socket) => {
        let id = null;
        socket.on("connected_user", (userId) => {
            id = userId;
            this.user[userId] = socket.id;
            global._io.emit("user_online_list", this.user);
        });

        socket.on("disconnect", () => {
            delete this.user[id];
            global._io.emit("user_online_list", this.user);
            global._io.emit("disconnected_user", { userId: id });
        });
        // Create post
        socket.on("notification_createdPost", (createdNotification) => {
            Object.keys(this.user).forEach((userIdKey) => {
                if (createdNotification.receiver.includes(userIdKey)) {
                    socket.to(this.user[userIdKey]).emit("notification_createdPost", createdNotification);
                }
            });
        });

        // Like Post
        socket.on("like_post", (newPost) => {
            const ids = [...newPost.user.followers, newPost.user._id];
            Object.keys(this.user).forEach((userIdKey) => {
                if (ids.includes(userIdKey)) {
                    socket.to(this.user[userIdKey]).emit("liked_post", newPost);
                }
            });
        });

        socket.on("unlike_post", (newPost) => {
            const ids = [...newPost.user.followers, newPost.user._id];
            Object.keys(this.user).forEach((userIdKey) => {
                if (ids.includes(userIdKey)) {
                    socket.to(this.user[userIdKey]).emit("unliked_post", newPost);
                }
            });
        });

        socket.on("notification_liked", (createdNotification) => {
            socket.to(this.user[createdNotification.postOwnerId]).emit("notification_liked", createdNotification);
        });

        // Comment
        socket.on("comment", ({ postId, newComment, postOwnerId, originCommentId }) => {
            const userIdKeyList = Object.keys(this.user);
            if (userIdKeyList.includes(postOwnerId)) {
                socket.to(this.user[postOwnerId]).emit("created_comment", { postId, newComment, originCommentId });
            }
        });

        // socket.on('delete_comment', (newPost) => {
        //     try {
        //         const ids = [...newPost.user.followers, newPost.user._id];
        //         Object.keys(this.user).forEach((userIdKey) => {
        //             if (ids.includes(userIdKey)) {
        //                 socket.to(this.user[userIdKey]).emit('deleted_comment', newPost);
        //             }
        //         });
        //     } catch (error) {
        //         throw error;
        //     }
        // });

        socket.on("notification_commentedPost", (createdNotification) => {
            socket
                .to(this.user[createdNotification.postOwnerId])
                .emit("notification_commentedPost", createdNotification);
        });

        // Follow
        socket.on("follow_user", (newUser) => {
            socket.to(this.user[newUser._id]).emit("followed_user", newUser);
        });

        socket.on("unfollow_user", (newUser) => {
            socket.to(this.user[newUser._id]).emit("unfollowed_user", newUser);
        });

        // Save
        socket.on("notification_saved", (createdNotification) => {
            socket.to(this.user[createdNotification.postOwnerId]).emit("notification_saved", createdNotification);
        });

        // Follow
        socket.on("notification_followedUser", (createdNotification) => {
            socket
                .to(this.user[createdNotification.receiver[0]])
                .emit("notification_followedUser", createdNotification);
        });

        // Message
        socket.on("created_message", (data) => {
            socket.to(this.user[data.createdMessage.receiver]).emit("created_message", data);
        });

        // Call
        socket.on("call_user", (data) => {
            socket.to(this.user[data.receiver._id]).emit("answer_user", data);
        });

        socket.on("end_call", (data) => {
            socket.to(this.user[data.restUserId]).emit("end_call", data);
        });

        socket.on("answer_call", (data) => {
            socket.to(this.user[data.senderId]).emit("answer_call", data);
        });

        socket.on("play_video", (data) => {
            socket.to(this.user[data.userId]).emit("play_remote_video", data);
        });

        socket.on("play_video_receiver", (data) => {
            socket.to(this.user[data.receiverId]).emit("play_video_receiver", data);
        });
        // Conversation
        socket.on("deleted_conversation", (data) => {
            socket.to(this.user[data.receiverId]).emit("deleted_conversation", data);
        });
    };
}

module.exports = new SocketService();
