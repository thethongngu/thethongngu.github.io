<script lang="ts">
  import PostPage from './lib/PostPage.svelte';
  import { loadPosts, type Post } from './lib/posts';

  let posts = $state<Post[]>([]);
  let currentPath = $state(window.location.hash || '#/');

  $effect(() => {
    loadPosts().then(p => posts = p);
  });

  $effect(() => {
    const handleHashChange = () => {
      currentPath = window.location.hash || '#/';
    };
    window.addEventListener('hashchange', handleHashChange);
    return () => window.removeEventListener('hashchange', handleHashChange);
  });

  const currentPost = $derived(
    currentPath.startsWith('#/posts/')
      ? posts.find(p => p.slug === currentPath.replace('#/posts/', ''))
      : null
  );
</script>

{#if currentPost}
  <main>
    <PostPage post={currentPost} />
  </main>
{:else}
  <header>
    <h1>thethongngu</h1>
    <nav>
      <a href="/#/">Home</a>
      <a href="https://github.com/thethongngu">GitHub</a>
    </nav>
  </header>

  <main>
    <section class="posts">
      {#each posts as post}
        <article class="post">
          <time>{post.date}</time>
          <span class="separator">—</span>
          <a href="/#/posts/{post.slug}" class="post-title">{post.title}</a>
        </article>
      {/each}
    </section>
  </main>
{/if}

<footer>
  <p>&copy; 2024 thethongngu</p>
</footer>

<style>
  header {
    margin-bottom: 3rem;
    padding-bottom: 2rem;
    border-bottom: 1px solid var(--color-border);
  }

  h1 {
    margin-bottom: 0.25rem;
  }

  h1 a {
    color: inherit;
    text-decoration: none;
  }

  .tagline {
    color: var(--color-text-muted);
    margin-bottom: 1rem;
  }

  nav {
    display: flex;
    gap: 1.5rem;
  }

  nav a {
    font-weight: 500;
  }

  .posts {
    margin-bottom: 3rem;
  }

  .post {
    display: flex;
    align-items: baseline;
    gap: 0.5rem;
    margin-bottom: 0.75rem;
  }

  .post-title {
    font-weight: 500;
  }

  .separator {
    color: var(--color-text-muted);
  }

  time {
    font-size: 0.875rem;
    color: var(--color-text-muted);
    white-space: nowrap;
  }

  footer {
    margin-top: 2rem;
    padding-top: 2rem;
    border-top: 1px solid var(--color-border);
    color: var(--color-text-muted);
    font-size: 0.875rem;
  }

  footer p {
    margin: 0;
  }
</style>
