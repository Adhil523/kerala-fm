<script lang="ts">
	import { FREQ_MIN, FREQ_MAX, FREQ_STEP } from '$lib/data/stations';

	let {
		frequency,
		onfrequencychange
	}: {
		frequency: number;
		onfrequencychange?: (f: number) => void;
	} = $props();

	function onInput(e: Event) {
		const val = parseFloat((e.target as HTMLInputElement).value);
		if (!isNaN(val)) {
			const clamped = Math.min(FREQ_MAX, Math.max(FREQ_MIN, Math.round(val * 10) / 10));
			onfrequencychange?.(clamped);
		}
	}
</script>

<div class="flex items-baseline justify-center gap-1">
	<input
		type="number"
		value={frequency.toFixed(1)}
		min={FREQ_MIN}
		max={FREQ_MAX}
		step={FREQ_STEP}
		onchange={onInput}
		class="
			w-40 bg-transparent text-center font-mono text-6xl font-bold tabular-nums
			border-none outline-none
			[appearance:textfield]
			[&::-webkit-inner-spin-button]:appearance-none
			[&::-webkit-outer-spin-button]:appearance-none
		"
		style="color: var(--accent);"
	/>
	<span class="text-base font-medium" style="color: var(--text-muted);">MHz</span>
</div>
