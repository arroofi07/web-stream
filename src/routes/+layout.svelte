<script lang="ts">
	import '../app.css';
	let { children } = $props();
	import { Toaster } from 'svelte-sonner';
</script>

{@render children()}
<Toaster  translate="yes" closeButton richColors  />
