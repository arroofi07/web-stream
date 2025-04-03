<script lang="ts">
	import { enhance } from '$app/forms';
	import type { ActionData, PageData } from './$types';
	import { toast } from 'svelte-sonner';
	import { goto } from '$app/navigation';

	/** @type {import('./$types').PageData} */
	export let data: PageData;

	/** @type {import('./$types').ActionData} */
	export let form;

	$: if (form?.success) {
		toast.success('Kategori berhasil dibuat!');
		goto('/admin/categories');
	} else if (form?.failed) {
		toast.error('Kategori gagal dibuat!');
	}
</script>

<div class="container mx-auto p-4">
	<h1 class="mb-4 text-2xl font-bold">Tambah Kategori Baru</h1>

	<form method="POST" action="?/create" use:enhance>
		<!-- content -->
		<div class="mb-4">
			<label for="content_ids" class="mb-2 block">Pilih Konten (bisa pilih lebih dari satu):</label>
			<select
				name="content_ids[]"
				id="content_ids"
				class="w-full rounded border p-2"
				multiple
				size="5"
			>
				{#each data.contents || [] as content}
					<option value={content.id}>{content.title}</option>
				{/each}
			</select>
			<small class="mt-1 block text-gray-500"
				>Tekan Ctrl (atau Cmd di Mac) untuk memilih beberapa konten</small
			>
		</div>

		<div class="mb-4">
			<label for="name" class="mb-2 block">Nama Kategori:</label>
			<input type="text" id="name" name="name" class="w-full rounded border p-2" required />
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
			Simpan Kategori
		</button>
	</form>
</div>
