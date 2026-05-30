<script lang="ts">
	import '../app.css';
	import BottomNav from '$lib/components/BottomNav.svelte';
	import { favourites } from '$lib/stores/favourites';
	import { stop } from '$lib/utils/audio';
	import { Toaster } from 'svelte-sonner';
	import { onMount, onDestroy } from 'svelte';

	let { children } = $props();

	onMount(() => {
		favourites.init();
	});

	onDestroy(() => {
		stop();
	});
</script>

<div class="min-h-screen pb-20" style="background: var(--bg-primary);">
	{@render children()}
</div>

<BottomNav />
<Toaster theme="dark" position="top-center" richColors />
