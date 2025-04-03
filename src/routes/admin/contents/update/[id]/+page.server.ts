import type { Actions } from './$types';
import { error } from '@sveltejs/kit';
import type { PageServerLoad } from './$types';

export const actions = {
	update: async ({ request, params }) => {
		try {
			const formData = await request.formData();
			const data: Record<string, unknown> = {};

			// Loop formData untuk mengambil data teks saja (skip file)
			for (const [key, value] of formData.entries()) {
				if (typeof value === 'string') {
					data[key] = value;
				}
			}

			const response = await fetch(`https://arpansi-enterprise.my.id/api/contents/${params.id}`, {
				method: 'PATCH', // PATCH lebih cocok untuk update sebagian field
				headers: {
					'Content-Type': 'application/json'
				},
				body: JSON.stringify(data)
			});

			if (!response.ok) {
				const errorData = await response.json();
				console.error('Server error:', errorData);
				return { success: false, error: errorData };
			}

			const result = await response.json();
			return { success: true, data: result };
		} catch (err) {
			console.error('Error updating content:', err);
			return { success: false, error: 'Failed to update content' };
		}
	}
} satisfies Actions;

export const load: PageServerLoad = async ({ params }) => {
	const response = await fetch(`https://arpansi-enterprise.my.id/api/contents/${params.id}`);
	const data = await response.json();
	return {
		content: data.data
	};
};
