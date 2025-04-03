import type { PageServerLoad } from './$types';
import talesOfHerdingGods from '$lib/assets/cover/tales-of-herding-gods.jpg';
import overGoddess from '$lib/assets/cover/over-goddess.jpg';

export const load: PageServerLoad = async () => {
	// get data categories / genres
	const responseCategories = await fetch('https://arpansi-enterprise.my.id/api/categories', {
		method: 'GET'
	});
	const dataCategories = await responseCategories.json();

	// get api data contents
	const responseContents = await fetch('https://arpansi-enterprise.my.id/api/contents', {
		method: 'GET'
	});
	const dataContents = await responseContents.json();

	// get api data episodes
	const response = await fetch('https://arpansi-enterprise.my.id/api/episodes', {
		method: 'GET'
	});
	const dataEpisodes = await response.json();

	return {
		contents: dataContents.data,
		episodes: dataEpisodes.data,
		categories: dataCategories
	};
};
