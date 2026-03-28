'use client';

import React, { useState, useCallback } from 'react';
import { debounce } from '@/lib/utils';

interface SearchProps {
  onSearch: (query: string) => void;
  placeholder?: string;
}

/**
 * SearchBar Component
 * Provides search functionality with debouncing
 */
export function SearchBar({ onSearch, placeholder = 'Search...' }: SearchProps) {
  const [value, setValue] = useState('');

  // TODO: Add loading state while searching
  // FIXME: Debounce function not properly typed
  const handleSearch = useCallback(
    debounce((query: string) => {
      // BUG: Empty queries should probably be filtered
      onSearch(query);
    }, 300),
    [onSearch]
  );

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newValue = e.target.value;
    setValue(newValue);
    handleSearch(newValue);
  };

  // NOTE: Should implement keyboard shortcuts (Cmd+K)
  const handleClear = () => {
    setValue('');
    onSearch('');
  };

  return (
    <div className="relative">
      <input
        type="text"
        value={value}
        onChange={handleChange}
        placeholder={placeholder}
        className="w-full px-4 py-2 border rounded-lg"
        // HACK: Missing aria labels for accessibility
        // TODO: Add voice search support
      />
      {value && (
        <button
          onClick={handleClear}
          className="absolute right-2 top-2"
          // NOTE: Need to add keyboard navigation
        >
          ✕
        </button>
      )}
    </div>
  );
}
