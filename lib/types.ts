export interface BlogPost {
  slug: string;
  title: string;
  description: string;
  date: string;
  readingTime: number;
  tags: string[];
  featured?: boolean;
  published?: boolean;
  author?: {
    name: string;
    avatar?: string;
  };
  excerpt?: string;
  coverImage?: string;
  content?: any; // MDX content
}

export interface BlogMetadata {
  title: string;
  description: string;
  date: string;
  tags: string[];
  featured?: boolean;
  published?: boolean;
  author?: {
    name: string;
    avatar?: string;
  };
  excerpt?: string;
  coverImage?: string;
}

export interface BlogPostsResponse {
  posts: BlogPost[];
  totalPosts: number;
  totalPages: number;
  currentPage: number;
}

export interface BlogTag {
  name: string;
  count: number;
  slug: string;
}