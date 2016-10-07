import React from 'react'
import {CommentComponent, MsgComponent} from './Comment'
import {Comments} from "./../model/Comments"
import $ from 'jquery';

export class CommentsComponent extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            comments: new Comments([]), ajax_error: false
        }
    }

    _setState(comments, ajax_error) {
        this.setState({comments: comments, ajax_error: ajax_error});
    }

    componentDidMount() {
        var comments = this.state.comments;

        var component = this;

        if (component.props.comments) {
            comments = new Comments(component.props.comments);
            component._setState(comments, false);
            return;
        }

        if (component.props.sourceUrl) {
            $.getJSON(component.props.sourceUrl)
                .done(function (response) {
                    component._setState(new Comments(response), false);
                })
                .fail(function (response) {
                    component._setState(comments, true);
                });
        }
    }

    render() {
        if (this.state.ajax_error)
            return <div><MsgComponent className='error' msg={'Failed to fetch comments from URL...'} key='error'/></div>;

        var loggedInUser = this.props.loggedInUser || '';
        var comments = this.state.comments.authorised(loggedInUser).sort();
        if (comments.isEmpty())
            return <div><MsgComponent className='empty' msg={'Be the first one to comment...'} key='empty'/></div>;

        var container = this;
        var rerenderComments = function (id) {
            comments.updateLikeFor(id);
            container._setState(comments.sort(), false);
        };
        var createComment = function (comment) {
            return <CommentComponent comment={comment} key={comment.id} updateLikes={rerenderComments}/>;
        };
        return <div>{comments.map(createComment)}</div>;
    }
}