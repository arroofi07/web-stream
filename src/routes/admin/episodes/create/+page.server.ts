import type { Actions, PageServerLoad } from './$types';
import { error, redirect } from '@sveltejs/kit';

export const actions = {
	create: async ({ request }) => {
		try {
			const formData = await request.formData();

			const response = await fetch('https://arpansi-enterprise.my.id/api/episodes', {
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
			console.error('Error creating episode:', err);
			throw error(500, 'Failed to create episode');
		}
	}
} satisfies Actions;

// get all contents and load data to page
export const load: PageServerLoad = async () => {
	const response = await fetch('https://arpansi-enterprise.my.id/api/contents');
	const data = await response.json();
	return {
		contents: data.data
	};
};
