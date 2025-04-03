import type { Actions } from './$types';
import { error } from '@sveltejs/kit';
import type { PageServerLoad } from './$types';

export const actions = {
	update: async ({ request, params }) => {
		try {
			const formData = await request.formData();
			const data: Record<string, unknown> = {};

			// Buat array untuk menampung content_ids
			const contentIds: string[] = [];

			// Loop formData untuk mengambil semua data
			for (const [key, value] of formData.entries()) {
				if (key === 'content_ids[]') {
					// Tambahkan setiap content_id ke array
					contentIds.push(value.toString());
				} else if (typeof value === 'string') {
					data[key] = value;
				}
			}

			// Tambahkan content_ids ke data
			if (contentIds.length > 0) {
				data.content_ids = contentIds;
			}

			const response = await fetch(`https://arpansi-enterprise.my.id/api/categories/${params.id}`, {
				method: 'PATCH',
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
			console.error('Error updating category:', err);
			return { success: false, error: 'Failed to update category' };
		}
	}
} satisfies Actions;

export const load: PageServerLoad = async ({ params }) => {
	const response = await fetch(`https://arpansi-enterprise.my.id/api/categories/${params.id}`);
	const data = await response.json();
	const responseContents = await fetch(`https://arpansi-enterprise.my.id/api/contents`);
	const dataContents = await responseContents.json();
	return {
		category: data,
		contents: dataContents
	};
};
