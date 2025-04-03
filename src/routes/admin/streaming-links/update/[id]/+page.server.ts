import type { PageServerLoad } from './$types';
import { error } from '@sveltejs/kit';

export const actions = {
	update: async ({ request, params }) => {
		try {
			const formData = await request.formData();

			const jsonData: any = {};
			for (const [key, value] of formData.entries()) {
				jsonData[key] = value;
			}

			const response = await fetch(
				`https://arpansi-enterprise.my.id/api/streaming-links/${params.id}`,
				{
					method: 'PUT',
					headers: {
						'Content-Type': 'application/json',
						Accept: 'application/json'
					},
					body: JSON.stringify(jsonData)
				}
			);

			if (!response.ok) {
				const errorData = await response.json();
				console.error('Server error:', errorData);
				return { success: false, error: errorData };
			}

			const result = await response.json();
			console.log('Update response:', result);
			return { success: true, data: result };
		} catch (error) {
			console.error('Error updating streaming link:', error);
			// throw error(500, 'Failed to update streaming link');
		}
	}
};

export const load: PageServerLoad = async ({ params }) => {
	// get streaming link by id
	const response = await fetch(`https://arpansi-enterprise.my.id/api/streaming-links/${params.id}`);
	const data = await response.json();

	// get all episodes
	const response2 = await fetch(`https://arpansi-enterprise.my.id/api/episodes`);
	const data2 = await response2.json();

	return {
		streamingLink: data.data,
		episodes: data2.data
	};
};
