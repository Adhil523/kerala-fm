<script lang="ts">
	import '../app.css';
	import BottomNav from '$lib/components/BottomNav.svelte';
	import { favourites } from '$lib/stores/favourites';
	import { onMount } from 'svelte';

	let { children } = $props();

	onMount(() => {
		favourites.init();
	});
</script>

<div class="min-h-screen pb-20" style="background: var(--bg-primary);">
	{@render children()}
</div>

<BottomNav />
