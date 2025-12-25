import { marked } from 'marked';

export interface Post {
  title: string;
  date: string;
  slug: string;
  content: string;
}

interface PostModule {
  default: string;
}

function parseFrontmatter(content: string): { meta: Record<string, string>; body: string } {
  const match = content.match(/^---\n([\s\S]*?)\n---\n([\s\S]*)$/);
  if (!match) {
    return { meta: {}, body: content };
  }

  const meta: Record<string, string> = {};
  match[1].split('\n').forEach(line => {
    const [key, ...rest] = line.split(':');
    if (key && rest.length) {
      meta[key.trim()] = rest.join(':').trim();
    }
  });

  return { meta, body: match[2] };
}

function formatDate(dateStr: string): string {
  const date = new Date(dateStr);
  return date.toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric'
  });
}

export async function loadPosts(): Promise<Post[]> {
  const modules = import.meta.glob<PostModule>('../posts/*.md', {
    query: '?raw',
    import: 'default'
  });

  const posts: Post[] = [];

  for (const path in modules) {
    const raw = await modules[path]() as unknown as string;
    const { meta, body } = parseFrontmatter(raw);
    const slug = path.replace('../posts/', '').replace('.md', '');

    posts.push({
      title: meta.title || slug,
      date: formatDate(meta.date || ''),
      slug,
      content: await marked(body)
    });
  }

  return posts.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
}
