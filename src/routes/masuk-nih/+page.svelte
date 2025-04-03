<script lang="ts">
	import { onMount } from 'svelte';
	import { enhance } from '$app/forms';
	import { Button } from '@/components/ui/button';
	import { Input } from '@/components/ui/input';
	import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

	let token1 = '';
	let token2 = '';
	let token3 = '';
	let token4 = '';
</script>

<div
	class="flex min-h-screen items-center justify-center bg-gradient-to-r from-blue-500 to-purple-600"
>
	<Card class="w-full max-w-md rounded-2xl bg-white p-6 shadow-xl">
		<CardHeader>
			<CardTitle class="text-center text-2xl font-bold">Login</CardTitle>
		</CardHeader>
		<CardContent>
			<form action="?/masuk-nih" method="POST" use:enhance class="space-y-4">
				<Input name="token1" bind:value={token1} placeholder="Token 1" class="w-full" />
				<Input name="token2" bind:value={token2} placeholder="Token 2" class="w-full" />
				<Input name="token3" bind:value={token3} placeholder="Token 3" class="w-full" />
				<Input name="token4" bind:value={token4} placeholder="Token 4" class="w-full" />
				<Button type="submit" class="w-full">Submit</Button>
			</form>
		</CardContent>
	</Card>
</div>
