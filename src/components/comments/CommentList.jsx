import React from 'react';
// !
export default function CommentList() {
  return (
    <div className="comments-section">
      {/* <h3 className="comments-title">Customer Reviews & Discussion ({comments.length})</h3> */}


      <form className="comment-form" >
        <textarea
          className="comment-input"
          placeholder="Write a comment or ask a question about this product..."
          rows="3"
        />
        <div className="comment-form-footer">
          <button type="submit" className="btn-submit-comment">
            Post Comment
          </button>
        </div>
      </form>

      <div className="comments-list">
        {/* {comments.map((item) => (
          <div key={item.id} className="comment-card">
            <div className="comment-avatar">{item.avatar}</div>
            <div className="comment-content">
              <div className="comment-header">
                <span className="comment-author">{item.author}</span>
                <span className="comment-date">{item.date}</span>
              </div>
              <p className="comment-text">{item.text}</p>
            </div>
          </div>
        ))} */}
      </div>
    </div>
  );
}