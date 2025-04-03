import type { PageServerLoad } from './$types';

export const load: PageServerLoad = async () => {
	const response = await fetch('https://arpansi-enterprise.my.id/api/contents');
	const data = await response.json();
	return {
		contents: data.data
	};
};
