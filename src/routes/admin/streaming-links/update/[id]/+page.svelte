<script lang="ts">
	import { enhance } from '$app/forms';
	import { toast } from 'svelte-sonner';
	import { goto } from '$app/navigation';
	import type { PageData } from './$types';

	// Define the structure of your data
	interface PageDataStructure {
		episodes: Array<{
			id: number;
			title: string;
			episode_number: number;
		}>;
		streamingLink: {
			id: number;
			server_name: string;
			episode_id: number;
			quality: string;
			url: string;
			is_active: boolean;
		};
	}

	// Get the data from the server
	export let data: PageDataStructure;

	// For debugging
	// $: console.log('Contents:', data.contents);
	// $: console.log('Episode:', data.episodes);

	/** @type {import('./$types').ActionData} */
	export let form;

	$: if (form?.success) {
		toast.success('Streaming link berhasil diupdate!');
		goto('/admin/streaming-links');
	} else if (form?.failed) {
		toast.error('Streaming link gagal diupdate!');
	}
</script>

<div class="container mx-auto p-4">
	<h1 class="mb-4 text-2xl font-bold">Update Streaming Link</h1>

	<form method="POST" action="?/update" enctype="multipart/form-data" use:enhance>
		<div>
			<label for="episode_id" class="mb-2 block">Episode_id :</label>
			<select id="episode_id" name="episode_id" class="w-full rounded border p-2">
				{#each data.episodes as episode}
					<option value={episode.id} selected={episode.id === data.streamingLink.episode_id}
						>{episode.title}, {episode.episode_number}</option
					>
				{/each}
			</select>
		</div>

		<div class="mb-4">
			<label for="server_name" class="mb-2 block">Server Name:</label>
			<input
				value={data.streamingLink.server_name}
				type="text"
				id="server_name"
				name="server_name"
				class="w-full rounded border p-2"
				required
			/>
		</div>
		<div class="mb-4">
			<label for="quality" class="mb-2 block">Quality:</label>
			<select name="quality" id="quality" class="w-full rounded border p-2">
				<option value="1080p" selected={data.streamingLink.quality === '1080p'}>1080p</option>
				<option value="720p" selected={data.streamingLink.quality === '720p'}>720p</option>
				<option value="480p" selected={data.streamingLink.quality === '480p'}>480p</option>
			</select>
		</div>

		<div class="mb-4">
			<label for="url" class="mb-2 block">URL:</label>
			<textarea id="url" name="url" class="w-full rounded border p-2" rows="4" required
				>{data.streamingLink.url}</textarea
			>
		</div>

		<div class="mb-4">
			<label for="is_active" class="mb-2 block">Is Active:</label>
			<select name="is_active" id="is_active" class="w-full rounded border p-2">
				<option value="1" selected={data.streamingLink.is_active}> True </option>
				<option value="0" selected={!data.streamingLink.is_active}> False </option>
			</select>
		</div>

		<button type="submit" class="rounded bg-blue-500 px-4 py-2 text-white hover:bg-blue-600">
			Update Streaming Link
		</button>
	</form>
</div>
