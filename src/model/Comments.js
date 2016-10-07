//Comments Model
import {Comment} from "./Comment"

export class Comments {
    constructor(data) {
        this.data = data.map(function (elem) {
            return new Comment(elem);
        });
    }

    sort() {
        var sortedComments = this.data.sort(function (a, b) {
            return b.compareTo(a);
        });
        return new Comments(sortedComments);
    }

    authorised(loggedInUser) {
        var filteredComments = this.data.filter(function (c) {
            return loggedInUser === c.user || !c.private;
        });
        return new Comments(filteredComments);
    }

    isEmpty() {
        return this.data.length == 0;
    }

    map(cb) {
        return this.data.map(cb);
    }

    updateLikeFor(id) {
        this.data.map(function (comment) {
            if (comment.id == id) comment.incrementLikes();
        });
    }
}