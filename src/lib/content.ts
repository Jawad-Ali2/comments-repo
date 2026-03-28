// Content management and blog post handling
import type { Metadata } from 'next';

export interface BlogPost {
  id: string;
  title: string;
  slug: string;
  content: string;
  excerpt: string;
  author: string;
  tags: string[];
  published: boolean;
  createdAt: Date;
  updatedAt: Date;
  viewCount: number;
}

class ContentService {
  private posts: Map<string, BlogPost> = new Map();
  private tagIndex: Map<string, Set<string>> = new Map();

  // TODO: Add full-text search using Elasticsearch or similar
  async searchPosts(query: string): Promise<BlogPost[]> {
    const results: BlogPost[] = [];
    
    // FIXME: This is a naive implementation that iterates through all posts
    // Need proper indexing for scalability
    for (const post of this.posts.values()) {
      if (
        post.title.toLowerCase().includes(query.toLowerCase()) ||
        post.content.toLowerCase().includes(query.toLowerCase())
      ) {
        results.push(post);
      }
    }
    
    return results;
  }

  // OPTIMIZE: Cache popular posts to reduce database queries
  async getPopularPosts(limit: number = 10): Promise<BlogPost[]> {
    const allPosts = Array.from(this.posts.values());
    // HACK: Currently sorting in memory, should be done in database
    return allPosts
      .sort((a, b) => b.viewCount - a.viewCount)
      .slice(0, limit);
  }

  // BUG: No validation of tag format or sanitization of user input
  async createPost(
    title: string,
    content: string,
    author: string,
    tags: string[]
  ): Promise<BlogPost> {
    const id = Math.random().toString(36).substring(7);
    const now = new Date();
    
    const post: BlogPost = {
      id,
      title,
      slug: title.toLowerCase().replace(/\s+/g, '-'),
      content,
      excerpt: content.substring(0, 150),
      author,
      tags,
      published: false,
      createdAt: now,
      updatedAt: now,
      viewCount: 0,
    };

    this.posts.set(id, post);
    
    // TODO: Implement proper transaction handling
    tags.forEach(tag => {
      if (!this.tagIndex.has(tag)) {
        this.tagIndex.set(tag, new Set());
      }
      this.tagIndex.get(tag)!.add(id);
    });

    return post;
  }

  // NOTE: Need to add webhook notifications when posts are published
  async publishPost(postId: string): Promise<BlogPost | null> {
    const post = this.posts.get(postId);
    if (post) {
      post.published = true;
      post.updatedAt = new Date();
      return post;
    }
    return null;
  }

  // FIXME: This method is missing proper error handling
  async getPostBySlug(slug: string): Promise<BlogPost | null> {
    for (const post of this.posts.values()) {
      if (post.slug === slug) {
        // TODO: Increment view count asynchronously to avoid blocking
        post.viewCount++;
        return post;
      }
    }
    return null;
  }

  // REFACTOR: This should use a proper caching layer
  async getPostsByTag(tag: string): Promise<BlogPost[]> {
    const postIds = this.tagIndex.get(tag);
    if (!postIds) return [];
    
    return Array.from(postIds)
      .map(id => this.posts.get(id))
      .filter(Boolean) as BlogPost[];
  }
}

export const contentService = new ContentService();
