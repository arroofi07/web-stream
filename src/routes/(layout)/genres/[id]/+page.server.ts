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
		const genre = await genreResponse.json();

		// Fetch all contents
		const contentsResponse = await fetch(`https://arpansi-enterprise.my.id/api/contents`);
		if (!contentsResponse.ok) {
			throw error(contentsResponse.status, 'Failed to fetch contents');
		}
		const allContents = await contentsResponse.json();

		return {
			genre,
			allContents
		};
	} catch (err) {
		console.error('Error fetching data:', err);
		throw error(500, 'Failed to load data');
	}
};
