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

	const responseContent = await fetch(`https://arpansi-enterprise.my.id/api/contents`, {
		method: 'GET'
	});
	const dataContent = await responseContent.json();

	// get all categories
	const responseCategories = await fetch(`https://arpansi-enterprise.my.id/api/categories`, {
		method: 'GET'
	});
	const dataCategories = await responseCategories.json();

	return {
		episodes: data.data,
		allEpisodes: dataEpisode.data,
		content: dataContent.data,
		categories: dataCategories
	};
};
