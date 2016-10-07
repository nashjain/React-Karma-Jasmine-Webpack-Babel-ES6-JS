//Comment Model
export class Comment {
    constructor(data) {
        this.id = data.id;
        this.user = data.user;
        this.msg = data.msg;
        this.updatedOn = typeof(data.updatedOn) === 'string' ? Date.parse(data.updatedOn) : data.updatedOn;
        this.private = data.private || false;
        this.likes = parseInt(data.likes || 0);
    }

    compareTo(other){
        if (this.likes == other.likes)
            return this.updatedOn - other.updatedOn;
        return this.likes - other.likes;
    }

    incrementLikes(){
        this.likes++;
    }
}