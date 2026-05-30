<script lang="ts">
	import { FREQ_MIN, FREQ_MAX } from '$lib/data/stations';

	let {
		frequency = 91.9,
		onfrequencychange
	}: {
		frequency?: number;
		onfrequencychange?: (f: number) => void;
	} = $props();

	const DIAL_START_DEG = 135;
	const DIAL_RANGE_DEG = 270;

	// +90 maps the SVG trig angles to the correct SVG rotate() angles
	let dialAngle = $derived(
		((frequency - FREQ_MIN) / (FREQ_MAX - FREQ_MIN)) * DIAL_RANGE_DEG + DIAL_START_DEG + 90
	);

	let svgEl: SVGSVGElement;
	let dragging = $state(false);
	let lastAngle = 0;

	function getAngle(clientX: number, clientY: number): number {
		const rect = svgEl.getBoundingClientRect();
		const cx = rect.left + rect.width / 2;
		const cy = rect.top + rect.height / 2;
		return Math.atan2(clientY - cy, clientX - cx) * (180 / Math.PI);
	}

	function onPointerDown(e: PointerEvent) {
		dragging = true;
		lastAngle = getAngle(e.clientX, e.clientY);
		svgEl.setPointerCapture(e.pointerId);
	}

	function onPointerMove(e: PointerEvent) {
		if (!dragging) return;
		const angle = getAngle(e.clientX, e.clientY);
		let delta = angle - lastAngle;
		if (delta > 180) delta -= 360;
		if (delta < -180) delta += 360;
		lastAngle = angle;

		const freqDelta = (delta / DIAL_RANGE_DEG) * (FREQ_MAX - FREQ_MIN);
		const next = Math.round((frequency + freqDelta) * 10) / 10;
		const clamped = Math.min(FREQ_MAX, Math.max(FREQ_MIN, next));
		onfrequencychange?.(clamped);
	}

	function onPointerUp() {
		dragging = false;
	}

	// 201 ticks spanning the 270° arc, one per 0.1 MHz step
	const ticks = Array.from({ length: 201 }, (_, i) => {
		const freq = FREQ_MIN + i * 0.1;
		const angle = ((freq - FREQ_MIN) / (FREQ_MAX - FREQ_MIN)) * DIAL_RANGE_DEG + DIAL_START_DEG;
		const rad = (angle * Math.PI) / 180;
		const major = i % 10 === 0;
		const r1 = major ? 0.76 : 0.83;
		const r2 = 0.89;
		return {
			major,
			x1: Math.cos(rad) * r1,
			y1: Math.sin(rad) * r1,
			x2: Math.cos(rad) * r2,
			y2: Math.sin(rad) * r2
		};
	});
</script>

<svg
	bind:this={svgEl}
	viewBox="-1.1 -1.1 2.2 2.2"
	role="slider"
	aria-label="Frequency tuner"
	aria-valuenow={frequency}
	aria-valuemin={FREQ_MIN}
	aria-valuemax={FREQ_MAX}
	aria-valuetext="{frequency.toFixed(1)} MHz"
	tabindex="0"
	class="aspect-square w-full max-w-xs select-none {dragging ? 'cursor-grabbing' : 'cursor-grab'}"
	onpointerdown={onPointerDown}
	onpointermove={onPointerMove}
	onpointerup={onPointerUp}
	onpointercancel={onPointerUp}
>
	<!-- Outer shadow ring -->
	<circle cx="0" cy="0" r="1.08" fill="#0A0B0D" />

	<!-- Main dial face -->
	<circle cx="0" cy="0" r="1" fill="#141618" stroke="#2A2F35" stroke-width="0.015" />

	<!-- Tick marks -->
	{#each ticks as tick}
		<line
			x1={tick.x1}
			y1={tick.y1}
			x2={tick.x2}
			y2={tick.y2}
			stroke={tick.major ? '#F59E0B' : '#2A2F35'}
			stroke-width={tick.major ? 0.022 : 0.01}
			stroke-linecap="round"
		/>
	{/each}

	<!-- Needle -->
	<g transform="rotate({dialAngle})">
		<line
			x1="0"
			y1="0.18"
			x2="0"
			y2="-0.66"
			stroke="#F59E0B"
			stroke-width="0.028"
			stroke-linecap="round"
		/>
	</g>

	<!-- Center hub -->
	<circle cx="0" cy="0" r="0.07" fill="#2A2F35" />
	<circle cx="0" cy="0" r="0.035" fill="#F59E0B" />
</svg>
