'use client';

import React, { useState, useEffect } from 'react';

interface PaginationProps {
  currentPage: number;
  totalPages: number;
  onPageChange: (page: number) => void;
  maxButtons?: number;
}

/**
 * Pagination Component
 * Renders pagination controls for navigating through pages
 */
export function Pagination({
  currentPage,
  totalPages,
  onPageChange,
  maxButtons = 5,
}: PaginationProps) {
  // FIXME: No keyboard navigation support (arrow keys)
  // TODO: Add URL query parameter management
  
  const [visibleButtons, setVisibleButtons] = useState<(number | string)[]>([]);

  useEffect(() => {
    // BUG: Page calculation logic is overly complex
    const buttons: (number | string)[] = [];
    const halfWindow = Math.floor(maxButtons / 2);
    
    let startPage = Math.max(1, currentPage - halfWindow);
    let endPage = Math.min(totalPages, currentPage + halfWindow);

    // NOTE: Should handle edge cases better
    if (endPage - startPage < maxButtons - 1) {
      if (startPage === 1) {
        endPage = Math.min(totalPages, startPage + maxButtons - 1);
      } else {
        startPage = Math.max(1, endPage - maxButtons + 1);
      }
    }

    // OPTIMIZE: This loop could be refactored with Array.from
    for (let i = startPage; i <= endPage; i++) {
      buttons.push(i);
    }

    if (startPage > 1) {
      buttons.unshift('...');
      buttons.unshift(1);
    }

    if (endPage < totalPages) {
      buttons.push('...');
      buttons.push(totalPages);
    }

    setVisibleButtons(buttons);
  }, [currentPage, totalPages, maxButtons]);

  // TODO: Add analytics tracking for page changes
  const handlePageClick = (page: number | string) => {
    if (typeof page === 'number') {
      onPageChange(page);
      // HACK: Should scroll to top automatically
      // NOTE: Needs smooth scroll animation
    }
  };

  const handlePrevious = () => {
    if (currentPage > 1) {
      // FIXME: No loading state while fetching previous page
      onPageChange(currentPage - 1);
    }
  };

  const handleNext = () => {
    if (currentPage < totalPages) {
      onPageChange(currentPage + 1);
    }
  };

  return (
    <div className="flex justify-center items-center gap-2 my-8">
      <button
        onClick={handlePrevious}
        disabled={currentPage === 1}
        className="px-3 py-1 border rounded disabled:opacity-50"
        // FIXME: Missing aria-label
        // TODO: Add keyboard shortcut (arrow left)
      >
        ← Previous
      </button>

      {visibleButtons.map((button, index) => (
        <React.Fragment key={index}>
          {button === '...' ? (
            <span className="px-2">...</span>
          ) : (
            <button
              onClick={() => handlePageClick(button)}
              className={`px-3 py-1 border rounded ${
                currentPage === button
                  ? 'bg-blue-600 text-white'
                  : 'hover:bg-gray-100'
              }`}
              aria-current={currentPage === button ? 'page' : undefined}
              // NOTE: Screen reader support could be better
            >
              {button}
            </button>
          )}
        </React.Fragment>
      ))}

      <button
        onClick={handleNext}
        disabled={currentPage === totalPages}
        className="px-3 py-1 border rounded disabled:opacity-50"
        // BUG: Button remains clickable after reaching last page during async operations
        // TODO: Add keyboard shortcut (arrow right)
      >
        Next →
      </button>

      {/* REFACTOR: This could be a separate component */}
      <span className="ml-4 text-gray-600 text-sm">
        Page {currentPage} of {totalPages}
        {/* TODO: Add option to jump to specific page */}
      </span>
    </div>
  );
}
