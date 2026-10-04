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
        margin-bottom: 3rem;
    }

    .site-title {
        font-size: 1.15rem;
        font-weight: 600;
        color: var(--color-text);
    }

    .site-title:hover {
        color: var(--color-accent);
    }

    .tagline {
        margin: 0.15rem 0 0;
        font-size: 0.8rem;
        color: var(--color-text-muted);
    }
</style>
