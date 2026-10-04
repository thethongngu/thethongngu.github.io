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
  header {
    margin-bottom: 2.5rem;
  }

  h1 {
    margin-bottom: 0.4rem;
  }

  time {
    display: block;
    font-size: 0.8rem;
    color: var(--color-text-muted);
  }

  .content :global(h2) {
    margin-top: 2.5rem;
  }

  .content :global(h3) {
    margin-top: 2rem;
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
