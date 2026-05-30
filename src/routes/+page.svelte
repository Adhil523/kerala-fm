<script lang="ts">
	import { goto } from '$app/navigation';
	import { onMount } from 'svelte';
	import { URLS } from '$lib/urls';

	onMount(() => {
		goto(URLS.app.tuner, { replaceState: true });
	});
</script>
