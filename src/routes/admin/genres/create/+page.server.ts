import { error } from '@sveltejs/kit';
import type { Actions } from './$types';

export const actions = {
	create: async ({ request }) => {
		try {
			const formData = await request.formData();

			const genreData = {
				name: formData.get('name'),
				description: formData.get('description')
			};

			const response = await fetch('https://arpansi-enterprise.my.id/api/genres', {
				method: 'POST',
				headers: {
					'Content-Type': 'application/json'
				},
				body: JSON.stringify(genreData)
			});

			if (!response.ok) {
				return { success: false, error: 'Failed to create genre' };
			}

			const result = await response.json();
			return { success: true, data: result };
		} catch (err) {
			console.error('Error creating genre:', err);
			throw error(500, 'Failed to create genre');
		}
	}
} satisfies Actions;
