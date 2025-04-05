<script>
	import { onMount } from 'svelte';
	import { goto } from '$app/navigation';

	onMount(() => {
		goto('/home');
	});
</script>

<div>
	<!-- Halaman ini akan otomatis redirect ke /home -->
	Redirecting...
</div>
