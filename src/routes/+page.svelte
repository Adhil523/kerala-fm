<script lang="ts">
  import { goto } from '$app/navigation';
  import { onMount } from 'svelte';
  import { URLS } from '../lib/urls';

  onMount(() => {
    goto(URLS.app.home, { replaceState: true });
  });
</script>

<div class="flex min-h-screen items-center justify-center px-6 text-center">
  <p class="text-sm uppercase tracking-[0.24em]" style="color: var(--text-muted);">Kerala FM</p>
</div>