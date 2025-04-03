<script lang="ts">
	import { Plus, Search, Edit, Trash2 } from '@lucide/svelte';
	import { Button } from '$lib/components/ui/button';
	import { goto } from '$app/navigation';
	import type { PageData } from './$types';
	import { toast } from 'svelte-sonner';

	let { data }: { data: PageData } = $props();
	let searchQuery = $state('');
	let selectedCategory = $state('');
	const dataCategories = data?.categories || [];
	let filteredCategories = $state(dataCategories);

	// Filter reaktif
	$effect(() => {
		filteredCategories = dataCategories.filter(
			(categories: any) =>
				categories.name?.toLowerCase().includes(searchQuery.toLowerCase()) &&
				(selectedCategory === '' || categories.name === selectedCategory)
		);
	});

	// handle delete
	const deleteCategories = async (id: number) => {
		try {
			const fetchData = await fetch(`https://arpansi-enterprise.my.id/api/categories/${id}`, {
				method: 'DELETE',
				headers: {
					'Content-Type': 'application/json'
				}
			});

			if (fetchData.ok) {
				toast.success('Kategori berhasil dihapus');
				window.location.reload();
			} else {
				const errorData = await fetchData.json().catch(() => null);
				toast.error(errorData?.message || 'Kategori gagal dihapus');
			}
		} catch (error) {
			toast.error('Terjadi kesalahan saat menghapus kategori');
			console.error(error);
		}
	};
</script>

<div class="mx-auto max-w-6xl p-6">
	<!-- Header Section -->
	<div class="mb-6 flex items-center justify-between">
		<div>
			<h1 class="text-3xl font-bold text-gray-900">Category Management</h1>
			<p class="text-sm text-gray-600">Manage your movie categories collection</p>
		</div>

		<Button
			class="flex items-center gap-2 rounded-lg bg-blue-600 px-4 py-2 text-white shadow hover:bg-blue-700"
			onclick={() => goto('/admin/categories/create')}
		>
			<Plus size={18} />
			Add New Category
		</Button>
	</div>

	<!-- Search and Filter Section -->
	<div class="mb-6 flex items-center gap-4">
		<div class="relative flex-1">
			<Search class="absolute top-1/2 left-3 h-4 w-4 -translate-y-1/2 text-gray-400" />
			<input
				type="text"
				placeholder="Search categories..."
				bind:value={searchQuery}
				class="w-full rounded-lg border border-gray-300 bg-white py-2 pr-4 pl-10 text-sm shadow-sm focus:border-blue-500 focus:ring focus:ring-blue-200"
			/>
		</div>
		<select bind:value={selectedCategory} class="rounded-lg border bg-white p-2 text-sm shadow-sm">
			<option value="">All Categories</option>
			{#each dataCategories as category}
				<option value={category.name}>{category.name}</option>
			{/each}
		</select>
	</div>

	<!-- Genres Grid -->
	<div class="grid grid-cols-1 gap-6 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
		{#each filteredCategories as category}
			<div
				class="group relative overflow-hidden rounded-xl border bg-white p-5 shadow-lg transition-all hover:shadow-xl"
			>
				<div class="flex items-center justify-between">
					<div
						class="flex h-12 w-12 items-center justify-center rounded-full bg-blue-500 font-bold text-white"
					>
						{category.name.charAt(0).toUpperCase()}
					</div>
					<!-- Action Buttons -->
					<div class="flex gap-2 opacity-0 transition-opacity group-hover:opacity-100">
						<button
							onclick={() => goto(`/admin/categories/update/${category.id}`)}
							class="rounded-full bg-gray-100 p-2 text-gray-600 hover:bg-gray-200"
						>
							<Edit size={16} />
						</button>
						<button
							onclick={() => deleteCategories(category.id)}
							class="rounded-full bg-red-100 p-2 text-red-500 hover:bg-red-200"
						>
							<Trash2 size={16} />
						</button>
					</div>
				</div>

				<div class="mt-3">
					<h3 class="font-semibold text-gray-800">{category.name}</h3>
					<p class="text-sm text-gray-500">{category.description}</p>
					<p class="text-sm text-gray-500">{category.contents.length} konten</p>
				</div>
			</div>
		{/each}
	</div>
</div>
