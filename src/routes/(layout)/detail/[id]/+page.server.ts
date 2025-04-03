import type { PageServerLoad } from './$types';

export const load: PageServerLoad = async ({ params }) => {
	const response = await fetch(`https://arpansi-enterprise.my.id/api/episodes/${params.id}`, {
		method: 'GET'
	});
	const data = await response.json();

	// get all episode
	const responseEpisode = await fetch(`https://arpansi-enterprise.my.id/api/episodes`, {	
		method: 'GET'
	});
	const dataEpisode = await responseEpisode.json();

	return {
		episodes: data.data,
		allEpisodes: dataEpisode.data
	};
};
