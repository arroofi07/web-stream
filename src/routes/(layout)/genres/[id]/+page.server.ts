import { error } from '@sveltejs/kit';
import type { PageServerLoad } from './$types';

export const load: PageServerLoad = async ({ params, fetch }) => {
	const genreId = params.id;

	if (!genreId) {
		throw error(400, 'Genre ID is required');
	}

	try {
		// Fetch genre details
		const genreResponse = await fetch(`https://arpansi-enterprise.my.id/api/categories/${genreId}`);
		if (!genreResponse.ok) {
			throw error(genreResponse.status, 'Failed to fetch genre details');
		}
		const genreData = await genreResponse.json();

		// Debug the genre response
		console.log('Genre response:', genreData);

		// Handle different possible structures of the genre response
		let genre;
		if (genreData && typeof genreData === 'object') {
			// If genreData is the genre object itself
			if (genreData.name && genreData.contents) {
				genre = genreData;
			}
			// If genreData has a data property containing the genre
			else if (genreData.data && typeof genreData.data === 'object') {
				genre = genreData.data;
			}
		}

		if (!genre) {
			console.error('Could not extract genre data from response:', genreData);
			throw error(500, 'Invalid genre data structure in API response');
		}

		// Fetch all contents
		const contentsResponse = await fetch(`https://arpansi-enterprise.my.id/api/contents`);
		if (!contentsResponse.ok) {
			throw error(contentsResponse.status, 'Failed to fetch contents');
		}
		const allContentsData = await contentsResponse.json();
		const allContents = allContentsData.data || [];

		// get data episodes
		const episodesResponse = await fetch(`https://arpansi-enterprise.my.id/api/episodes`);
		if (!episodesResponse.ok) {
			throw error(episodesResponse.status, 'Failed to fetch episodes');
		}
		const episodesData = await episodesResponse.json();
		const episodes = episodesData.data || [];

		return {
			data: {
				genre,
				allContents,
				episodes
			}
		};
	} catch (err) {
		console.error('Error fetching data:', err);
		throw error(500, 'Failed to load data');
	}
};
