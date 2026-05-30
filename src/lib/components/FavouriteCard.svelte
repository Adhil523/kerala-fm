<script lang="ts">
	import { Trash2 } from '@lucide/svelte';
	import type { Station } from '$lib/data/stations';

	let {
		station,
		onselect,
		onremove
	}: {
		station: Station;
		onselect?: (station: Station) => void;
		onremove?: (id: string) => void;
	} = $props();
</script>

<div
	class="flex items-center gap-4 rounded-xl px-4 py-3 transition-colors"
	style="background: var(--bg-card);"
>
	<button onclick={() => onselect?.(station)} class="flex-1 text-left active:opacity-70">
		<p class="text-base font-semibold" style="color: var(--text-primary);">{station.name}</p>
		<p class="font-mono text-sm" style="color: var(--accent);">{station.frequency.toFixed(1)} MHz</p>
	</button>

	<button
		onclick={() => onremove?.(station.id)}
		class="p-2 transition-colors active:text-red-400"
		style="color: var(--text-muted);"
		aria-label="Remove {station.name} from favourites"
	>
		<Trash2 size={18} />
	</button>
</div>
