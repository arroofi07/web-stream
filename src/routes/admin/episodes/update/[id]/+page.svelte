<script lang="ts">
	import { enhance } from '$app/forms';
	import { toast } from 'svelte-sonner';
	import { goto } from '$app/navigation';
	import type { PageData } from './$types';

	// Define the structure of your data
	interface PageDataStructure {
		contents: Array<{
			id: number;
			title: string;
		}>;
		episodes: {
			id: number;
			content_id: number;
			title: string;
			description: string;
			duration: number;
			release_date: string;
			episode_number: number;
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
		toast.success('Episode berhasil diupdate!');
		goto('/admin/episodes');
	} else if (form?.failed) {
		toast.error('Episode gagal diupdate!');
	}
	 
</script>

<div class="container mx-auto p-4">
	<h1 class="mb-4 text-2xl font-bold">Update Episode</h1>

	<form method="POST" action="?/update" enctype="multipart/form-data" use:enhance>
		<div>
			<label for="content_id" class="mb-2 block">Content_id :</label>
			<select id="content_id" name="content_id" class="w-full rounded border p-2">
				{#each data.contents as content}
					<option value={content.id} selected={content.id === data.episodes.content_id}
						>{content.title}</option
					>
				{/each}
			</select>
		</div>

		<div class="mb-4">
			<label for="title" class="mb-2 block">Judul:</label>
			<input
				value={data.episodes.title}
				type="text"
				id="title"
				name="title"
				class="w-full rounded border p-2"
				required
			/>
		</div>
		<div class="mb-4">
			<label for="episode_number" class="mb-2 block">Episode number:</label>
			<input
				value={data.episodes.episode_number}
				type="number"
				id="episode_number"
				name="episode_number"
				class="w-full rounded border p-2"
				required
			/>
		</div>

		<div class="mb-4">
			<label for="description" class="mb-2 block">Deskripsi:</label>
			<textarea
				id="description"
				name="description"
				class="w-full rounded border p-2"
				rows="4"
				required>{data.episodes.description}</textarea
			>
		</div>

		<div class="mb-4">
			<label for="duration" class="mb-2 block">duration:</label>
			<input
				value={data.episodes.duration}
				type="number"
				id="duration"
				name="duration"
				class="w-full rounded border p-2"
			/>
		</div>

		<div class="mb-4">
			<label for="release_date" class="mb-2 block">Tanggal Rilis:</label>
			<input
				value={data.episodes.release_date}
				type="date"
				id="release_date"
				name="release_date"
				class="w-full rounded border p-2"
				required
			/>
		</div>

		<button type="submit" class="rounded bg-blue-500 px-4 py-2 text-white hover:bg-blue-600">
			Update Episode
		</button>
	</form>
</div>
