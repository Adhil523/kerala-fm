import adapterStatic from '@sveltejs/adapter-static';
import adapterNode from '@sveltejs/adapter-node';
import { vitePreprocess } from '@sveltejs/vite-plugin-svelte';

const isStatic = process.env.ADAPTER === 'STATIC';

/** @type {import('@sveltejs/kit').Config} */
const config = {
  preprocess: vitePreprocess(),
  kit: {
    adapter: isStatic
      ? adapterStatic({ fallback: 'index.html' })
      : adapterNode()
  }
};

export default config;