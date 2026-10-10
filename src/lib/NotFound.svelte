<svelte:head>
    <title>Page not found · thethongngu</title>
</svelte:head>

<main>
    <h1>This page does not exist.</h1>
    <a href="/">← All posts</a>
</main>

<style>
    main {
        display: grid;
        place-content: center;
        gap: 0.5rem;
        min-height: 60vh;
        text-align: center;
    }

    h1 {
        margin: 0;
        font-size: 1rem;
        font-weight: 400;
    }

    a {
        color: var(--color-text-muted);
    }

    a:hover {
        color: var(--color-accent);
    }
</style>
