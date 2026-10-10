import { loadPost } from '#lib/server/posts.ts';

export const load = ({ params }) => ({ post: loadPost(params.slug) });
