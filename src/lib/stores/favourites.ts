import { writable } from 'svelte/store';
import type { Station } from '$lib/data/stations';

const STORAGE_KEY = 'kerala-fm-favourites';

function loadFromStorage(): Station[] {
	try {
		const raw = localStorage.getItem(STORAGE_KEY);
		return raw ? JSON.parse(raw) : [];
	} catch {
		return [];
	}
}

function createFavouritesStore() {
	const { subscribe, set, update } = writable<Station[]>([]);

	return {
		subscribe,
		init() {
			set(loadFromStorage());
		},
		add(station: Station) {
			update((favs) => {
				if (favs.find((f) => f.id === station.id)) return favs;
				const next = [...favs, station];
				localStorage.setItem(STORAGE_KEY, JSON.stringify(next));
				return next;
			});
		},
		remove(id: string) {
			update((favs) => {
				const next = favs.filter((f) => f.id !== id);
				localStorage.setItem(STORAGE_KEY, JSON.stringify(next));
				return next;
			});
		},
		has(id: string, favs: Station[]): boolean {
			return favs.some((f) => f.id === id);
		}
	};
}

export const favourites = createFavouritesStore();
