<script lang="ts">
  export let post: {
    title: string;
    date: string;
    slug: string;
    content: string;
  };
</script>

<article class="post-page">
  <header>
    <div class="title-row">
      <a href="/#/" class="back">&larr;</a>
      <h1>{post.title}</h1>
    </div>
    <time>{post.date}</time>
  </header>
  <div class="content">
    {@html post.content}
  </div>
</article>

<style>
  .post-page {
    max-width: 100%;
    position: relative;
  }

  .title-row {
    position: relative;
  }

  .back {
    position: absolute;
    right: 100%;
    top: 0.65rem;
    margin-right: 1rem;
    font-size: 1.25rem;
    line-height: 1;
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
    background: var(--color-surface);
    border: 1px solid var(--color-border);
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
</style>
