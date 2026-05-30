# Malayalam FM Radio App — Implementation Plan

## Overview

Build a minimal, offline-capable Android radio app for Malayalam FM stations (90–110 MHz) using **SvelteKit 2 + Capacitor 8 + Tailwind CSS 4**, matching the setup patterns of the reference project. The app has two tabs: **Tuner** and **Favourites**. No backend. Favourites persist to localStorage. Audio is streamed from public internet radio stream URLs (no custom server).

---

## 1. Project Initialization

### 1.1 Scaffold

```bash
pnpm create svelte@latest kerala-fm
# Select: Skeleton project, TypeScript syntax, no additional integrations
cd kerala-fm
```

### 1.2 Install Dependencies

```bash
# Core SvelteKit + adapters
pnpm add -D @sveltejs/adapter-static @sveltejs/adapter-node

# Tailwind CSS 4
pnpm add -D tailwindcss@4 @tailwindcss/vite autoprefixer postcss

# Capacitor
pnpm add @capacitor/core@8
pnpm add -D @capacitor/cli@8
pnpm add @capacitor/android@8
pnpm add @capacitor/preferences@8

# Icons
pnpm add @lucide/svelte
```

### 1.3 Init Capacitor

```bash
npx cap init "Kerala FM" com.keralafm.app --web-dir build
npx cap add android
```

---

## 2. Configuration Files

### 2.1 `vite.config.ts`

```typescript
import { sveltekit } from '@sveltejs/kit/vite';
import tailwindcss from '@tailwindcss/vite';
import { defineConfig } from 'vite';

export default defineConfig({
  plugins: [sveltekit(), tailwindcss()],
  base: './'  // Required for Capacitor static builds
});
```

### 2.2 `svelte.config.js`

```javascript
import { vitePreprocess } from '@sveltejs/vite-plugin-svelte';
import adapterStatic from '@sveltejs/adapter-static';
import adapterNode from '@sveltejs/adapter-node';

const isStatic = process.env.ADAPTER === 'STATIC';

export default {
  preprocess: vitePreprocess(),
  kit: {
    adapter: isStatic
      ? adapterStatic({ fallback: 'index.html' })
      : adapterNode()
  }
};
```

### 2.3 `capacitor.config.ts`

```typescript
import type { CapacitorConfig } from '@capacitor/cli';

const config: CapacitorConfig = {
  appId: 'com.keralafm.app',
  appName: 'Kerala FM',
  webDir: 'build',
  plugins: {
    SplashScreen: {
      backgroundColor: '#0A0B0D'
    }
  }
};

export default config;
```

### 2.4 `package.json` scripts

```json
{
  "scripts": {
    "dev": "vite dev",
    "build": "vite build",
    "build:cap": "ADAPTER=STATIC vite build && npx cap sync android",
    "preview": "vite preview"
  }
}
```

### 2.5 `src/app.html`

```html
<!doctype html>
<html lang="en">
  <head>
    <meta charset="utf-8" />
    <link rel="icon" href="/favicon.svg" type="image/svg+xml" />
    <meta
      name="viewport"
      content="width=device-width, initial-scale=1.0, minimum-scale=1.0, maximum-scale=1.0, user-scalable=no, viewport-fit=cover"
    />
    %sveltekit.head%
  </head>
  <body data-sveltekit-preload-data="hover">
    <div style="display: contents">%sveltekit.body%</div>
  </body>
</html>
```

### 2.6 `src/app.css`

```css
@import 'tailwindcss';

:root {
  --bg-primary: #0A0B0D;
  --bg-secondary: #141618;
  --bg-card: #1C1F23;
  --accent: #F59E0B;       /* amber — radio warmth */
  --text-primary: #F1F5F9;
  --text-muted: #64748B;
}

body {
  background-color: var(--bg-primary);
  color: var(--text-primary);
  font-family: 'Roboto', sans-serif;
  -webkit-tap-highlight-color: transparent;
  overscroll-behavior: none;
}
```

---

## 3. Data Layer

### 3.1 `src/lib/data/stations.ts`

