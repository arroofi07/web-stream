import type { Handle } from '@sveltejs/kit';

export const handle: Handle = async ({ event, resolve }) => {
	const token = event.cookies.get('token');

	// Pastikan token ada dan sesuai dengan yang diharapkan
	if (event.url.pathname.startsWith('/admin')) {
		if (!token || token !== 'ini-sandi-parahnih-jadi-harus-masuk-dengan-ini-0705200420040507') {
			return new Response('Unauthorized, kamu tidak bisa mengakses halaman ini', { status: 401 });
		}
	}

	return resolve(event);
};
