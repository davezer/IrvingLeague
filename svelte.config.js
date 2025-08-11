import vercel from '@sveltejs/adapter-vercel';
import node from '@sveltejs/adapter-node';
import adapter from '@sveltejs/adapter-static';
export default {
  kit: {
    adapter: adapter({ pages: 'build', assets: 'build', fallback: 'index.html' })
  }
};
const dockerBuild = process.env.DOCKER_BUILD

/** @type {import('@sveltejs/kit').Config} */
const config = {
	kit: {
		adapter: dockerBuild ? node() : vercel(),
	}
};

export default config;
