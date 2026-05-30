import { isPlaying, isLoading, audioError } from '$lib/stores/tuner';

let audio: HTMLAudioElement | null = null;

export function play(streamUrl: string) {
	if (audio) {
		audio.pause();
		audio.src = '';
	}

	audio = new Audio();
	audio.crossOrigin = 'anonymous';
	audio.preload = 'none';
	audio.src = streamUrl;

	isLoading.set(true);
	audioError.set(null);

	audio.addEventListener('playing', () => {
		isLoading.set(false);
		isPlaying.set(true);
	});

	audio.addEventListener('waiting', () => isLoading.set(true));
	audio.addEventListener('canplay', () => isLoading.set(false));

	audio.addEventListener('error', () => {
		isLoading.set(false);
		isPlaying.set(false);
		audioError.set('Stream unavailable');
	});

	audio.play().catch(() => {
		isLoading.set(false);
		isPlaying.set(false);
		audioError.set('Playback failed');
	});
}

export function pause() {
	audio?.pause();
	isPlaying.set(false);
	isLoading.set(false);
}

export function stop() {
	if (audio) {
		audio.pause();
		audio.src = '';
		audio = null;
	}
	isPlaying.set(false);
	isLoading.set(false);
}
