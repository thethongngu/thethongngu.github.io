import { error } from '@sveltejs/kit';
import { Marked } from 'marked';
import { markedHighlight } from 'marked-highlight';
import hljs from 'highlight.js';
import type { Collection, Post, PostSummary } from '#lib/post.ts';

const marked = new Marked(
  markedHighlight({
    langPrefix: 'hljs language-',
    highlight(code, lang) {
      if (lang && hljs.getLanguage(lang)) {
        return hljs.highlight(code, { language: lang }).value;
      }
      return hljs.highlightAuto(code).value;
    }
  })
);

const sources: Record<Collection, Record<string, string>> = {
  posts: import.meta.glob<string>('../../posts/*.md', { query: '?raw', import: 'default', eager: true }),
  notes: import.meta.glob<string>('../../notes/*.md', { query: '?raw', import: 'default', eager: true })
};

function parseFrontmatter(content: string): { meta: Record<string, string>; body: string } {
  const match = content.match(/^---\r?\n([\s\S]*?)\r?\n---\r?\n([\s\S]*)$/);
  if (!match) {
    return { meta: {}, body: content };
  }

  const meta: Record<string, string> = {};
  match[1].split(/\r?\n/).forEach(line => {
    const [key, ...rest] = line.split(':');
    if (key && rest.length) {
      meta[key.trim()] = rest.join(':').trim();
    }
  });

  return { meta, body: match[2] };
}

function formatDate(isoDate: string, slug: string): string {
  const date = new Date(isoDate);
  if (Number.isNaN(date.getTime())) {
    throw new Error(`Post "${slug}" has a missing or invalid date: "${isoDate}"`);
  }
  return date.toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
    timeZone: 'UTC'
  });
}

function processFootnotes(body: string): string {
  const defRegex = /^\[\^(\w+)\]:\s+(.+)$/gm;
  const refs: { id: string; text: string }[] = [];
  let match;
  while ((match = defRegex.exec(body)) !== null) {
    refs.push({ id: match[1], text: match[2] });
  }
  if (refs.length === 0) return body;

  let result = body.replace(defRegex, '').trimEnd();

  for (const ref of refs) {
    const inlineRegex = new RegExp(`\\[\\^${ref.id}\\]`, 'g');
    result = result.replace(inlineRegex, `<sup><a href="#fn-${ref.id}" id="fnref-${ref.id}">[${ref.id}]</a></sup>`);
  }

  result += '\n\n---\n\n<section class="footnotes">\n\n#### References\n\n<ol>\n';
  for (const ref of refs) {
    result += `<li id="fn-${ref.id}">${ref.text} <a href="#fnref-${ref.id}">↩</a></li>\n`;
  }
  result += '</ol>\n</section>\n';

  return result;
}

function parsePost(path: string, raw: string): Post {
  const { meta, body } = parseFrontmatter(raw);
  const slug = path.split('/').pop()!.replace(/\.md$/, '');
  const isoDate = meta.date ?? '';

  return {
    title: meta.title || slug,
    description: meta.description,
    isoDate,
    date: formatDate(isoDate, slug),
    slug,
    content: marked.parse(processFootnotes(body), { async: false })
  };
}

function parseCollection(files: Record<string, string>): Post[] {
  return Object.entries(files)
    .map(([path, raw]) => parsePost(path, raw))
    .sort((a, b) => b.isoDate.localeCompare(a.isoDate));
}

const collections: Record<Collection, Post[]> = {
  posts: parseCollection(sources.posts),
  notes: parseCollection(sources.notes)
};

export function listPosts(collection: Collection): PostSummary[] {
  return collections[collection].map(({ content: _, ...summary }) => summary);
}

export function loadPost(collection: Collection, slug: string): Post {
  const post = collections[collection].find(p => p.slug === slug);
  if (!post) error(404, 'Post not found');
  return post;
}
