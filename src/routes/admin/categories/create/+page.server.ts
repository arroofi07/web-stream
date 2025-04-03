import type { Actions, PageServerLoad } from './$types';
import { error, redirect } from '@sveltejs/kit';

export const actions = {
	create: async ({ request }) => {
		try {
			const formData = await request.formData();

			const response = await fetch('https://arpansi-enterprise.my.id/api/categories', {
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
			console.error('Error creating category:', err);
			throw error(500, 'Failed to create category');
		}
	}
} satisfies Actions;

export const load: PageServerLoad = async () => {
	const response = await fetch('https://arpansi-enterprise.my.id/api/contents');
	const data = await response.json();
	return {
		contents: data.data
	};
};
