import React from 'react';
import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import CommentItem from './CommentItem';

const commentData = {
  comment_id: 7,
  email: 'john@example.com',
  comment: 'Great tomatoes, very fresh!',
};

const renderComment = (props = commentData) =>
  render(<CommentItem {...props} />);

describe('CommentItem', () => {
  it('renders the author email', () => {
    renderComment();
    expect(screen.getByText('john@example.com')).toBeInTheDocument();
  });

  it('renders the comment text', () => {
    renderComment();
    expect(
      screen.getByText('Great tomatoes, very fresh!')
    ).toBeInTheDocument();
  });

  it('puts the email in the author span and the text in the comment paragraph', () => {
    renderComment();
    expect(screen.getByText('john@example.com')).toHaveClass('comment-author');
    expect(screen.getByText('Great tomatoes, very fresh!')).toHaveClass(
      'comment-text'
    );
  });

  it('has the expected card structure', () => {
    const { container } = renderComment();
    const card = container.firstChild;

    expect(card).toHaveClass('comment-card');
    expect(card.querySelector('.comment-content')).toBeInTheDocument();
    expect(
      card.querySelector('.comment-content > .comment-header')
    ).toBeInTheDocument();
  });

  it('renders different data correctly', () => {
    renderComment({
      comment_id: 8,
      email: 'anna@example.com',
      comment: 'Could be cheaper.',
    });
    expect(screen.getByText('anna@example.com')).toBeInTheDocument();
    expect(screen.getByText('Could be cheaper.')).toBeInTheDocument();
  });

  it('renders without crashing when the comment text is empty', () => {
    const { container } = renderComment({ ...commentData, comment: '' });
    expect(container.querySelector('.comment-text')).toBeEmptyDOMElement();
  });
});