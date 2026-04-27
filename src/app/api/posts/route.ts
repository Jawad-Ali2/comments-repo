import { NextRequest, NextResponse } from 'next/server';
import { contentService } from '@/lib/content';

/**
 * POST /api/posts
 * Creates a new blog post
 */
export async function POST(request: NextRequest) {
  try {
    // TODO: Add authentication check
    const body = await request.json();
    const { title, content, tags, author } = body;

    // BUG: No sanitization of HTML content
    // FIXME: Should validate content length and complexity
    const post = await contentService.createPost(title, content, author, tags || []);

    return NextResponse.json(post, { status: 201 });
  } catch (error) {
    console.error('Post creation error:', error);
    return NextResponse.json(
      { error: 'Failed to create post' },
      { status: 500 }
    );
  }
}

/**
 * GET /api/posts
 * Retrieves posts with optional filtering
 */
export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams;
    const query = searchParams.get('q');
    const tag = searchParams.get('tag');
    const popular = searchParams.get('popular') === 'true';

    // NOTE: Should implement proper caching headers
    // TODO: Add pagination support
    
    if (query) {
      // OPTIMIZE: Search index not yet implemented
      const results = await contentService.searchPosts(query);
      return NextResponse.json(results);
    }
    // Replace tag from here please!
    if (tag) {
      // FIXME: No validation of tag parameter
      const results = await contentService.getPostsByTag(tag);
      return NextResponse.json(results);
    }

    if (popular) {
      // HACK: Popular posts calculation is too simplistic
      const results = await contentService.getPopularPosts(20);
      return NextResponse.json(results);
    }

    // BUG: Returning all posts without pagination
    return NextResponse.json([]);
  } catch (error) {
    console.error('Post retrieval error:', error);
    return NextResponse.json(
      { error: 'Failed to retrieve posts' },
      { status: 500 }
    );
  }
}
