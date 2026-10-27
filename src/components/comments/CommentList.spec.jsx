import React from 'react';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import CommentList from './CommentList';
import CommentContext from '../../contexts/comment-context';
import { comment_api } from '../../api/comment-api';
import useAuth from '../../hooks/useAuth';
import { toast } from 'react-toastify';

vi.mock('../../api/comment-api', () => ({
  comment_api: {
    getAll: vi.fn(),
    create: vi.fn(),
  },
}));

vi.mock('../../hooks/useAuth', () => ({
  default: vi.fn(),
}));

vi.mock('react-toastify', () => ({
  toast: { error: vi.fn() },
}));

vi.mock('./comment-item/CommentItem', () => ({
  default: ({ email, comment }) => (
    <div data-testid="comment-item">
      {email}: {comment}
    </div>
  ),
}));

const comments = [
  { comment_id: 1, email: 'john@example.com', comment: 'Great tomatoes!' },
  { comment_id: 2, email: 'anna@example.com', comment: 'Could be cheaper.' },
];

const user = { id: 'u1', email: 'me@example.com' };

let dispatch;

const renderList = ({
  productId = 42,
  isOwner = false,
  contextComments = comments,
} = {}) =>
  render(
    <CommentContext.Provider value={{ comments: contextComments, dispatch }}>
      <CommentList product_id={productId} isOwner={isOwner} />
    </CommentContext.Provider>
  );

describe('CommentList', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    dispatch = vi.fn();
    useAuth.mockReturnValue({ user });
    comment_api.getAll.mockResolvedValue(comments);
    comment_api.create.mockResolvedValue({});
  });

  describe('loading comments', () => {
    it('fetches comments for the given product on mount', async () => {
      renderList({ productId: 42 });
      await waitFor(() => expect(comment_api.getAll).toHaveBeenCalledTimes(1));
      expect(comment_api.getAll).toHaveBeenCalledWith(42);
    });

    it('dispatches SET_COMMENTS with the fetched result', async () => {
      renderList();
      await waitFor(() =>
        expect(dispatch).toHaveBeenCalledWith({
          type: 'SET_COMMENTS',
          payload: comments,
        })
      );
    });
  });

  describe('rendering', () => {
    it('shows the title with the comments count', async () => {
      renderList();
      expect(
        screen.getByRole('heading', {
          name: 'Customer Reviews & Discussion (2)',
        })
      ).toBeInTheDocument();
      await waitFor(() => expect(comment_api.getAll).toHaveBeenCalled());
    });

    it('shows a count of 0 when there are no comments', async () => {
      renderList({ contextComments: [] });
      expect(
        screen.getByRole('heading', {
          name: 'Customer Reviews & Discussion (0)',
        })
      ).toBeInTheDocument();
      expect(screen.queryAllByTestId('comment-item')).toHaveLength(0);
      await waitFor(() => expect(comment_api.getAll).toHaveBeenCalled());
    });

    it('renders a CommentItem for each comment', async () => {
      renderList();
      expect(screen.getAllByTestId('comment-item')).toHaveLength(2);
      expect(
        screen.getByText('john@example.com: Great tomatoes!')
      ).toBeInTheDocument();
      expect(
        screen.getByText('anna@example.com: Could be cheaper.')
      ).toBeInTheDocument();
      await waitFor(() => expect(comment_api.getAll).toHaveBeenCalled());
    });
  });

  describe('comment form visibility', () => {
    it('shows the form when the user is not the owner', async () => {
      renderList({ isOwner: false });
      expect(
        screen.getByPlaceholderText(/write a comment or ask a question/i)
      ).toBeInTheDocument();
      expect(
        screen.getByRole('button', { name: 'Post Comment' })
      ).toBeInTheDocument();
      await waitFor(() => expect(comment_api.getAll).toHaveBeenCalled());
    });

    it('hides the form when the user is the owner', async () => {
      renderList({ isOwner: true });
      expect(
        screen.queryByPlaceholderText(/write a comment or ask a question/i)
      ).not.toBeInTheDocument();
      expect(
        screen.queryByRole('button', { name: 'Post Comment' })
      ).not.toBeInTheDocument();
      await waitFor(() => expect(comment_api.getAll).toHaveBeenCalled());
    });
  });

  describe('posting a comment', () => {
    const submitComment = async (text) => {
      const u = userEvent.setup();
      await u.type(
        screen.getByPlaceholderText(/write a comment or ask a question/i),
        text
      );
      await u.click(screen.getByRole('button', { name: 'Post Comment' }));
    };

    it('creates the comment with the form text, product and user data', async () => {
      renderList({ productId: 42 });
      await submitComment('Nice product');

      await waitFor(() => expect(comment_api.create).toHaveBeenCalledTimes(1));
      expect(comment_api.create).toHaveBeenCalledWith({
        comment: 'Nice product',
        product_id: 42,
        email: 'me@example.com',
        user_id: 'u1',
      });
    });

    it('reloads the comments and dispatches them after creating', async () => {
      const updated = [
        ...comments,
        { comment_id: 3, email: 'me@example.com', comment: 'Nice product' },
      ];
      comment_api.getAll
        .mockResolvedValueOnce(comments) // initial load
        .mockResolvedValueOnce(updated); // reload after create

      renderList({ productId: 42 });
      await submitComment('Nice product');

      await waitFor(() => expect(comment_api.getAll).toHaveBeenCalledTimes(2));
      await waitFor(() =>
        expect(dispatch).toHaveBeenLastCalledWith({
          type: 'SET_COMMENTS',
          payload: updated,
        })
      );
      expect(toast.error).not.toHaveBeenCalled();
    });

    it('shows a toast error and does not reload when creating fails', async () => {
      comment_api.create.mockRejectedValue(new Error('Create failed'));

      renderList();
      await submitComment('Nice product');

      await waitFor(() =>
        expect(toast.error).toHaveBeenCalledWith('Create failed')
      );
      // only the initial load, no reload after the failed create
      expect(comment_api.getAll).toHaveBeenCalledTimes(1);
    });

    it('sends undefined email and user_id when no user is logged in', async () => {
      useAuth.mockReturnValue({ user: null });

      renderList({ productId: 42 });
      await submitComment('Anonymous comment');

      await waitFor(() =>
        expect(comment_api.create).toHaveBeenCalledWith({
          comment: 'Anonymous comment',
          product_id: 42,
          email: undefined,
          user_id: undefined,
        })
      );
    });
  });
});