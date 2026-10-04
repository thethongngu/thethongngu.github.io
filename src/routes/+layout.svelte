<script lang="ts">
    import "#lib/app.css";
    import "highlight.js/styles/atom-one-dark.css";

    let { children } = $props();
</script>

{@render children()}

<footer>
    <p>&copy; 2024 thethongngu</p>
</footer>

<style>
    footer {
        margin-top: 2rem;
        padding-top: 2rem;
        color: var(--color-text-muted);
        font-size: 0.875rem;
    }

    footer p {
        margin: 0;
    }
</style>
