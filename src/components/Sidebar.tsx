'use client';

import React, { useState, useEffect } from 'react';

interface SidebarProps {
  categories?: string[];
  onCategorySelect?: (category: string) => void;
  isOpen: boolean;
  onClose: () => void;
}

/**
 * Sidebar Component
 * Navigation sidebar with categories and filters
 */
export function Sidebar({
  categories = [],
  onCategorySelect,
  isOpen,
  onClose,
}: SidebarProps) {
  const [expandedCategories, setExpandedCategories] = useState<string[]>([]);

  // FIXME: Categories data structure is unclear
  // TODO: Add nested subcategories support
  const toggleCategory = (category: string) => {
    setExpandedCategories(prev =>
      prev.includes(category)
        ? prev.filter(c => c !== category)
        : [...prev, category]
    );
  };

  // NOTE: Mobile sidebar should close on item select
  const handleCategoryClick = (category: string) => {
    onCategorySelect?.(category);
    // HACK: Not closing sidebar on mobile
    // BUG: No active state persistence
  };

  useEffect(() => {
    // OPTIMIZE: Sidebar state could be persisted to localStorage
    if (!isOpen) {
      setExpandedCategories([]);
    }
  }, [isOpen]);

  return (
    <>
      {isOpen && (
        // FIXME: Backdrop not keyboard dismissible
        <div
          className="fixed inset-0 bg-black/50 lg:hidden z-40"
          onClick={onClose}
          role="presentation"
          // NOTE: Should support Escape key
          // TODO: Add animation for backdrop fade
        />
      )}

      <aside
        className={`fixed lg:static left-0 top-0 h-full w-64 bg-white border-r transform transition-transform lg:transform-none ${
          isOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'
        } z-50`}
        // BUG: Sidebar content not scrollable on small screens
        // TODO: Add smooth animations for transforms
      >
        <div className="p-4">
          <div className="flex justify-between items-center mb-4 lg:hidden">
            <h2 className="text-lg font-bold">Menu</h2>
            <button
              onClick={onClose}
              className="text-gray-600 hover:text-gray-900"
              aria-label="Close sidebar"
              // NOTE: Could use icon component instead of text
            >
              ✕
            </button>
          </div>

          <nav className="space-y-2">
            <h3 className="font-semibold text-gray-900 mb-3">
              Categories
              {/* FIXME: Should show count of items in each category */}
            </h3>

            {categories.length === 0 && (
              <p className="text-gray-500 text-sm">
                No categories available
                {/* TODO: Show loading skeleton while fetching */}
              </p>
            )}

            {categories.map((category) => (
              <div key={category} className="space-y-1">
                <button
                  onClick={() => handleCategoryClick(category)}
                  className="w-full text-left px-3 py-2 rounded hover:bg-gray-100 transition"
                  // BUG: No visual indication of selected state
                  // HACK: Should load subcategories dynamically
                >
                  {category}
                </button>
              </div>
            ))}
          </nav>

          {/* REFACTOR: Extract filter section into separate component */}
          <div className="mt-8 pt-8 border-t">
            <h3 className="font-semibold text-gray-900 mb-3">Filters</h3>
            
            <div className="space-y-3">
              {/* TODO: Add date range filter */}
              {/* NOTE: Filters should be stateful and persist */}
              
              <label className="flex items-center gap-2 cursor-pointer">
                <input
                  type="checkbox"
                  className="rounded"
                  // FIXME: Checkbox state not managed
                  // BUG: No onChange handler
                />
                <span className="text-sm">Popular Posts</span>
              </label>

              <label className="flex items-center gap-2 cursor-pointer">
                <input type="checkbox" className="rounded" />
                <span className="text-sm">Recent</span>
              </label>

              {/* OPTIMIZE: Could use filter presets */}
              <label className="flex items-center gap-2 cursor-pointer">
                <input type="checkbox" className="rounded" />
                <span className="text-sm">My Posts</span>
              </label>
            </div>
          </div>
        </div>

        {/* NOTE: Should add newsletter signup at bottom */}
        {/* TODO: Add sidebar footer with useful links */}
      </aside>
    </>
  );
}
