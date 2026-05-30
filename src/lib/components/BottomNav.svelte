<script lang="ts">
	import { page } from '$app/state';
	import { Radio, Heart } from '@lucide/svelte';
	import { URLS } from '$lib/urls';

	const tabs = [
		{ href: URLS.app.tuner, label: 'Tuner', icon: Radio },
		{ href: URLS.app.favourites, label: 'Favourites', icon: Heart }
	] as const;
</script>

<nav
	class="fixed inset-x-0 bottom-0 border-t pb-[env(safe-area-inset-bottom)]"
	style="background: var(--bg-secondary); border-color: var(--border-subtle);"
>
	<div class="mx-auto grid max-w-md grid-cols-2">
		{#each tabs as tab}
			{@const active = page.url.pathname === tab.href}
			{@const Icon = tab.icon}
			<a
				href={tab.href}
				class="flex flex-col items-center gap-1 py-3 text-xs font-medium tracking-wide transition-colors"
				style="color: {active ? 'var(--accent)' : 'var(--text-muted)'};"
			>
				<Icon size={22} />
				{tab.label}
			</a>
		{/each}
	</div>
</nav>
