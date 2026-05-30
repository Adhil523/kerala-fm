<script lang="ts">
	import FavouriteCard from '$lib/components/FavouriteCard.svelte';
	import { favourites } from '$lib/stores/favourites';
	import { frequency } from '$lib/stores/tuner';
	import { play } from '$lib/utils/audio';
	import { goto } from '$app/navigation';
	import { URLS } from '$lib/urls';
	import type { Station } from '$lib/data/stations';

	function onSelect(station: Station) {
		frequency.set(station.frequency);
		play(station.streamUrl);
		goto(URLS.app.tuner);
	}

	function onRemove(id: string) {
		favourites.remove(id);
	}
</script>

<svelte:head>
	<title>Kerala FM – Favourites</title>
</svelte:head>

<div class="px-4 pt-8">
	<h2 class="mb-4 text-base font-medium uppercase tracking-widest" style="color: var(--text-muted);">
		Favourites
	</h2>

	{#if $favourites.length === 0}
		<div class="mt-24 flex flex-col items-center gap-2 text-center">
			<p class="text-sm" style="color: var(--text-muted);">No favourites yet.</p>
			<p class="text-xs" style="color: var(--text-muted); opacity: 0.6;">
				Tune to a station and tap ♥
			</p>
		</div>
	{:else}
		<div class="flex flex-col gap-3">
			{#each $favourites as station (station.id)}
				<FavouriteCard {station} onselect={onSelect} onremove={onRemove} />
			{/each}
		</div>
	{/if}
</div>
