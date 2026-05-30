<script lang="ts">
	import { Heart, Play, Pause, LoaderCircle } from '@lucide/svelte';
	import type { Station } from '$lib/data/stations';

	let {
		isPlaying,
		isLoading,
		isFavourite,
		station,
		ontoggle,
		ontoggleFavourite
	}: {
		isPlaying: boolean;
		isLoading: boolean;
		isFavourite: boolean;
		station: Station | null;
		ontoggle?: () => void;
		ontoggleFavourite?: () => void;
	} = $props();
</script>

<div class="flex items-center justify-center gap-10">
	<!-- Favourite -->
	<button
		onclick={() => ontoggleFavourite?.()}
		disabled={!station}
		class="p-2 transition-opacity disabled:opacity-30 active:scale-95"
		aria-label={isFavourite ? 'Remove from favourites' : 'Add to favourites'}
	>
		<Heart
			size={26}
			class={isFavourite ? 'fill-amber-400 text-amber-400' : ''}
			style={isFavourite ? '' : 'color: var(--text-muted);'}
		/>
	</button>

	<!-- Play / Pause -->
	<button
		onclick={() => ontoggle?.()}
		disabled={!station || isLoading}
		class="flex h-16 w-16 items-center justify-center rounded-full bg-amber-400 transition-all active:scale-95 disabled:opacity-40"
		aria-label={isPlaying ? 'Pause' : 'Play'}
	>
		{#if isLoading}
			<LoaderCircle size={28} class="animate-spin text-black" />
		{:else if isPlaying}
			<Pause size={28} class="text-black" fill="black" />
		{:else}
			<Play size={28} class="text-black" fill="black" />
		{/if}
	</button>

	<!-- Spacer to balance the heart button -->
	<div class="w-10" aria-hidden="true"></div>
</div>
