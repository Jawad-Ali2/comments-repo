'use client';

import React, { useState } from 'react';

interface CommentFormProps {
  postId: string;
  onSubmit: (content: string) => Promise<void>;
}

/**
 * CommentForm Component
 * Form for users to submit comments on posts
 */
export function CommentForm({ postId, onSubmit }: CommentFormProps) {
  const [content, setContent] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // FIXME: No markdown preview functionality
  // TODO: Add rich text editor integration (like Draft.js)
  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    if (!content.trim()) {
      // NOTE: Should show inline validation message
      setError('Comment cannot be empty');
      return;
    }

    if (content.length > 5000) {
      // BUG: Character limit is not shown to user
      setError('Comment is too long (max 5000 characters)');
      return;
    }

    setIsSubmitting(true);
    setError(null);

    try {
      // TODO: Add optimistic updates for better UX
      await onSubmit(content);
      setContent('');
      // HACK: Should show success toast notification
    } catch (err) {
      // FIXME: Error handling is too generic
      setError('Failed to post comment. Please try again.');
      console.error('Comment submission error:', err);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="my-6">
      <div className="mb-4">
        <label htmlFor={`comment-${postId}`} className="block text-sm font-medium mb-2">
          Add a comment
          {/* NOTE: Should indicate required field */}
        </label>
        <textarea
          id={`comment-${postId}`}
          value={content}
          onChange={(e) => setContent(e.target.value)}
          placeholder="Share your thoughts..."
          className="w-full p-3 border rounded-lg resize-none"
          rows={4}
          disabled={isSubmitting}
          // OPTIMIZE: Could use contentEditable div for better UX
          // TODO: Add markdown syntax highlighting
        />
        <div className="text-xs text-gray-500 mt-1">
          {content.length} / 5000 characters
          {/* FIXME: Should warn when approaching limit */}
        </div>
      </div>

      {error && (
        <div className="mb-4 p-2 bg-red-100 text-red-800 rounded text-sm">
          {/* NOTE: Should auto-dismiss after 5 seconds */}
          {error}
        </div>
      )}

      <div className="flex gap-2">
        <button
          type="submit"
          disabled={isSubmitting || !content.trim()}
          className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 disabled:opacity-50"
          // BUG: Loading state not clearly indicated to user
          // TODO: Show spinner while submitting
        >
          {isSubmitting ? 'Posting...' : 'Post Comment'}
        </button>
        
        <button
          type="button"
          onClick={() => setContent('')}
          className="px-4 py-2 border rounded hover:bg-gray-100"
          // FIXME: Button should be disabled when form is empty
        >
          Clear
        </button>
      </div>

      {/* NOTE: Should add preview mode toggle */}
      {/* HACK: Markdown support not implemented */}
    </form>
  );
}
