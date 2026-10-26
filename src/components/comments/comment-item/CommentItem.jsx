import React from 'react';

export default function CommentItem(comment) {
  return (
    <div key={comment.comment_id} className="comment-card">
      <div className="comment-content">
        <div className="comment-header">
          <span className="comment-author">{comment.email}</span>
        </div>
        <p className="comment-text">{comment.comment}</p>
      </div>
    </div>
  );
}