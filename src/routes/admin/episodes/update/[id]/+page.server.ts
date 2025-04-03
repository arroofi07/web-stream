import type { Actions, PageServerLoad } from './$types';
import { error, redirect } from '@sveltejs/kit';

export const actions = {
	update: async ({ request, params }) => {
		try {
			const formData = await request.formData();

			// Konversi FormData ke objek JSON
			const jsonData: any = {};
			for (const [key, value] of formData.entries()) {
				jsonData[key] = value;
			}

			// Kirim data sebagai JSON dengan header yang tepat
			const response = await fetch(`https://arpansi-enterprise.my.id/api/episodes/${params.id}`, {
				method: 'PUT',
				headers: {
					'Content-Type': 'application/json',
					Accept: 'application/json'
				},
				body: JSON.stringify(jsonData)
			});

			if (!response.ok) {
				const errorData = await response.json();
				console.error('Server error:', errorData);
				return { success: false, error: errorData };
			}

			const result = await response.json();
			console.log('Update response:', result); // Log untuk debugging
			return { success: true, data: result };
		} catch (err) {
			console.error('Error updating episode:', err);
			throw error(500, 'Failed to update episode');
		}
	}
} satisfies Actions;

// get all contents and load data to page
export const load: PageServerLoad = async ({ params }) => {
	const response = await fetch('https://arpansi-enterprise.my.id/api/contents');
	const response2 = await fetch(`https://arpansi-enterprise.my.id/api/episodes/${params.id}`);
	const data = await response.json();
	const data2 = await response2.json();
	return {
		contents: data.data,
		episodes: data2.data
	};
};
