<script lang="ts">
    import PostList from "#lib/PostList.svelte";

    let { data } = $props();
</script>

<svelte:head>
    <title>Notes · thethongngu</title>
</svelte:head>

<PostList posts={data.posts} collection="notes" />
