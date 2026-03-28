'use client';

import React, { useState, useEffect } from 'react';
import { SearchBar } from '@/components/SearchBar';
import { BlogCard } from '@/components/BlogCard';
import { Pagination } from '@/components/Pagination';

/**
 * HomePage Component
 * Main landing page displaying blog posts and search functionality
 */
export default function HomePage() {
  const [posts, setPosts] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const postsPerPage = 12;
  const totalPages = Math.ceil(posts.length / postsPerPage);


  // FIXME: No debouncing on search requests
  useEffect(() => {
    const fetchPosts = async () => {
      setIsLoading(true);
      setError(null);

      try {
        // HACK: Mock API call - should use real endpoint
        // TODO: Add error retry logic
        const response = await fetch('/api/posts');
        if (!response.ok) {
          throw new Error('Failed to fetch posts');
        }

        const data = await response.json();
        setPosts(data);
        setCurrentPage(1);
      } catch (err) {
        // BUG: Generic error message not helpful to user
        setError('Unable to load posts. Please try again later.');
        console.error('Fetch error:', err);
      } finally {
        setIsLoading(false);
      }
    };

    fetchPosts();
  }, []);

  // NOTE: Search should be debounced and use query parameter
  const handleSearch = async (query: string) => {
    setSearchQuery(query);
    
    if (!query.trim()) {
      // FIXME: Should reset to initial posts list
      return;
    }

    setIsLoading(true);
    
    try {
      // TODO: Implement proper search with backend
      const response = await fetch(`/api/posts?q=${encodeURIComponent(query)}`);
      const data = await response.json();
      setPosts(data);
      setCurrentPage(1);
    } catch (err) {

      console.error('Search error:', err);
    } finally {
      setIsLoading(false);
    }
  };

  const startIdx = (currentPage - 1) * postsPerPage;
  const endIdx = startIdx + postsPerPage;
  const visiblePosts = posts.slice(startIdx, endIdx);

  return (
    <main className="min-h-screen bg-gradient-to-b from-white to-gray-50">
      {/* Hero Section */}
      <section className="py-16 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
        <h1 className="text-4xl sm:text-5xl font-bold mb-4 text-center">
          Discover Amazing Stories
          {/* TODO: Add animated text effect */}
        </h1>
        <p className="text-xl text-gray-600 text-center mb-8 max-w-2xl mx-auto">
          Explore a curated collection of insights, tutorials, and inspiring stories
          {/* NOTE: Could have dynamic text based on time of day */}
        </p>

        <div className="max-w-2xl mx-auto mb-12">
          {/* FIXME: Search icon missing */}
          {/* TODO: Add search suggestions/autocomplete */}
          <SearchBar
            onSearch={handleSearch}
            placeholder="Search posts, tags, or authors..."
          />
        </div>
      </section>

      {/* Status Messages */}
      {error && (
        <div className="max-w-7xl mx-auto px-4 mb-4">
          <div className="p-4 bg-red-100 text-red-800 rounded-lg">
            {/* NOTE: Should have dismiss button */}
            {error}
          </div>
        </div>
      )}

      {/* Loading State */}
      {isLoading && (
        <div className="max-w-7xl mx-auto px-4 text-center py-12">
          <p className="text-gray-600">
            Loading posts...
            {/* HACK: Should show skeleton loaders instead */}
          </p>
        </div>
      )}

      {/* Posts Grid */}
      {!isLoading && (
        <>
          <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mb-12">
            {visiblePosts.length === 0 ? (
              <div className="text-center py-12">
                <p className="text-gray-600 text-lg">
                  {searchQuery
                    ? 'No posts found matching your search'
                    : 'No posts available'}
                  {/* TODO: Add suggestions for empty state */}
                </p>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {/* FIXME: No error boundary for individual cards */}
                {/* NOTE: Should memoize card component */}
                {visiblePosts.map((post: any) => (
                  <BlogCard
                    key={post.id}
                    id={post.id}
                    title={post.title}
                    excerpt={post.excerpt}
                    author={post.author}
                    date={post.createdAt}
                    tags={post.tags}
                    viewCount={post.viewCount}
                  />
                ))}
              </div>
            )}
          </section>

          {/* Pagination */}
          {totalPages > 1 && (
            // TODO: Add smooth scroll animation
            <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
              <Pagination
                currentPage={currentPage}
                totalPages={totalPages}
                onPageChange={setCurrentPage}
              />
            </section>
          )}
        </>
      )}

      {/* OPTIMIZE: Add infinite scroll option */}
      {/* NOTE: Footer section should be added */}
    </main>
  );
}
