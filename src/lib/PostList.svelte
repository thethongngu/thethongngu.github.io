<script lang="ts">
    import type { PostSummary } from "#lib/post.ts";

    let { posts }: { posts: PostSummary[] } = $props();
</script>

<ol>
    {#each posts as post}
        <li>
            <a href="/posts/{post.slug}/">{post.title}</a>
            <time datetime={post.date}>{post.date}</time>
        </li>
    {/each}
</ol>

<style>
    ol {
        margin: 0;
        padding: 0;
        list-style: none;
    }

    li {
        display: flex;
        justify-content: space-between;
        align-items: baseline;
        gap: 1.5rem;
        padding: 0.45rem 0;
    }

    a {
        color: var(--color-text);
    }

    a:hover {
        color: var(--color-accent);
    }

    time {
        font-size: 0.85rem;
        font-variant-numeric: tabular-nums;
        color: var(--color-text-muted);
        white-space: nowrap;
    }

    @media (max-width: 37.5em) {
        li {
            flex-direction: column;
            gap: 0;
            padding: 0.6rem 0;
        }
    }
</style>
