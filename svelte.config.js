import adapter from '@sveltejs/adapter-vercel';
import {vitePreprocess} from '@sveltejs/kit/vite';

/** @type {import('@sveltejs/kit').Config} */
const config = {
    preprocess: vitePreprocess(),
    onwarn: (warning, handler) => {
        if (warning.code.startsWith('a11y-')) {
            return;
        }
        handler(warning);
    },
    kit: {
        adapter: adapter(),
    }
};


export default config;
