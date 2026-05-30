import { isPlaying, isLoading, audioError } from '$lib/stores/tuner';
import { toast } from 'svelte-sonner';

let audio: HTMLAudioElement | null = null;
let playId = 0; // incremented on every play() call; listeners check they're still current

export function play(streamUrl: string) {
	if (audio) {
		audio.pause();
		audio.src = '';
	}

	const id = ++playId;
	const isCurrent = () => id === playId;

	audio = new Audio();
	audio.crossOrigin = 'anonymous';
	audio.preload = 'none';
	audio.src = streamUrl;

	isLoading.set(true);
	audioError.set(null);

	audio.addEventListener('playing', () => {
		if (!isCurrent()) return;
		isLoading.set(false);
		isPlaying.set(true);
	});

	audio.addEventListener('waiting', () => {
		if (!isCurrent()) return;
		isLoading.set(true);
	});

	audio.addEventListener('canplay', () => {
		if (!isCurrent()) return;
		isLoading.set(false);
	});

	audio.addEventListener('error', () => {
		if (!isCurrent()) return;
		isLoading.set(false);
		isPlaying.set(false);
		audioError.set('Stream unavailable');
		toast.error('Stream unavailable', { description: 'Check your connection or try another station.' });
	});

	audio.play().catch(() => {
		if (!isCurrent()) return;
		isLoading.set(false);
		isPlaying.set(false);
		audioError.set('Playback failed');
		toast.error('Playback failed', { description: 'Could not start the stream.' });
	});
}

export function pause() {
	audio?.pause();
	isPlaying.set(false);
	isLoading.set(false);
}

export function stop() {
	playId++; // invalidate any in-flight listeners
	if (audio) {
		audio.pause();
		audio.src = '';
		audio = null;
	}
	isPlaying.set(false);
	isLoading.set(false);
}
