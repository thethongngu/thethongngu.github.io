export type Collection = 'posts' | 'notes';

export interface PostSummary {
  title: string;
  description?: string;
  isoDate: string;
  date: string;
  slug: string;
}

export interface Post extends PostSummary {
  content: string;
}
