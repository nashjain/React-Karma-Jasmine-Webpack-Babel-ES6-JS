import React from 'react'

export class CommentComponent extends React.Component {
    constructor(props) {
        super(props);
    }

    handleSubmit(e) {
        e.preventDefault();
        this.props.updateLikes(this.props.comment.id);
    }

    render() {
        return <div className="comment">
            <div className="comment-header">
                {this.props.comment.user}
                <form onSubmit={this.handleSubmit} className="likes">
                    <button ref={this.props.comment.id}>{this.props.comment.likes} Likes</button>
                </form>
            </div>
            <div className="comment-body">{this.props.comment.msg}</div>
        </div>;
    }
}

export class MsgComponent extends React.Component {
    constructor(props) {
        super(props);
    }

    render() {
        return <div className={this.props.className}>{this.props.msg}</div>;
    }
}