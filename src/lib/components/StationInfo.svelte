<script lang="ts">
	import type { Station } from '$lib/data/stations';

	let { station }: { station: Station | null } = $props();
</script>

<div class="min-h-8 text-center">
	{#if station}
		<p class="text-lg font-semibold tracking-wide transition-all" style="color: var(--text-primary);">
			{station.name}
		</p>
	{:else}
		<p class="text-sm" style="color: var(--text-muted);">No station at this frequency</p>
	{/if}
</div>
