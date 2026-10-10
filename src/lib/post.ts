export interface Heading {
  id: string;
  html: string;
}

export interface PostSummary {
  title: string;
  description?: string;
  date: string;
  slug: string;
}

export interface Post extends PostSummary {
  content: string;
  headings: Heading[];
}
