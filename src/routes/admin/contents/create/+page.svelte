<script lang="ts">
	import { enhance } from '$app/forms';
	import { toast } from 'svelte-sonner';
	import { goto } from '$app/navigation';

	// $effect(() => {
	// 	toast.success('Content berhasil dibuat!');
	// });

	/** @type {import('./$types').ActionData} */
	export let form; // Ini akan berisi return data dari server action

	$: if (form?.success) {
		toast.success('Content berhasil dibuat!');
		goto('/admin/contents');
	} else if (form?.failed) {
		toast.error('Content gagal dibuat!');
	}
</script>

<div class="container mx-auto p-4">
	<h1 class="mb-4 text-2xl font-bold">Tambah Content Baru</h1>

	<form method="POST" action="?/create" use:enhance enctype="multipart/form-data">
		<div class="mb-4">
			<label for="title" class="mb-2 block">Judul:</label>
			<input type="text" id="title" name="title" class="w-full rounded border p-2" required />
		</div>

		<div class="mb-4">
			<label for="thumbnail" class="mb-2 block">Thumbnail:</label>
			<input
				type="file"
				id="thumbnail"
				name="thumbnail"
				class="w-full rounded border p-2"
				required
			/>
		</div>

		<div class="mb-4">
			<label for="cover_image" class="mb-2 block">Cover Image:</label>
			<input
				type="file"
				id="cover_image"
				name="cover_image"
				class="w-full rounded border p-2"
				required
			/>
		</div>

		<div class="mb-4">
			<label for="total_episodes" class="mb-2 block">Total Episodes:</label>
			<input
				type="number"
				id="total_episodes"
				name="total_episodes"
				class="w-full rounded border p-2"
				required
			/>
		</div>

		<div class="mb-4">
			<label for="status" class="mb-2 block">Status:</label>
			<select id="status" name="status" class="w-full rounded border p-2">
				<option value="ongoing">ongoing</option>
				<option value="completed">completed</option>
			</select>
		</div>

		<div class="mb-4">
			<label for="country_origin" class="mb-2 block">Negara Asal:</label>
			<input
				type="text"
				id="country_origin"
				name="country_origin"
				class="w-full rounded border p-2"
				required
			/>
		</div>

		<div class="mb-4">
			<label for="release_date" class="mb-2 block">Tanggal Rilis:</label>
			<input
				type="date"
				id="release_date"
				name="release_date"
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
				required
			></textarea>
		</div>

		<button type="submit" class="rounded bg-blue-500 px-4 py-2 text-white hover:bg-blue-600">
			Simpan Content
		</button>
	</form>
</div>
