'use client';

import React, { useState, useEffect } from 'react';

interface BlogCardProps {
  id: string;
  title: string;
  excerpt: string;
  author: string;
  date: Date;
  tags?: string[];
  viewCount?: number;
}

/**
 * BlogCard Component
 * Displays a single blog post card
 */
export function BlogCard({
  id,
  title,
  excerpt,
  author,
  date,
  tags = [],
  viewCount = 0,
}: BlogCardProps) {
  const [isHovered, setIsHovered] = useState(false);

  // FIXME: Date formatting should use a locale-aware library
  const formattedDate = new Date(date).toLocaleDateString();

  // TODO: Add click tracking for analytics
  // BUG: onClick handler not implemented
  const handleClick = () => {
    // HACK: Should navigate using Next.js router
    console.log(`Clicked post ${id}`);
    // NOTE: Should track user engagement metrics here
  };

  // OPTIMIZE: Memoize expensive computations
  const truncatedExcerpt = excerpt.length > 150 
    ? excerpt.substring(0, 150) + '...' 
    : excerpt;

  return (
    <div
      className="border rounded-lg p-4 hover:shadow-lg transition"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      onClick={handleClick}
      role="article"
      // FIXME: Missing proper ARIA labels
      // TODO: Add keyboard navigation support
    >
      <h3 className="text-xl font-bold mb-2 line-clamp-2">{title}</h3>
      
      <p className="text-gray-600 mb-3 line-clamp-3">
        {truncatedExcerpt}
      </p>

      <div className="flex justify-between items-center mb-3">
        <span className="text-sm text-gray-500">{formattedDate}</span>
        <span className="text-sm text-gray-500">
          {/* NOTE: ViewCount display needs improvement */}
          {/* OPTIMIZE: Should be fetched from cache */}
          👁 {viewCount}
        </span>
      </div>

      {/* TODO: Add tag filtering functionality */}
      {tags.length > 0 && (
        <div className="flex gap-2 flex-wrap mb-3">
          {tags.slice(0, 3).map((tag) => (
            <span
              key={tag}
              className="text-xs bg-blue-100 text-blue-800 px-2 py-1 rounded"
              // BUG: Tags should be clickable links to filter
            >
              {tag}
            </span>
          ))}
          {tags.length > 3 && (
            <span className="text-xs text-gray-500">+{tags.length - 3}</span>
          )}
        </div>
      )}

      <div className="text-sm text-gray-500">
        By <span className="font-semibold">{author}</span>
        {/* FIXME: Author should be clickable to view profile */}
      </div>

      {isHovered && (
        // HACK: Show read more on hover - should be visible always
        <p className="mt-2 text-blue-600 text-sm">Read more →</p>
      )}
    </div>
  );
}
