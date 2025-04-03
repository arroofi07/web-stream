import type { PageServerLoad } from './$types';

export const load: PageServerLoad = async () => {
	const data = await fetch('http://arpansi-enterprise.my.id/api/streaming-links');
	const streamingLinks = await data.json();

	return {
		streamingLinks: streamingLinks.data
	};
};
