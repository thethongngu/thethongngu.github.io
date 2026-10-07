<script lang="ts">
    import type { Collection, PostSummary } from "#lib/post.ts";

    let { title, posts, collection }: { title: string; posts: PostSummary[]; collection: Collection } = $props();
</script>

<section>
    <h2 class="section-label">{title}</h2>
    {#each posts as post}
        <article class="post">
            <time datetime={post.isoDate}>{post.date}</time>
            <a href="/{collection}/{post.slug}/" class="post-title">{post.title}</a>
        </article>
    {/each}
</section>

<style>
    h2 {
        margin-bottom: 0.75rem;
    }

    .post {
        display: grid;
        grid-template-columns: 7.5rem 1fr;
        align-items: baseline;
        gap: 1rem;
        padding: 0.4rem 0;
    }

    .post-title {
        color: var(--color-text);
    }

    .post-title:hover {
        color: var(--color-accent);
    }

    time {
        font-size: 0.8rem;
        font-variant-numeric: tabular-nums;
        color: var(--color-text-muted);
        white-space: nowrap;
    }

    @media (max-width: 480px) {
        .post {
            grid-template-columns: 1fr;
            gap: 0;
            padding: 0.5rem 0;
        }
    }
</style>
