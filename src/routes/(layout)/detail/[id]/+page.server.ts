import type { PageServerLoad } from './$types';

export const load: PageServerLoad = async ({ params }) => {
	const response = await fetch(`https://arpansi-enterprise.my.id/api/episodes/${params.id}`, {
		method: 'GET'
	});
	const data = await response.json();

	return {
		episodes: data.data
	};
};
