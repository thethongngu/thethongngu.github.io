<script lang="ts">
  import type { Post } from "#lib/post.ts";

  let { post }: { post: Post } = $props();
</script>

<svelte:head>
  <title>{post.title} · thethongngu</title>
  <meta property="og:title" content={post.title} />
  <meta property="og:type" content="article" />
  {#if post.description}
    <meta name="description" content={post.description} />
    <meta property="og:description" content={post.description} />
  {/if}
</svelte:head>

<main>
  <article class="post-page">
    <header>
      <h1>{post.title}</h1>
      <time datetime={post.isoDate}>{post.date}</time>
    </header>
    <div class="content">
      {@html post.content}
    </div>
  </article>
</main>

<style>
  .post-page {
    max-width: 100%;
    position: relative;
  }

  h1 {
    margin-bottom: 0.5rem;
  }

  time {
    font-size: 0.875rem;
    color: var(--color-text-muted);
    display: block;
    margin-bottom: 2rem;
  }

  .content :global(h2) {
    margin-top: 2rem;
    margin-bottom: 1rem;
  }

  .content :global(p) {
    margin-bottom: 1rem;
  }

  .content :global(pre) {
    padding: 1rem;
    border-radius: 4px;
    overflow-x: auto;
    font-family: var(--font-mono);
    font-size: 0.875rem;
    margin-bottom: 1rem;
  }

  .content :global(code) {
    font-family: var(--font-mono);
    font-size: 0.875em;
  }

  .content :global(ul),
  .content :global(ol) {
    margin-bottom: 1rem;
    padding-left: 1.5rem;
  }

  .content :global(li) {
    margin-bottom: 0.5rem;
  }

  .content :global(a) {
    padding: 0.1rem 0.25rem;
    border-radius: 3px;
    transition: background-color 0.2s, color 0.2s;
  }

  .content :global(a:hover) {
    background-color: var(--color-primary);
    color: white;
  }

  .content :global(.footnotes) {
    font-size: 0.875rem;
    color: var(--color-text-muted);
    margin-top: 2rem;
  }

  .content :global(.footnotes h4) {
    margin-bottom: 0.75rem;
    color: var(--color-text);
  }

  .content :global(.footnotes ol) {
    padding-left: 1.25rem;
  }

  .content :global(.footnotes li) {
    margin-bottom: 0.4rem;
  }

  .content :global(sup a) {
    font-size: 0.75rem;
    text-decoration: none;
    padding: 0;
  }
</style>
