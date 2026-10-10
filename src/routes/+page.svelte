<script lang="ts">
    import PostList from "#lib/PostList.svelte";

    let { data } = $props();
</script>

<svelte:head>
    <title>thethongngu</title>
</svelte:head>

<main>
    <PostList posts={data.posts} />
</main>
