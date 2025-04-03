import { redirect } from '@sveltejs/kit';

export const actions = {
	'masuk-nih': async (event) => {
		const allToken = ['070504', '405070', '040507', '705040'];
		const formData = await event.request.formData();
		const token1 = formData.get('token1') as string;
		const token2 = formData.get('token2') as string;
		const token3 = formData.get('token3') as string;
		const token4 = formData.get('token4') as string;

		if (
			allToken.includes(token1) &&
			allToken.includes(token2) &&
			allToken.includes(token3) &&
			allToken.includes(token4)
		) {
			await event.cookies.set(
				'token',
				'ini-sandi-parahnih-jadi-harus-masuk-dengan-ini-0705200420040507',
				{
					path: '/',
					secure: true,
					httpOnly: true,
					sameSite: 'strict',
					maxAge: 60 * 60 * 24 * 30
				}
			);
			throw redirect(302, '/admin');
		} else {
			return { error: 'Token salah' };
		}
	}
};
