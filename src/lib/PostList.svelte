<script lang="ts">
    import { apps, iconUrl } from "#lib/apps.ts";
    import type { Collection, PostSummary } from "#lib/post.ts";

    let { posts, collection }: { posts: PostSummary[]; collection: Collection } = $props();
</script>

<header>
    <h1>thethongngu</h1>
    <nav>
        <a href="/">Home</a>
        <a href="/notes/">Notes</a>
        <a href="https://github.com/thethongngu">GitHub</a>
    </nav>
</header>

{#if apps.length > 0}
    <div class="apps-mobile">
        <h2>My artifacts</h2>
        <span class="apps-mobile-sep">:</span>
        {#each apps as app}
            <a
                href={app.url}
                class="app-card"
                target="_blank"
                rel="noopener noreferrer"
                title={app.name}
            >
                <img class="app-icon" src={iconUrl(app)} alt={app.name} />
            </a>
        {/each}
    </div>
{/if}

<main>
    <section class="posts">
        {#each posts as post}
            <article class="post">
                <time datetime={post.isoDate}>{post.date}</time>
                <span class="separator">—</span>
                <a href="/{collection}/{post.slug}/" class="post-title"
                    >{post.title}</a
                >
            </article>
        {/each}
    </section>
</main>

{#if apps.length > 0}
    <aside class="apps">
        <h2>My artifacts</h2>
        {#each apps as app}
            <a
                href={app.url}
                class="app-card"
                target="_blank"
                rel="noopener noreferrer"
                title={app.description}
            >
                <img class="app-icon" src={iconUrl(app)} alt={app.name} />
                <span class="app-name">{app.name}</span>
            </a>
        {/each}
    </aside>
{/if}

<style>
    header {
        padding-bottom: 1rem;
    }

    h1 {
        margin-bottom: 0.25rem;
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

    .apps {
        position: fixed;
        left: 0;
        top: 0;
        bottom: 0;
        width: 72px;
        display: flex;
        flex-direction: column;
        align-items: center;
        gap: 0.25rem;
        padding: 2rem 0.5rem;
        margin-left: 2rem;
        overflow-y: auto;
    }

    .apps h2 {
        font-size: 0.75rem;
        text-transform: uppercase;
        letter-spacing: 0.05em;
        color: var(--color-text-muted);
        margin-bottom: 0.5rem;
        text-align: center;
    }

    .app-card {
        display: flex;
        flex-direction: column;
        align-items: center;
        gap: 2px;
        padding: 0.4rem;
        border-radius: 8px;
        transition: background-color 0.2s ease;
        text-decoration: none;
        width: 100%;
    }

    .app-card:hover {
        background-color: var(--color-border);
    }

    .app-icon {
        width: 28px;
        height: 28px;
        border-radius: 6px;
    }

    .app-name {
        font-size: 0.6rem;
        color: var(--color-text-muted);
        text-align: center;
        font-weight: 500;
        line-height: 1.2;
    }

    .apps-mobile {
        display: none;
    }

    .apps-mobile-sep {
        display: none;
    }

    @media (max-width: 1100px) {
        .apps {
            display: none;
        }

        .apps-mobile {
            display: flex;
            align-items: center;
            flex-wrap: wrap;
            gap: 0.25rem;
            margin-bottom: 1.5rem;
            padding-bottom: 0.8rem;
            border-bottom: 1px solid var(--color-border);
        }

        .apps-mobile h2 {
            font-size: 0.75rem;
            text-transform: uppercase;
            letter-spacing: 0.05em;
            color: var(--color-text-muted);
            margin: 0;
        }

        .apps-mobile-sep {
            color: var(--color-text-muted);
            font-size: 0.75rem;
            margin-right: 0.25rem;
        }

        .apps-mobile .app-card {
            padding: 0.2rem;
            width: auto;
        }

        .apps-mobile .app-icon {
            width: 24px;
            height: 24px;
        }
    }
</style>
