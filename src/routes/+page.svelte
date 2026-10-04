<script lang="ts">
    import PostList from "#lib/PostList.svelte";

    let { data } = $props();
</script>

<svelte:head>
    <title>thethongngu</title>
</svelte:head>

<main>
    <PostList title="Posts" posts={data.posts} collection="posts" />
    <PostList title="Notes" posts={data.notes} collection="notes" />
</main>

<style>
    main {
        display: grid;
        gap: 3rem;
    }
</style>
