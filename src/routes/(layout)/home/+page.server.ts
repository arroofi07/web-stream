import type { PageServerLoad } from './$types';
import talesOfHerdingGods from '$lib/assets/cover/tales-of-herding-gods.jpg';
import overGoddess from '$lib/assets/cover/over-goddess.jpg';

export const load: PageServerLoad = async () => {
	// Data donghua (contoh)
	const featuredDonghua = [
		{
			title: 'tales of herding gods',
			image: talesOfHerdingGods,
			episode: 'Episode 265',
			rating: '4.8'
		},
		{
			title: 'over-goddess',
			image: overGoddess,
			episode: 'Episode 192',
			rating: '4.7'
		}
	];

	return {
		featuredDonghua
	};
};
