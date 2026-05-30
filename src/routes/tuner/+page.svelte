<script lang="ts">
	import TunerDial from '$lib/components/TunerDial.svelte';
	import FrequencyDisplay from '$lib/components/FrequencyDisplay.svelte';
	import StationInfo from '$lib/components/StationInfo.svelte';
	import PlayerControls from '$lib/components/PlayerControls.svelte';
	import { frequency, currentStation, isPlaying, isLoading, clampFrequency } from '$lib/stores/tuner';
	import { favourites } from '$lib/stores/favourites';
	import { play, pause } from '$lib/utils/audio';

	$: isFavourite = $currentStation ? favourites.has($currentStation.id, $favourites) : false;

	function onFrequencyChange(f: number) {
		if ($isPlaying) pause();
		frequency.set(clampFrequency(f));
	}

	function onTogglePlay() {
		if (!$currentStation) return;
		if ($isPlaying) {
			pause();
		} else {
			play($currentStation.streamUrl);
		}
	}

	function onToggleFavourite() {
		if (!$currentStation) return;
		if (isFavourite) {
			favourites.remove($currentStation.id);
		} else {
			favourites.add($currentStation);
		}
	}
</script>

<svelte:head>
	<title>Kerala FM</title>
</svelte:head>

<div
	class="flex flex-col items-center justify-between gap-6 px-6 py-8"
	style="min-height: calc(100dvh - 5rem);"
>
	<!-- Header -->
	<div class="w-full text-center">
		<p class="text-[0.65rem] font-medium uppercase tracking-[0.3em]" style="color: var(--text-muted);">
			Kerala FM
		</p>
	</div>

	<!-- Dial -->
	<div class="mx-auto w-full max-w-xs">
		<TunerDial frequency={$frequency} onfrequencychange={onFrequencyChange} />
	</div>

	<!-- Frequency + Station name -->
	<div class="flex w-full flex-col items-center gap-1">
		<FrequencyDisplay frequency={$frequency} onfrequencychange={onFrequencyChange} />
		<StationInfo station={$currentStation} />
	</div>

	<!-- Controls -->
	<PlayerControls
		isPlaying={$isPlaying}
		isLoading={$isLoading}
		{isFavourite}
		station={$currentStation}
		ontoggle={onTogglePlay}
		ontoggleFavourite={onToggleFavourite}
	/>
</div>
