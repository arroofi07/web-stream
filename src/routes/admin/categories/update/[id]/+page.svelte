<script lang="ts">
	import { enhance } from '$app/forms';
	import { toast } from 'svelte-sonner';
	import type { PageData, ActionData } from './$types';

	let { form, data } = $props<{ form: ActionData | null; data: PageData }>();
	let category = $state(data.category);
	let contents = $state(data.contents);

	if (form?.success) {
		toast.success('Content berhasil dibuat!');
	} else if (form) {
		toast.error('Content gagal dibuat!');
	}
</script>

<div class="container mx-auto p-4">
	<h1 class="mb-4 text-2xl font-bold">Update Kategori</h1>

	<form method="POST" action="?/update" use:enhance>
		<!-- content -->
		<div class="mb-4">
			<label for="content_ids" class="mb-2 block">Pilih Konten (bisa pilih lebih dari satu):</label
			>
			<select
				name="content_ids[]"
				id="content_ids"
				class="w-full rounded border p-2"
				multiple
				size="5"
			>
				<!-- Tampilkan konten yang sudah terpilih terlebih dahulu -->
				{#each category.contents || [] as content}
					<option value={content.id} selected>
						{content.title}
					</option>
				{/each}

				<!-- Tampilkan konten lain yang belum terpilih -->
				{#each (contents.data || []).filter((content: any) => !category.contents?.some((c: any) => c.id === content.id)) as content}
					<option value={content.id}>
						{content.title}
					</option>
				{/each}
			</select>
			<small class="mt-1 block text-gray-500"
				>Tekan Ctrl (atau Cmd di Mac) untuk memilih beberapa konten</small
			>
		</div>

		<div class="mb-4">
			<label for="name" class="mb-2 block">Nama Kategori:</label>
			<input
				value={category.name}
				type="text"
				id="name"
				name="name"
				class="w-full rounded border p-2"
				required
			/>
		</div>

		<div class="mb-4">
			<label for="description" class="mb-2 block">Deskripsi:</label>
			<textarea
				value={category.description}
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
