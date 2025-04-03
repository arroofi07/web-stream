import type { PageServerLoad } from './$types';

export const load: PageServerLoad = async () => {
	const response = await fetch('https://arpansi-enterprise.my.id/api/categories');
	const data = await response.json();
	return {
		categories: data
	};
};

