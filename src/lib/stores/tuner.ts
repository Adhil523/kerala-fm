import { writable, derived } from 'svelte/store';
import { FREQ_MIN, FREQ_MAX, getStationAtFrequency } from '$lib/data/stations';

export const frequency = writable<number>(91.9);
export const isPlaying = writable<boolean>(false);
export const isLoading = writable<boolean>(false);
export const audioError = writable<string | null>(null);

export const currentStation = derived(frequency, ($freq) => getStationAtFrequency($freq));

export function clampFrequency(f: number): number {
	return Math.min(FREQ_MAX, Math.max(FREQ_MIN, Math.round(f * 10) / 10));
}
