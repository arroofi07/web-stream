import type { PageServerLoad } from './$types';
import talesOfHerdingGods from '$lib/assets/cover/tales-of-herding-gods.jpg';
import overGoddess from '$lib/assets/cover/over-goddess.jpg';

export const load: PageServerLoad = async ({ url, fetch }: any) => {
	// Get search query from URL if it exists
	const searchQuery: any = url.searchParams.get('search') || '';
	console.log('Server received search query:', searchQuery);

	try {
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

		// Log data structure for debugging
		// console.log('Server data loaded successfully');
		// console.log('Contents count:', dataContents.data?.length || 0);
		// console.log('Episodes count:', dataEpisodes.data?.length || 0);
		// console.log('Categories count:', dataCategories?.length || 0);
		return {
			data: {
				contents: dataContents.data || [],
				episodes: dataEpisodes.data || [],
				categories: dataCategories || []
			},
			searchQuery
		};
	} catch (error) {
		console.error('Error loading data:', error);
		return {
			data: {
				contents: [],
				episodes: [],
				categories: []
			},
			searchQuery: ''
		};
	}
};
