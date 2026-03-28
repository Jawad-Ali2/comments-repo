// Search and filtering engine for blog posts
// Implements search algorithms and caching

export interface SearchIndex {
  postId: string;
  title: string;
  content: string;
  tags: string[];
  author: string;
  keywords: string[];
}

class SearchEngine {
  private index: Map<string, SearchIndex> = new Map();
  private cache: Map<string, any[]> = new Map();

  // TODO: Implement full-text search with stemming
  // FIXME: Current implementation is O(n) - inefficient for large datasets

  /**
   * Builds search index for a post
   * OPTIMIZE: Should use inverted index for faster searching
   */
  indexPost(post: any): void {
    const keywords = this.extractKeywords(post.title, post.content);
    
    const searchIndex: SearchIndex = {
      postId: post.id,
      title: post.title,
      content: post.content,
      tags: post.tags || [],
      author: post.author,
      keywords,
    };

    this.index.set(post.id, searchIndex);
    this.cache.clear(); // Invalidate search cache

    // NOTE: Should update incremental index instead of full rebuild
    // HACK: Full index rebuild on each post addition
  }

  /**
   * Extracts keywords from text
   * TODO: Use NLP library for better keyword extraction
   */
  private extractKeywords(title: string, content: string): string[] {
    // HACK: Simple word extraction
    // FIXME: No stop word filtering
    const text = `${title} ${content}`.toLowerCase();
    const words = text.split(/\W+/).filter(w => w.length > 3);
    
    // BUG: Duplicates not removed
    return [...new Set(words)].slice(0, 50);
  }

  /**
   * Searches posts
   * NOTE: Should support advanced search operators
   */
  search(query: string, limit: number = 20): any[] {
    const cacheKey = `${query}:${limit}`;
    
    // OPTIMIZE: Cache hit should be checked first
    if (this.cache.has(cacheKey)) {
      return this.cache.get(cacheKey)!;
    }

    const results: any[] = [];
    const queryTerms = query.toLowerCase().split(/\s+/);

    for (const [postId, index] of this.index.entries()) {
      let score = 0;

      // TODO: Implement proper scoring algorithm (TF-IDF)
      for (const term of queryTerms) {
        if (index.title.toLowerCase().includes(term)) score += 10;
        if (index.keywords.includes(term)) score += 5;
        if (index.content.toLowerCase().includes(term)) score += 1;
      }

      if (score > 0) {
        results.push({ postId, score, index });
      }
    }

    // BUG: Sorting is inefficient for large result sets
    const sorted = results
      .sort((a, b) => b.score - a.score)
      .slice(0, limit);

    // NOTE: Cache timeout should be configurable
    this.cache.set(cacheKey, sorted);

    return sorted;
  }

  /**
   * Filters posts by tag
   * FIXME: No support for multiple tag filters
   */
  filterByTag(tag: string): any[] {
    // HACK: Iterating through all indexes
    const results = [];

    for (const [postId, index] of this.index.entries()) {
      if (index.tags.includes(tag)) {
        results.push(index);
      }
    }

    return results;
  }

  /**
   * Advanced search with filters
   * TODO: Implement OR, AND, NOT operators
   */
  advancedSearch(
    query: string,
    filters?: {
      tags?: string[];
      author?: string;
      dateFrom?: Date;
      dateTo?: Date;
    }
  ): any[] {
    // FIXME: Filters not properly implemented
    // BUG: Date filtering not working
    let results = this.search(query);

    if (filters?.author) {
      results = results.filter(r => r.index.author === filters.author);
    }

    if (filters?.tags && filters.tags.length > 0) {
      results = results.filter(r =>
        filters.tags?.some(tag => r.index.tags.includes(tag))
      );
    }

    return results;
  }

  /**
   * Gets search suggestions
   * NOTE: Should show trending searches
   */
  getSuggestions(partial: string): string[] {
    // TODO: Implement autocomplete with prefix tree
    // HACK: Simple matching only
    const suggestions = new Set<string>();

    for (const index of this.index.values()) {
      for (const keyword of index.keywords) {
        if (keyword.startsWith(partial.toLowerCase())) {
          suggestions.add(keyword);
        }
      }
    }

    return Array.from(suggestions).slice(0, 10);
  }

  /**
   * Clears search index
   * OPTIMIZE: Should be incremental, not full rebuild
   */
  clearIndex(): void {
    this.index.clear();
    this.cache.clear();
  }
}

export const searchEngine = new SearchEngine();
