<script lang="ts">
  import { page } from '$app/state';
  import '../app.css';
  import { URLS } from '../lib/urls';

  const tabs = [
    { href: URLS.app.tuner, label: 'Tuner' },
    { href: URLS.app.favourites, label: 'Favourites' }
  ];
</script>

<div class="min-h-screen pb-20" style="background: var(--bg-primary); color: var(--text-primary);">
  <slot />
</div>

<nav class="fixed inset-x-0 bottom-0 border-t backdrop-blur-sm pb-[env(safe-area-inset-bottom)]" style="border-color: var(--border-subtle); background: color-mix(in srgb, var(--bg-secondary) 95%, transparent);">
  <div class="mx-auto grid max-w-md grid-cols-2">
    {#each tabs as tab}
      {@const active = page.url.pathname === tab.href}
      <a
        href={tab.href}
        class="flex items-center justify-center py-4 text-sm tracking-wide transition-colors"
        style={`color: ${active ? 'var(--accent)' : 'var(--text-muted)'}`}
      >
        {tab.label}
      </a>
    {/each}
  </div>
</nav>