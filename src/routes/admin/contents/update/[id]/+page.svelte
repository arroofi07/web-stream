<script lang="ts">
	import { enhance } from '$app/forms';
	import { toast } from 'svelte-sonner';
	import type { PageData, ActionData } from './$types';

	let { form, data } = $props<{ form: ActionData | null; data: PageData }>();
	let content = $state(data.content);

	if (form?.success) {
		toast.success('Content berhasil dibuat!');
	} else if (form) {
		toast.error('Content gagal dibuat!');
	}
</script>

<div class="container mx-auto p-4">
	<h1 class="mb-4 text-2xl font-bold">Update Content</h1>

	<form method="POST" action="?/update" use:enhance>
		<div class="mb-4 hidden">
			<label for="category_id" class="mb-2 block">Kategori:</label>
			<input
				type="text"
				id="category_id"
				name="category_id"
				class="w-full rounded border p-2"
				value={content.category_id}
			/>
		</div>

		<div class="mb-4">
			<label for="title" class="mb-2 block">Judul:</label>
			<input
				bind:value={content.title}
				type="text"
				id="title"
				name="title"
				class="w-full rounded border p-2"
				required
			/>
		</div>

		<div class="mb-4">
			<label for="total_episodes" class="mb-2 block">Total Episodes:</label>
			<input
				bind:value={content.total_episodes}
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
				<option value={content.status}>{content.status}</option>
				<option value="ongoing">ongoing</option>
				<option value="completed">completed</option>
			</select>
		</div>

		<div class="mb-4">
			<label for="country_origin" class="mb-2 block">Negara Asal:</label>
			<input
				bind:value={content.country_origin}
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
				value={new Date(content.release_date).toLocaleDateString()}
				type="string"
				id="release_date"
				name="release_date"
				class="w-full rounded border p-2"
				required
			/>
		</div>

		<div class="mb-4">
			<label for="description" class="mb-2 block">Deskripsi:</label>
			<textarea
				bind:value={content.description}
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
