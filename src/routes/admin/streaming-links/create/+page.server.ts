import type { Actions, PageServerLoad } from './$types';
import { error } from '@sveltejs/kit';

export const actions = {
	create: async ({ request }) => {
		try {
			const formData = await request.formData();

			const response = await fetch('https://arpansi-enterprise.my.id/api/streaming-links', {
				method: 'POST',
				body: formData
			});

			if (!response.ok) {
				const errorData = await response.json();
				console.error('Server error:', errorData);
				return { success: false, error: errorData };
			}

			const result = await response.json();
			return { success: true, data: result };
		} catch (err) {
			console.error('Error creating streaming link:', err);
			throw error(500, 'Failed to create streaming link');
		}
	}
} satisfies Actions;

export const load: PageServerLoad = async () => {
	const response = await fetch(`https://arpansi-enterprise.my.id/api/episodes`);
	const data = await response.json();
	return { episodes: data.data };
};
