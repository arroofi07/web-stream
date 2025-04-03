<script lang="ts">
	import { enhance } from '$app/forms';
	import { toast } from 'svelte-sonner';
	import { goto } from '$app/navigation';

	interface PageEpisodeStructure {
		episodes: Array<{
			id: number;
			content_id: number;
			title: string;
			description: string;
			duration: number;
			release_date: string;
			episode_number: number;
		}>;
	}

	export let data: PageEpisodeStructure;

	/** @type {import('./$types').ActionData} */
	export let form; // Ini akan berisi return data dari server action

	$: if (form?.success) {
		toast.success('Streaming link berhasil dibuat!');
		goto('/admin/streaming-links');
	} else if (form?.failed) {
		toast.error('Streaming link gagal dibuat!');
	}
</script>

<div class="container mx-auto p-4">
	<h1 class="mb-4 text-2xl font-bold">Tambah Streaming Link Baru</h1>

	<form method="POST" action="?/create" use:enhance enctype="multipart/form-data">
		<div class="mb-4">
			<label for="episode_id" class="mb-2 block">Episode:</label>
			<select id="episode_id" name="episode_id" class="w-full rounded border p-2">
				{#each data.episodes as episode}
					<option value={episode.id}>{episode.title}, {episode.episode_number}</option>
				{/each}
			</select>
		</div>

		<div class="mb-4">
			<label for="server_name" class="mb-2 block">Server Name:</label>
			<input
				type="text"
				id="server_name"
				name="server_name"
				class="w-full rounded border p-2"
				required
			/>
		</div>

		<div class="mb-4">
			<select name="quality" id="quality" class="w-full rounded border p-2">
				<option value="1080p">1080p</option>
				<option value="720p">720p</option>
				<option value="480p">480p</option>
				<option value="360p">360p</option>
			</select>
		</div>

		<div class="mb-4">
			<label for="url" class="mb-2 block">URL:</label>
			<input type="text" id="url" name="url" class="w-full rounded border p-2" required />
		</div>

		<div class="mb-4">
			<select name="is_active" id="is_active" class="w-full rounded border p-2">
				<option value="1">Aktif</option>
				<option value="0">Tidak Aktif</option>
			</select>
		</div>

		<button type="submit" class="rounded bg-blue-500 px-4 py-2 text-white hover:bg-blue-600">
			Simpan Streaming Link
		</button>
	</form>
</div>
