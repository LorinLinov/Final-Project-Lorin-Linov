import React from 'react';
import { comment_api } from '../../api/comment-api';
import useAuth from '../../hooks/useAuth';
import { useEffect, useContext } from 'react';
import CommentItem from './comment-item/CommentItem';
import CommentContext from '../../contexts/comment-context';
import { toast } from 'react-toastify';


// !
export default function CommentList({product_id, isOwner}) {
  const { user } = useAuth();

  const { comments, dispatch } = useContext(CommentContext);

  useEffect(() => {
    comment_api.getAll(product_id)
      .then(result => dispatch({ type: 'SET_COMMENTS', payload: result }))
  }, [product_id, dispatch]);


  const commentsAction = async (formData) => {
  const newComment = {
    comment: formData.get('comment'),
    product_id: product_id,
    email: user?.email,
    user_id: user?.id
  };

  try {
    await comment_api.create(newComment);

    const result = await comment_api.getAll(product_id);
    dispatch({ type: 'SET_COMMENTS', payload: result });
  } catch (err) {
    toast.error(err.message);
  }
};

  return (
    <div className="comments-section">
      <h3 className="comments-title">Customer Reviews & Discussion ({comments.length})</h3>


      {isOwner ? <div></div> : <form className="comment-form" action={commentsAction}>
        <textarea
          className="comment-input"
          placeholder="Write a comment or ask a question about this product..."
          name="comment"
          rows="3"
        />
        <div className="comment-form-footer">
          <button type="submit" className="btn-submit-comment">
            Post Comment
          </button>
        </div>
      </form>}

      <div className="comments-list">
        {comments.map((comment) => (
          <CommentItem key={comment.comment_id} {...comment} />
        ))}
      </div>
    </div>
  );
}