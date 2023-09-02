module.exports = {
    queryDB: async (queryDB, queryURL, limit) => {
        const { page, currentQuantity } = queryURL;

        let skip = (page - 1) * limit;
        if (currentQuantity) {
            const changedPosts = currentQuantity - (page - 1) * limit;
            skip += changedPosts;
        }

        return queryDB.skip(skip).limit(limit);
    },
    queryMessage: async ({ queryDB, queryUrl, totalDocs, limit }) => {
        const { page, currentQuantity } = queryUrl;
        let _limit = limit;
        const changeMessagesNum = currentQuantity - (page - 1) * limit;
        // Users can delete or create messages, so ChangeMessagesNum is responsible for changing the number of messages to skip
        // If user creates notification, it will cause TotalDocs to increase by one document
        // So we have to subtract certain amount equal to TotalDos's increased doc number
        // If user delete notification, we have to set changeMessagesNum's value equal to 0, because it's reverse messages pagination
        let skip = totalDocs - page * _limit - (changeMessagesNum > 0 ? changeMessagesNum : 0);

        // Last page, if amount docs less than limit, skip will less than 0, so we have to set skip's value equal to 0 and subtract limit equal to rest docs
        if (skip < 0) {
            if (-skip >= limit) return [];
            _limit += skip;
            skip = 0;
        }

        return queryDB.skip(skip).limit(_limit).sort({ createdAt: 1 });
    }
};
