<script lang="ts">
    import "#lib/app.css";

    let { children } = $props();
</script>

<header>
    <a href="/" class="site-title">thethongngu</a>
</header>

{@render children()}

<style>
    header {
        margin-bottom: 3rem;
        font-family: var(--font-ui);
    }

    .site-title {
        font-size: 1.15rem;
        font-weight: 600;
        color: var(--color-text);
    }

    .site-title:hover {
        color: var(--color-accent);
    }
</style>
