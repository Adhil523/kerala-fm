export interface Station {
	id: string;
	name: string;
	frequency: number; // MHz, one decimal place
	streamUrl: string;
	tagline?: string;
}

export const STATIONS: Station[] = [
	{
		id: 'radio-city-kochi',
		name: 'Radio City',
		frequency: 91.1,
		streamUrl:
			'https://playerservices.streamtheworld.com/api/livestream-redirect/RADIO_CITY_KOCHI_SC',
		tagline: '91.1 FM'
	},
	{
		id: 'radio-mango',
		name: 'Radio Mango',
		frequency: 91.9,
		streamUrl: 'https://stream.radiomango.fm/live',
		tagline: '91.9 FM'
	},
	{
		id: 'big-fm',
		name: 'Big FM',
		frequency: 92.7,
		streamUrl: 'https://stream.bigfm.in/bigfm-kerala',
		tagline: '92.7 FM'
	},
	{
		id: 'red-fm',
		name: 'Red FM',
		frequency: 93.5,
		streamUrl: 'https://stream.redfm.in/kerala',
		tagline: '93.5 FM'
	},
	{
		id: 'club-fm',
		name: 'Club FM',
		frequency: 94.3,
		streamUrl: 'https://stream.clubfm.in/live',
		tagline: '94.3 FM'
	},
	{
		id: 'radio-mirchi',
		name: 'Radio Mirchi',
		frequency: 98.3,
		streamUrl: 'https://air.pc.cdn.bitgravity.com/air/live/pbaudio001/playlist.m3u8',
		tagline: '98.3 FM'
	},
	{
		id: 'ananthapuri-fm',
		name: 'Ananthapuri FM',
		frequency: 101.9,
		streamUrl: 'https://air.pc.cdn.bitgravity.com/air/live/pbaudio119/playlist.m3u8',
		tagline: '101.9 FM'
	},
	{
		id: 'fever-fm',
		name: 'Fever FM',
		frequency: 104.0,
		streamUrl: 'https://stream.feverfm.in/kerala',
		tagline: '104 FM'
	}
];

export const FREQ_MIN = 90.0;
export const FREQ_MAX = 110.0;
export const FREQ_STEP = 0.1;

export function getStationAtFrequency(freq: number): Station | null {
	const rounded = Math.round(freq * 10) / 10;
	return STATIONS.find((s) => Math.abs(s.frequency - rounded) < 0.05) ?? null;
}
