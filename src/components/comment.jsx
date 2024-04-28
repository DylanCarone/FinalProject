import React from 'react';
import moment from "moment";

const Comment = ({ comment }) => {
    return (
        <div className='comment-full'>
            <div className='comment-header'>
                <h3>{comment.user_name}</h3>
                <p>{moment(comment.created_at).fromNow()}</p>
            </div>
            <p>{comment.comment}</p>
        </div>
    );
};

export default Comment;