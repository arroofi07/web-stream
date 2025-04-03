import type { Actions } from './$types';
import { error } from '@sveltejs/kit';

export const actions = {
	create: async ({ request }) => {
		try {
			const formData = await request.formData();

			const response = await fetch('https://arpansi-enterprise.my.id/api/contents', {
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
			console.error('Error creating content:', err);
			throw error(500, 'Failed to create content');
		}
	}
} satisfies Actions;
