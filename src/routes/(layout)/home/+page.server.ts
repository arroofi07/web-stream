import type { PageServerLoad } from './$types';

export const load: PageServerLoad = async () => {
	// Data donghua (contoh)
	const featuredDonghua = [
		{
			title: 'Soul Land',
			image: '/images/soul-land.jpg',
			episode: 'Episode 265',
			rating: '4.8'
		},
		{
			title: 'Battle Through The Heavens',
			image: '/images/btth.jpg',
			episode: 'Episode 192',
			rating: '4.7'
		}
		// ... existing code ...
	];

	return {
		featuredDonghua
	};
};
