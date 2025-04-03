import { error } from '@sveltejs/kit';
import type { Actions, PageServerLoad } from './$types';

export const actions = {
	update: async ({ request, params }) => {
		try {
			const formData = await request.formData();

			const genreData = {
				name: formData.get('name'),
				description: formData.get('description')
			};

			const response = await fetch(`https://arpansi-enterprise.my.id/api/genres/${params.id}`, {
				method: 'PUT',
				headers: {
					'Content-Type': 'application/json'
				},
				body: JSON.stringify(genreData)
			});

			if (!response.ok) {
				throw new Error('Failed to update genre');
			}

			const result = await response.json();
			return { success: true, data: result };
		} catch (err) {
			console.error('Error updating genre:', err);
			throw error(500, 'Failed to update genre');
		}
	}
} satisfies Actions;

export const load: PageServerLoad = async ({ params }) => {
	const response = await fetch(`https://arpansi-enterprise.my.id/api/genres/${params.id}`);
	const result = await response.json();
	return { genre: result };
};
