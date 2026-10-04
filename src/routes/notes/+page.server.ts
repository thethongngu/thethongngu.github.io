import { listPosts } from '#lib/server/posts.ts';

export const load = () => ({ posts: listPosts('notes') });
