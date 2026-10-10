import { error } from '@sveltejs/kit';
import { Marked } from 'marked';
import { markedHighlight } from 'marked-highlight';
import hljs from 'highlight.js';
import type { Heading, Post, PostSummary } from '#lib/post.ts';

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

const sources = import.meta.glob<string>('../../posts/*.md', { query: '?raw', import: 'default', eager: true });

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

function parseDate(rawDate: string, slug: string): string {
  const date = new Date(rawDate);
  if (Number.isNaN(date.getTime())) {
    throw new Error(`Post "${slug}" has a missing or invalid date: "${rawDate}"`);
  }
  return date.toISOString().slice(0, 10);
}

function slugify(text: string): string {
  const slug = text
    .toLowerCase()
    .replace(/&[^;]+;/g, '')
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-|-$/g, '');
  return slug || 'section';
}

function claimUniqueId(base: string, usedIds: Set<string>): string {
  let id = base;
  for (let suffix = 2; usedIds.has(id); suffix++) {
    id = `${base}-${suffix}`;
  }
  usedIds.add(id);
  return id;
}

function addSectionIds(html: string): { html: string; headings: Heading[] } {
  const headings: Heading[] = [];
  const usedIds = new Set<string>();
  const withIds = html.replace(/<h2>([\s\S]*?)<\/h2>/g, (_, inner: string) => {
    const text = inner.replace(/<[^>]+>/g, '');
    const id = claimUniqueId(slugify(text), usedIds);
    headings.push({ id, html: text });
    return `<h2 id="${id}">${inner}</h2>`;
  });
  return { html: withIds, headings };
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
  const { html, headings } = addSectionIds(marked.parse(processFootnotes(body), { async: false }));

  return {
    title: meta.title || slug,
    description: meta.description,
    date: parseDate(meta.date ?? '', slug),
    slug,
    content: html,
    headings
  };
}

const posts: Post[] = Object.entries(sources)
  .map(([path, raw]) => parsePost(path, raw))
  .sort((a, b) => b.date.localeCompare(a.date));

export function listPosts(): PostSummary[] {
  return posts.map(({ content: _, headings: __, ...summary }) => summary);
}

export function loadPost(slug: string): Post {
  const post = posts.find(p => p.slug === slug);
  if (!post) error(404, 'Post not found');
  return post;
}
