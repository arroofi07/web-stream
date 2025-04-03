<script lang="ts">
	import { enhance } from '$app/forms';
	import type { ActionData, PageData } from './$types';
	import { toast } from 'svelte-sonner';
	import { goto } from '$app/navigation';
	let { data, form } = $props<{ data: PageData; form: ActionData }>();
	let genre = $state(data.genre.data);

	if (form?.success) {
		toast.success('Genre berhasil diubah!');
		goto('/admin/genres');
	} else if (form?.failed) {
		toast.error('Genre gagal diubah!');
	}
</script>

<div class="container mx-auto p-4">
	<h1 class="mb-4 text-2xl font-bold">Update Genre</h1>

	<form method="POST" action="?/update" use:enhance>
		<div class="mb-4">
			<label for="name" class="mb-2 block">Nama Genre:</label>
			<input
				type="text"
				id="name"
				name="name"
				class="w-full rounded border p-2"
				required
				value={genre.name}
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
				value={genre.description}
			></textarea>
		</div>

		<button type="submit" class="rounded bg-blue-500 px-4 py-2 text-white hover:bg-blue-600">
			Simpan Genre
		</button>
	</form>
</div>