Define all Malayalam stations in the 90–110 MHz band. Stream URLs should be sourced from [radio-browser.info](https://www.radio-browser.info) or individual station websites. Populate the `streamUrl` field before building.

```typescript
export interface Station {
  id: string;
  name: string;
  frequency: number;  // MHz, one decimal place
  streamUrl: string;
  tagline?: string;
}

export const STATIONS: Station[] = [
  {
    id: 'radio-mango',
    name: 'Radio Mango',
    frequency: 91.9,
    streamUrl: 'https://stream.radiomango.fm/live',  // verify URL
    tagline: '91.9 FM'
  },
  {
    id: 'radio-city-kochi',
    name: 'Radio City',
    frequency: 91.1,
    streamUrl: 'https://playerservices.streamtheworld.com/api/livestream-redirect/RADIO_CITY_KOCHI_SC',
    tagline: '91.1 FM'
  },
  {
    id: 'big-fm',
    name: 'Big FM',
    frequency: 92.7,
    streamUrl: 'https://stream.bigfm.in/bigfm-kerala',  // verify URL
    tagline: '92.7 FM'
  },
  {
    id: 'red-fm',
    name: 'Red FM',
    frequency: 93.5,
    streamUrl: 'https://stream.redfm.in/kerala',  // verify URL
    tagline: '93.5 FM'
  },
  {
    id: 'club-fm',
    name: 'Club FM',
    frequency: 94.3,
    streamUrl: 'https://stream.clubfm.in/live',  // verify URL
    tagline: '94.3 FM'
  },
  {
    id: 'radio-mirchi',
    name: 'Radio Mirchi',
    frequency: 98.3,
    streamUrl: 'https://air.pc.cdn.bitgravity.com/air/live/pbaudio001/playlist.m3u8',  // verify URL
    tagline: '98.3 FM'
  },
  {
    id: 'fever-fm',
    name: 'Fever FM',
    frequency: 104.0,
    streamUrl: 'https://stream.feverfm.in/kerala',  // verify URL
    tagline: '104 FM'
  },
  {
    id: 'ananthapuri-fm',
    name: 'Ananthapuri FM',
    frequency: 101.9,
    streamUrl: 'https://air.pc.cdn.bitgravity.com/air/live/pbaudio119/playlist.m3u8',  // verify URL
    tagline: '101.9 FM'
  }
];

export const FREQ_MIN = 90.0;
export const FREQ_MAX = 110.0;
export const FREQ_STEP = 0.1;

export function getStationAtFrequency(freq: number): Station | null {
  const rounded = Math.round(freq * 10) / 10;
  return STATIONS.find(s => Math.abs(s.frequency - rounded) < 0.05) ?? null;
}
```

> **Note for implementer:** Before shipping, verify every `streamUrl` by testing it in VLC or a browser. Use [radio-browser.info/search](https://www.radio-browser.info) with the station name to find working stream URLs. Prefer HLS (`.m3u8`) or direct MP3 streams. Replace all placeholder URLs with verified ones.

---

## 4. Stores

### 4.1 `src/lib/stores/tuner.ts`

```typescript
import { writable, derived } from 'svelte/store';
import { FREQ_MIN, FREQ_MAX, getStationAtFrequency } from '$lib/data/stations';

export const frequency = writable<number>(91.9);
export const isPlaying = writable<boolean>(false);
export const isLoading = writable<boolean>(false);
export const audioError = writable<string | null>(null);

export const currentStation = derived(frequency, ($freq) =>
  getStationAtFrequency($freq)
);

export function clampFrequency(f: number): number {
  return Math.min(FREQ_MAX, Math.max(FREQ_MIN, Math.round(f * 10) / 10));
}
```

### 4.2 `src/lib/stores/favourites.ts`

```typescript
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
```

---

## 5. Audio Manager

### 5.1 `src/lib/utils/audio.ts`

```typescript
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
```

---

## 6. Components

### 6.1 `src/lib/components/TunerDial.svelte`

The dial is an SVG circle. The user drags it to rotate and change frequency.

**Key implementation details:**

- The dial arc spans **270°** (from 135° to 405° clockwise), leaving a 90° gap at the bottom.
- 135° corresponds to `FREQ_MIN` (90.0 MHz), 405° corresponds to `FREQ_MAX` (110.0 MHz).
- On drag, compute the angle from the SVG center to the pointer. Accumulate delta angle and convert to frequency delta.
- Emit a `frequencychange` custom event with the new frequency.

```svelte
<script lang="ts">
  import { createEventDispatcher } from 'svelte';
  import { FREQ_MIN, FREQ_MAX } from '$lib/data/stations';

  export let frequency: number = 91.9;

  const dispatch = createEventDispatcher<{ frequencychange: number }>();

  const DIAL_START_DEG = 135;  // degrees, where FREQ_MIN is
  const DIAL_RANGE_DEG = 270;  // total arc in degrees

  // Convert frequency to rotation angle (degrees, for CSS transform)
  $: dialAngle = ((frequency - FREQ_MIN) / (FREQ_MAX - FREQ_MIN)) * DIAL_RANGE_DEG + DIAL_START_DEG - 90;

  let svgEl: SVGSVGElement;
  let dragging = false;
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
    // Handle wrap-around
    if (delta > 180) delta -= 360;
    if (delta < -180) delta += 360;
    lastAngle = angle;

    const freqDelta = (delta / DIAL_RANGE_DEG) * (FREQ_MAX - FREQ_MIN);
    const next = Math.round((frequency + freqDelta) * 10) / 10;
    const clamped = Math.min(FREQ_MAX, Math.max(FREQ_MIN, next));
    dispatch('frequencychange', clamped);
  }

  function onPointerUp() {
    dragging = false;
  }

  // Generate tick marks for the 270° arc
  const ticks = Array.from({ length: 201 }, (_, i) => {
    const freq = FREQ_MIN + i * 0.1;
    const angle = ((freq - FREQ_MIN) / (FREQ_MAX - FREQ_MIN)) * DIAL_RANGE_DEG + DIAL_START_DEG;
    const rad = (angle * Math.PI) / 180;
    const major = i % 10 === 0;
    const r1 = major ? 0.78 : 0.84;
    const r2 = 0.88;
    return { freq, angle, rad, major, x1: Math.cos(rad) * r1, y1: Math.sin(rad) * r1, x2: Math.cos(rad) * r2, y2: Math.sin(rad) * r2 };
  });
</script>

<svg
  bind:this={svgEl}
  viewBox="-1.1 -1.1 2.2 2.2"
  class="w-full max-w-xs aspect-square cursor-grab active:cursor-grabbing select-none"
  on:pointerdown={onPointerDown}
  on:pointermove={onPointerMove}
  on:pointerup={onPointerUp}
  on:pointercancel={onPointerUp}
>
  <!-- Background circle -->
  <circle cx="0" cy="0" r="1" fill="#1C1F23" stroke="#2A2F35" stroke-width="0.02" />

  <!-- Tick marks -->
  {#each ticks as tick}
    <line
      x1={tick.x1} y1={tick.y1}
      x2={tick.x2} y2={tick.y2}
      stroke={tick.major ? '#F59E0B' : '#3A3F47'}
      stroke-width={tick.major ? 0.02 : 0.01}
    />
  {/each}

  <!-- Rotating dial needle -->
  <g transform="rotate({dialAngle})">
    <line x1="0" y1="0" x2="0" y2="-0.7" stroke="#F59E0B" stroke-width="0.03" stroke-linecap="round" />
    <circle cx="0" cy="0" r="0.06" fill="#F59E0B" />
  </g>

  <!-- Center dot -->
  <circle cx="0" cy="0" r="0.04" fill="#0A0B0D" />
</svg>
```

### 6.2 `src/lib/components/FrequencyDisplay.svelte`

```svelte
<script lang="ts">
  import { createEventDispatcher } from 'svelte';
  import { FREQ_MIN, FREQ_MAX, FREQ_STEP } from '$lib/data/stations';

  export let frequency: number;

  const dispatch = createEventDispatcher<{ frequencychange: number }>();

  function onInput(e: Event) {
    const val = parseFloat((e.target as HTMLInputElement).value);
    if (!isNaN(val)) {
      const clamped = Math.min(FREQ_MAX, Math.max(FREQ_MIN, Math.round(val * 10) / 10));
      dispatch('frequencychange', clamped);
    }
  }
</script>

<div class="flex items-baseline justify-center gap-2">
  <input
    type="number"
    value={frequency.toFixed(1)}
    min={FREQ_MIN}
    max={FREQ_MAX}
    step={FREQ_STEP}
    on:change={onInput}
    class="
      w-36 text-center text-5xl font-mono font-bold
      bg-transparent border-none outline-none
      text-amber-400 tabular-nums
      [appearance:textfield]
      [&::-webkit-inner-spin-button]:appearance-none
      [&::-webkit-outer-spin-button]:appearance-none
    "
  />
  <span class="text-lg text-slate-500 font-medium">MHz</span>
</div>
```

### 6.3 `src/lib/components/StationInfo.svelte`

```svelte
<script lang="ts">
  import type { Station } from '$lib/data/stations';

  export let station: Station | null;
</script>

<div class="text-center min-h-[2rem]">
  {#if station}
    <p class="text-lg font-semibold text-slate-200 transition-all">{station.name}</p>
  {:else}
    <p class="text-base text-slate-600">No station at this frequency</p>
  {/if}
</div>
```

### 6.4 `src/lib/components/PlayerControls.svelte`

```svelte
<script lang="ts">
  import { Heart, Play, Pause, Loader } from '@lucide/svelte';
  import type { Station } from '$lib/data/stations';
  import { createEventDispatcher } from 'svelte';

  export let isPlaying: boolean;
  export let isLoading: boolean;
  export let isFavourite: boolean;
  export let station: Station | null;

  const dispatch = createEventDispatcher<{ toggle: void; toggleFavourite: void }>();
</script>

<div class="flex items-center justify-center gap-8">
  <!-- Favourite button -->
  <button
    on:click={() => dispatch('toggleFavourite')}
    disabled={!station}
    class="p-2 disabled:opacity-30 transition-opacity"
    aria-label={isFavourite ? 'Remove from favourites' : 'Add to favourites'}
  >
    <Heart
      size={26}
      class={isFavourite ? 'fill-amber-400 text-amber-400' : 'text-slate-500'}
    />
  </button>

  <!-- Play/Pause button -->
  <button
    on:click={() => dispatch('toggle')}
    disabled={!station || isLoading}
    class="
      w-16 h-16 rounded-full flex items-center justify-center
      bg-amber-400 disabled:opacity-40 transition-all
      active:scale-95
    "
    aria-label={isPlaying ? 'Pause' : 'Play'}
  >
    {#if isLoading}
      <Loader size={28} class="text-black animate-spin" />
    {:else if isPlaying}
      <Pause size={28} class="text-black" fill="black" />
    {:else}
      <Play size={28} class="text-black" fill="black" />
    {/if}
  </button>

  <!-- Spacer to balance layout -->
  <div class="w-10" />
</div>
```

### 6.5 `src/lib/components/BottomNav.svelte`

```svelte
<script lang="ts">
  import { page } from '$app/stores';
  import { Radio, Heart } from '@lucide/svelte';

  const tabs = [
    { href: '/tuner', label: 'Tuner', icon: Radio },
    { href: '/favourites', label: 'Favourites', icon: Heart }
  ];
</script>

<nav class="fixed bottom-0 left-0 right-0 bg-[#141618] border-t border-[#2A2F35] pb-[env(safe-area-inset-bottom)]">
  <div class="flex">
    {#each tabs as tab}
      {@const active = $page.url.pathname === tab.href}
      <a
        href={tab.href}
        class="flex-1 flex flex-col items-center py-3 gap-1 transition-colors {active ? 'text-amber-400' : 'text-slate-500'}"
      >
        <svelte:component this={tab.icon} size={22} />
        <span class="text-xs font-medium">{tab.label}</span>
      </a>
    {/each}
  </div>
</nav>
```

### 6.6 `src/lib/components/FavouriteCard.svelte`

```svelte
<script lang="ts">
  import { Trash2 } from '@lucide/svelte';
  import type { Station } from '$lib/data/stations';
  import { createEventDispatcher } from 'svelte';

  export let station: Station;

  const dispatch = createEventDispatcher<{ select: Station; remove: string }>();
</script>

<div class="flex items-center gap-4 px-4 py-3 bg-[#1C1F23] rounded-xl">
  <button
    on:click={() => dispatch('select', station)}
    class="flex-1 text-left"
  >
    <p class="text-base font-semibold text-slate-100">{station.name}</p>
    <p class="text-sm text-amber-400 font-mono">{station.frequency.toFixed(1)} MHz</p>
  </button>
  <button
    on:click={() => dispatch('remove', station.id)}
    class="p-2 text-slate-600 active:text-red-400 transition-colors"
    aria-label="Remove"
  >
    <Trash2 size={18} />
  </button>
</div>
```

---

## 7. Routes

### 7.1 `src/routes/+layout.ts`

```typescript
export const prerender = true;
export const ssr = false;
```

### 7.2 `src/routes/+layout.svelte`

```svelte
<script lang="ts">
  import '../app.css';
  import BottomNav from '$lib/components/BottomNav.svelte';
  import { favourites } from '$lib/stores/favourites';
  import { onMount } from 'svelte';

  onMount(() => {
    favourites.init();  // Hydrate from localStorage on client
  });
</script>

<div class="min-h-screen bg-[#0A0B0D] pb-20">
  <slot />
</div>

<BottomNav />
```

### 7.3 `src/routes/+page.svelte` (redirect)

```svelte
<script lang="ts">
  import { goto } from '$app/navigation';
  import { onMount } from 'svelte';
  onMount(() => goto('/tuner', { replaceState: true }));
</script>
```

### 7.4 `src/routes/tuner/+page.svelte`

```svelte
<script lang="ts">
  import TunerDial from '$lib/components/TunerDial.svelte';
  import FrequencyDisplay from '$lib/components/FrequencyDisplay.svelte';
  import StationInfo from '$lib/components/StationInfo.svelte';
  import PlayerControls from '$lib/components/PlayerControls.svelte';
  import { frequency, currentStation, isPlaying, isLoading } from '$lib/stores/tuner';
  import { favourites } from '$lib/stores/favourites';
  import { play, pause } from '$lib/utils/audio';
  import { clampFrequency } from '$lib/stores/tuner';

  $: isFavourite = $currentStation ? favourites.has($currentStation.id, $favourites) : false;

  function onFrequencyChange(e: CustomEvent<number>) {
    if ($isPlaying) {
      pause();
      isPlaying.set(false);
    }
    frequency.set(clampFrequency(e.detail));
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

<div class="flex flex-col items-center justify-between min-h-[calc(100vh-5rem)] px-6 py-8 gap-6">
  <!-- Header -->
  <div class="w-full text-center">
    <h1 class="text-xs font-medium tracking-widest uppercase text-slate-600">Kerala FM</h1>
  </div>

  <!-- Dial -->
  <div class="w-full max-w-xs mx-auto">
    <TunerDial frequency={$frequency} on:frequencychange={onFrequencyChange} />
  </div>

  <!-- Frequency + Station -->
  <div class="flex flex-col items-center gap-2 w-full">
    <FrequencyDisplay frequency={$frequency} on:frequencychange={onFrequencyChange} />
    <StationInfo station={$currentStation} />
  </div>

  <!-- Controls -->
  <PlayerControls
    isPlaying={$isPlaying}
    isLoading={$isLoading}
    isFavourite={isFavourite}
    station={$currentStation}
    on:toggle={onTogglePlay}
    on:toggleFavourite={onToggleFavourite}
  />
</div>
```

### 7.5 `src/routes/favourites/+page.svelte`

```svelte
<script lang="ts">
  import FavouriteCard from '$lib/components/FavouriteCard.svelte';
  import { favourites } from '$lib/stores/favourites';
  import { frequency, isPlaying } from '$lib/stores/tuner';
  import { play } from '$lib/utils/audio';
  import { goto } from '$app/navigation';

  function onSelect(e: CustomEvent) {
    const station = e.detail;
    frequency.set(station.frequency);
    play(station.streamUrl);
    isPlaying.set(true);
    goto('/tuner');
  }

  function onRemove(e: CustomEvent<string>) {
    favourites.remove(e.detail);
  }
</script>

<div class="px-4 pt-8">
  <h2 class="text-lg font-semibold text-slate-300 mb-4">Favourites</h2>

  {#if $favourites.length === 0}
    <div class="flex flex-col items-center justify-center gap-3 mt-20 text-center">
      <p class="text-slate-500 text-sm">No favourites yet.</p>
      <p class="text-slate-600 text-xs">Tune to a station and tap ♥</p>
    </div>
  {:else}
    <div class="flex flex-col gap-3">
      {#each $favourites as station (station.id)}
        <FavouriteCard
          {station}
          on:select={onSelect}
          on:remove={onRemove}
        />
      {/each}
    </div>
  {/if}
</div>
```

---

## 8. Capacitor / Android Setup

### 8.1 `android/app/src/main/AndroidManifest.xml`

Add inside `<manifest>`:

```xml
<uses-permission android:name="android.permission.INTERNET" />
<uses-permission android:name="android.permission.ACCESS_NETWORK_STATE" />
```

Add to `<application>` tag:

```xml
android:usesCleartextTraffic="true"
```

This is required because some radio streams use HTTP (not HTTPS). If all verified stream URLs are HTTPS, this attribute can be omitted.

### 8.2 Build & Sync Flow

```bash
pnpm run build:cap
# Runs: ADAPTER=STATIC vite build && npx cap sync android

# Then open in Android Studio:
npx cap open android
# Build APK: Build > Build Bundle(s)/APK(s)
```

### 8.3 Splash Screen

In `android/app/src/main/res/`, ensure a dark background splash is configured matching `#0A0B0D`.

---

## 9. Styling Guidelines

| Token | Value | Usage |
|---|---|---|
| Background | `#0A0B0D` | Page background |
| Card bg | `#1C1F23` | Favourite cards, surfaces |
| Border | `#2A2F35` | Dividers, nav border |
| Accent | `#F59E0B` (amber-400) | Active elements, needle, frequency text |
| Text primary | `#F1F5F9` (slate-100) | Headings, labels |
| Text muted | `#64748B` (slate-500) | Secondary labels, empty states |
| Font | Roboto / system-ui | Body |
| Frequency font | Roboto Mono | Frequency display |

- No box shadows, no gradients (except optional subtle radial on dial)
- Rounded corners: `rounded-xl` (12px) for cards, `rounded-full` for play button
- All interactive elements: `active:scale-95` for tactile feedback
- Bottom nav: fixed, solid bg, respects `safe-area-inset-bottom`

---

## 10. Known Limitations & Notes

1. **Background audio:** HTML5 audio in Capacitor's WebView may pause when the app is backgrounded on Android. True background audio requires a native foreground service (out of scope). Display a note to the user if needed.
2. **Stream URLs:** All stream URLs in `stations.ts` are placeholders and must be verified before shipping. Test each one with VLC or curl.
3. **Autoplay:** Capacitor's WebView does not restrict autoplay, so `audio.play()` works without a prior user gesture — unlike the mobile browser.
4. **HLS streams:** If a station uses HLS (`.m3u8`), the native WebView on Android (Chromium-based) supports HLS natively. No additional library needed.
5. **HTTPS vs HTTP:** Prefer HTTPS stream URLs. If an HTTP stream is unavoidable, `usesCleartextTraffic="true"` must remain in the manifest.
6. **Frequency snapping:** When the user drags the dial to a frequency with no station, the dial stays at that frequency (no snap-to-station). This is intentional.

---

## 11. File Tree Summary

```
kerala-fm/
├── capacitor.config.ts
├── svelte.config.js
├── vite.config.ts
├── package.json
├── postcss.config.cjs
├── android/
│   └── app/src/main/AndroidManifest.xml  ← add INTERNET permission
└── src/
    ├── app.html
    ├── app.css
    ├── lib/
    │   ├── data/
    │   │   └── stations.ts              ← station list + stream URLs
    │   ├── stores/
    │   │   ├── tuner.ts                 ← frequency, isPlaying, isLoading
    │   │   └── favourites.ts            ← persistent localStorage store
    │   ├── utils/
    │   │   └── audio.ts                 ← HTML5 Audio singleton
    │   └── components/
    │       ├── TunerDial.svelte         ← SVG rotatable dial
    │       ├── FrequencyDisplay.svelte  ← number input as display
    │       ├── StationInfo.svelte       ← station name below frequency
    │       ├── PlayerControls.svelte    ← play/pause + heart
    │       ├── BottomNav.svelte         ← two-tab nav bar
    │       └── FavouriteCard.svelte     ← card in favourites list
    └── routes/
        ├── +layout.ts                   ← prerender=true, ssr=false
        ├── +layout.svelte               ← root layout + BottomNav
        ├── +page.svelte                 ← redirect to /tuner
        ├── tuner/
        │   └── +page.svelte             ← tuner page
        └── favourites/
            └── +page.svelte             ← favourites page
```
