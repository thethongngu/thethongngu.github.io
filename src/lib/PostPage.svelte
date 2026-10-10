<script lang="ts">
  import type { Post } from "#lib/post.ts";

  let { post }: { post: Post } = $props();
  let showContents = $derived(post.headings.length >= 3);
</script>

<svelte:head>
  <title>{post.title} · thethongngu</title>
  <meta property="og:title" content={post.title} />
  <meta property="og:type" content="article" />
  {#if post.description}
    <meta name="description" content={post.description} />
    <meta property="og:description" content={post.description} />
  {/if}
  {#if showContents}
    <script src="/toc.js" defer></script>
  {/if}
</svelte:head>

<main class:has-contents={showContents}>
  <article>
    <header>
      <h1>{post.title}</h1>
      <time datetime={post.date}>{post.date}</time>
    </header>
    {#if showContents}
      <nav class="contents" aria-labelledby="contents-title">
        <p id="contents-title">Contents</p>
        <ol>
          {#each post.headings as heading}
            <li><a href="#{heading.id}">{@html heading.html}</a></li>
          {/each}
        </ol>
      </nav>
    {/if}
    <div class="content">
      {@html post.content}
    </div>
    <footer>
      <a href="/">← All posts</a>
    </footer>
  </article>
</main>

<style>
  main {
    --contents-width: 12rem;
    --contents-gap: 2.5rem;
  }

  header {
    margin-bottom: 2rem;
  }

  h1 {
    margin-bottom: 0;
  }

  time {
    display: block;
    margin-top: 0.25rem;
    font-size: 0.85rem;
    color: var(--color-text-muted);
  }

  .contents {
    margin-bottom: 2.5rem;
    font-size: 0.85rem;
    line-height: 1.4;
  }

  .contents p {
    margin: 0 0 0.5rem;
    font-weight: 600;
    color: var(--color-text-muted);
  }

  .contents ol {
    margin: 0;
    padding: 0;
    list-style: none;
    border-left: 1px solid var(--color-border);
  }

  .contents a {
    display: block;
    margin-left: -1px;
    padding: 0.25rem 0 0.25rem 0.85rem;
    border-left: 2px solid transparent;
    color: var(--color-text-muted);
  }

  .contents a:hover {
    color: var(--color-text);
  }

  .contents :global(a[aria-current]) {
    border-left-color: var(--color-accent);
    color: var(--color-text);
  }

  @media (min-width: 78em) {
    main.has-contents {
      max-width: calc(var(--text-width) + 2 * (var(--contents-width) + var(--contents-gap)));
    }

    .has-contents article {
      display: grid;
      grid-template-columns: var(--contents-width) minmax(0, 1fr) var(--contents-width);
      grid-template-areas:
        ". header ."
        "contents content ."
        "contents footer .";
      column-gap: var(--contents-gap);
    }

    .has-contents header {
      grid-area: header;
    }

    .has-contents .contents {
      grid-area: contents;
      position: sticky;
      top: 2rem;
      align-self: start;
      max-height: calc(100vh - 4rem);
      overflow-y: auto;
      margin-bottom: 0;
    }

    .has-contents .content {
      grid-area: content;
    }

    .has-contents footer {
      grid-area: footer;
    }
  }

  footer {
    margin-top: 3rem;
    padding-top: 1.25rem;
    border-top: 1px solid var(--color-border);
    font-size: 0.9rem;
  }

  footer a {
    color: var(--color-text-muted);
  }

  footer a:hover {
    color: var(--color-accent);
  }

  .content :global(h2) {
    margin: 2rem 0 0.5rem;
    font-size: 1.2rem;
    scroll-margin-top: 1.5rem;
  }

  .content :global(h3) {
    margin: 1.5rem 0 0.5rem;
    font-size: 1.05rem;
  }

  .content :global(ul),
  .content :global(ol) {
    margin: 0 0 1.25rem;
    padding-left: 1.5rem;
  }

  .content :global(li) {
    margin-bottom: 0.35rem;
  }

  .content :global(li > ul),
  .content :global(li > ol) {
    margin: 0.35rem 0 0;
  }

  .content :global(a) {
    text-decoration: underline;
    text-decoration-color: color-mix(in srgb, var(--color-accent) 40%, transparent);
    text-underline-offset: 0.15em;
  }

  .content :global(a:hover) {
    text-decoration-color: currentColor;
  }

  .content :global(.footnotes) {
    font-size: 0.85rem;
    color: var(--color-text-muted);
  }

  .content :global(.footnotes h4) {
    color: var(--color-text);
  }

  .content :global(.footnotes ol) {
    padding-left: 1.25rem;
  }

  .content :global(sup a) {
    font-size: 0.7rem;
    text-decoration: none;
  }
</style>
