import type { PageServerLoad } from './$types';

export const load: PageServerLoad = async ({ params }) => {
	const id = params.id;
	const videoUrl = 'https://ok.ru/videoembed/7690537011817?nochat=1';

	return {
		id,
		videoUrl
	};
};
