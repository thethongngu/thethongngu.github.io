<script lang="ts">
    import PostPage from "#lib/PostPage.svelte";

    let { data } = $props();
</script>

<PostPage post={data.post} />
