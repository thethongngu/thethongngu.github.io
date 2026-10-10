<script lang="ts">
    import "#lib/app.css";

    let { children } = $props();
</script>

<header>
    <a href="/" class="site-title">thethongngu</a>
    <p class="tagline">prompting by day, prompting more by night</p>
</header>

{@render children()}

<style>
    header {
        display: flex;
        flex-wrap: wrap;
        align-items: baseline;
        column-gap: 0.75rem;
        max-width: var(--page-width);
        margin: 0 auto 3rem;
        padding-bottom: 1rem;
        border-bottom: 1px solid var(--color-border);
    }

    .site-title {
        font-weight: 600;
        color: var(--color-text);
    }

    .site-title:hover {
        color: var(--color-accent);
    }

    .tagline {
        margin: 0;
        font-size: 0.85rem;
        color: var(--color-text-muted);
    }
</style>
