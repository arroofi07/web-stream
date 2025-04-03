<script lang="ts">
	import { onMount } from 'svelte';
	import { fade, fly } from 'svelte/transition';
	import { toast, Toaster } from 'svelte-sonner';
	import { goto } from '$app/navigation';

	// Interface for episode data
	interface Episode {
		id: number;
		title: string;
		description: string;
		episode_number: number;
		duration: string;
		content_id: number;
		content: {
			title: string;
		};
		created_at: string;
		relevanceScore?: number; // New field for sorting
	}

	// Sample data - replace with actual data loading
	let episodes: Episode[] = [];
	let loading = true;
	let error: string | null = null;

	// Pagination
	let currentPage = 1;
	let totalPages = 1;
	let pageSize = 10;
	let totalItems = 0;

	// Search and filters
	let searchQuery = '';
	let tempSearchQuery = '';
	let selectedContentId: number | null = null;
	let contents: any[] = [];

	onMount(async () => {
		try {
			await loadContents();
			await loadEpisodes();
		} catch (err) {
			error = err instanceof Error ? err.message : 'Gagal memuat data episode';
			toast.error('Gagal memuat data episode');
		} finally {
			loading = false;
		}
	});

	async function loadEpisodes() {
		try {
			loading = true;
			let url = `https://arpansi-enterprise.my.id/api/episodes?page=${currentPage}&limit=${pageSize}`;

			// Store original search and filter values to use for scoring
			const localSearchQuery = searchQuery;
			const localContentId = selectedContentId;

			if (searchQuery) {
				url += `&search=${encodeURIComponent(searchQuery)}`;
			}

			if (selectedContentId) {
				url += `&content_id=${selectedContentId}`;
			}

			const response = await fetch(url);
			const data = await response.json();

			if (!response.ok) {
				throw new Error(data.message || 'Gagal memuat episode');
			}

			// Get episodes from response
			let loadedEpisodes = data.data;

			// Add relevance score to each episode
			loadedEpisodes = loadedEpisodes.map((episode: Episode) => {
				let score = 0;

				// Higher score for exact content match
				if (localContentId && episode.content_id === localContentId) {
					score += 100;
				}

				// Higher score for title match with search query
				if (
					localSearchQuery &&
					episode.title.toLowerCase().includes(localSearchQuery.toLowerCase())
				) {
					// More exact matches get higher scores
					const matchIndex = episode.title.toLowerCase().indexOf(localSearchQuery.toLowerCase());
					const matchQuality = 50 - matchIndex; // Earlier matches get higher scores
					score += Math.max(50, matchQuality);
				}

				return {
					...episode,
					relevanceScore: score
				};
			});

			// Sort episodes by relevance score
			loadedEpisodes.sort(
				(a: Episode, b: Episode) => (b.relevanceScore || 0) - (a.relevanceScore || 0)
			);

			episodes = loadedEpisodes;
			totalPages = data.meta?.last_page || 1;
			totalItems = data.meta?.total || episodes.length;
		} catch (err) {
			console.error('Error loading episodes:', err);
			throw err;
		} finally {
			loading = false;
		}
	}

	async function loadContents() {
		try {
			const response = await fetch('https://arpansi-enterprise.my.id/api/contents');
			const data = await response.json();
			contents = data.data;
		} catch (err) {
			console.error('Error loading contents:', err);
		}
	}

	function formatDate(dateString: string) {
		return new Date(dateString).toLocaleDateString('id-ID', {
			year: 'numeric',
			month: 'long',
			day: 'numeric'
		});
	}

	async function deleteEpisode(id: number) {
		if (!confirm('Apakah Anda yakin ingin menghapus episode ini?')) {
			return;
		}

		try {
			const response = await fetch(`https://arpansi-enterprise.my.id/api/episodes/${id}`, {
				method: 'DELETE'
			});

			if (!response.ok) {
				const errorData = await response.json();
				throw new Error(errorData.message || 'Gagal menghapus episode');
			}

			toast.success('Episode berhasil dihapus');
			await loadEpisodes();
		} catch (err) {
			toast.error(err instanceof Error ? err.message : 'Gagal menghapus episode');
			console.error('Error deleting episode:', err);
		}
	}

	function changePage(page: number) {
		if (page < 1 || page > totalPages) return;
		currentPage = page;
		loadEpisodes();
	}

	async function handleSearch(event?: Event) {
		event?.preventDefault();
		searchQuery = tempSearchQuery;
		currentPage = 1;
		await loadEpisodes();
	}

	async function handleContentFilter() {
		currentPage = 1;
		await loadEpisodes();
	}

	async function resetFilters() {
		tempSearchQuery = '';
		searchQuery = '';
		selectedContentId = null;
		currentPage = 1;
		await loadEpisodes();
	}

	function createNewEpisode() {
		goto('/admin/episodes/create');
	}

	function editEpisode(id: number) {
		goto(`/admin/episodes/update/${id}`);
	}

	// Generate pagination array with proper dots
	function getPaginationArray() {
		let paginationArray = [];

		// Always show first page
		paginationArray.push(1);

		// Logic for middle pages
		if (currentPage > 3) {
			paginationArray.push('...');
		}

		// Pages around current page
		for (
			let i = Math.max(2, currentPage - 1);
			i <= Math.min(totalPages - 1, currentPage + 1);
			i++
		) {
			if (i > 1 && i < totalPages) {
				paginationArray.push(i);
			}
		}

		// Add dots before last page if needed
		if (currentPage < totalPages - 2) {
			paginationArray.push('...');
		}

		// Always show last page if there is more than one page
		if (totalPages > 1) {
			paginationArray.push(totalPages);
		}

		return paginationArray;
	}
</script>

<Toaster richColors />

<div class="min-h-screen bg-gray-100">
	<div class="container mx-auto px-4 py-8">
		<div class="mb-8 flex flex-col md:flex-row md:items-center md:justify-between">
			<h1 class="mb-4 text-3xl font-bold text-gray-900 md:mb-0">Daftar Episode</h1>

			<button
				onclick={createNewEpisode}
				class="flex items-center justify-center rounded-lg bg-blue-600 px-4 py-2 font-medium text-white transition duration-200 hover:bg-blue-700"
			>
				<svg
					xmlns="http://www.w3.org/2000/svg"
					class="mr-2 h-5 w-5"
					viewBox="0 0 20 20"
					fill="currentColor"
				>
					<path
						fill-rule="evenodd"
						d="M10 3a1 1 0 011 1v5h5a1 1 0 110 2h-5v5a1 1 0 11-2 0v-5H4a1 1 0 110-2h5V4a1 1 0 011-1z"
						clip-rule="evenodd"
					/>
				</svg>
				Tambah Episode
			</button>
		</div>

		<!-- Search and Filter -->
		<div class="mb-6 rounded-lg bg-white p-4 shadow-md">
			<form onsubmit={handleSearch} class="grid grid-cols-1 gap-4 md:grid-cols-3">
				<div>
					<label for="search" class="mb-1 block text-sm font-medium text-gray-700"
						>Cari Episode</label
					>
					<div class="relative">
						<input
							type="text"
							id="search"
							bind:value={tempSearchQuery}
							placeholder="Cari berdasarkan judul..."
							class="w-full rounded-lg border border-gray-300 px-4 py-2 pr-10 focus:border-blue-500 focus:outline-none"
						/>
						<button
							type="submit"
							class="absolute top-1/2 right-2 -translate-y-1/2 text-gray-500 hover:text-blue-500"
						>
							<svg
								xmlns="http://www.w3.org/2000/svg"
								class="h-5 w-5"
								viewBox="0 0 20 20"
								fill="currentColor"
							>
								<path
									fill-rule="evenodd"
									d="M8 4a4 4 0 100 8 4 4 0 000-8zM2 8a6 6 0 1110.89 3.476l4.817 4.817a1 1 0 01-1.414 1.414l-4.816-4.816A6 6 0 012 8z"
									clip-rule="evenodd"
								/>
							</svg>
						</button>
					</div>
				</div>

				<div>
					<label for="content_filter" class="mb-1 block text-sm font-medium text-gray-700"
						>Filter Konten</label
					>
					<select
						id="content_filter"
						bind:value={selectedContentId}
						onchange={handleContentFilter}
						class="w-full rounded-lg border border-gray-300 px-4 py-2 focus:border-blue-500 focus:outline-none"
					>
						<option value={null}>Semua Konten</option>
						{#each contents as content}
							<option value={content.id}>{content.title}</option>
						{/each}
					</select>
				</div>

				<div class="flex items-end">
					<button
						type="button"
						onclick={resetFilters}
						class="rounded-lg bg-gray-200 px-4 py-2 text-gray-700 transition duration-200 hover:bg-gray-300"
					>
						Reset Filter
					</button>
				</div>
			</form>
		</div>

		{#if loading}
			<div class="flex items-center justify-center py-20" transition:fade>
				<div
					class="loader h-12 w-12 animate-spin rounded-full border-4 border-t-4 border-gray-200 border-t-blue-600"
				></div>
			</div>
		{:else if error}
			<div
				class="mb-6 rounded border-l-4 border-red-500 bg-red-100 p-4 text-red-700"
				transition:fade
			>
				<p class="font-medium">Terjadi kesalahan</p>
				<p>{error}</p>
			</div>
		{:else if episodes.length === 0}
			<div class="rounded-lg border border-gray-200 bg-gray-50 p-12 text-center" transition:fade>
				<svg
					xmlns="http://www.w3.org/2000/svg"
					class="mx-auto mb-4 h-16 w-16 text-gray-400"
					fill="none"
					viewBox="0 0 24 24"
					stroke="currentColor"
				>
					<path
						stroke-linecap="round"
						stroke-linejoin="round"
						stroke-width="2"
						d="M7 21h10a2 2 0 002-2V9.414a1 1 0 00-.293-.707l-5.414-5.414A1 1 0 0012.586 3H7a2 2 0 00-2 2v14a2 2 0 002 2z"
					/>
				</svg>
				<h3 class="mb-2 text-lg font-medium text-gray-900">Tidak ada episode</h3>
				<p class="mb-6 text-gray-600">Belum ada episode yang tersedia dengan filter saat ini.</p>
				<div class="flex flex-wrap justify-center gap-4">
					<button
						onclick={createNewEpisode}
						class="inline-flex items-center rounded-md border border-transparent bg-blue-600 px-4 py-2 text-sm font-medium text-white shadow-sm hover:bg-blue-700 focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 focus:outline-none"
					>
						Tambah Episode Baru
					</button>
					{#if searchQuery || selectedContentId !== null}
						<button
							onclick={resetFilters}
							class="inline-flex items-center rounded-md border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-700 shadow-sm hover:bg-gray-50 focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 focus:outline-none"
						>
							Hapus Filter
						</button>
					{/if}
				</div>
			</div>
		{:else}
			<div class="overflow-hidden rounded-lg bg-white shadow-md" transition:fade>
				<div class="overflow-x-auto">
					<table class="min-w-full divide-y divide-gray-200">
						<thead class="bg-gray-50">
							<tr>
								<th
									scope="col"
									class="px-6 py-3 text-left text-xs font-medium tracking-wider text-gray-500 uppercase"
									>Judul</th
								>
								<th
									scope="col"
									class="px-6 py-3 text-left text-xs font-medium tracking-wider text-gray-500 uppercase"
									>Konten</th
								>
								<th
									scope="col"
									class="px-6 py-3 text-left text-xs font-medium tracking-wider text-gray-500 uppercase"
									>Episode Number</th
								>
								<th
									scope="col"
									class="px-6 py-3 text-left text-xs font-medium tracking-wider text-gray-500 uppercase"
									>Durasi</th
								>
								<th
									scope="col"
									class="px-6 py-3 text-left text-xs font-medium tracking-wider text-gray-500 uppercase"
									>Tanggal Dibuat</th
								>
								<th
									scope="col"
									class="px-6 py-3 text-left text-xs font-medium tracking-wider text-gray-500 uppercase"
									>Aksi</th
								>
							</tr>
						</thead>
						<tbody class="divide-y divide-gray-200 bg-white">
							{#each episodes as episode, i (episode.id)}
								<tr
									in:fly={{ y: 20, duration: 300, delay: i * 50 }}
									class="transition-colors duration-150 hover:bg-gray-50"
								>
									<td class="px-6 py-4">
										<div class="text-sm font-medium text-gray-900">{episode.title}</div>
										{#if episode.description}
											<div class="mt-1 line-clamp-2 text-xs text-gray-500">
												{episode.description}
											</div>
										{/if}
									</td>
									<td class="px-6 py-4 whitespace-nowrap">
										<span
											class="inline-flex items-center rounded-full bg-blue-100 px-2.5 py-0.5 text-xs font-medium text-blue-800"
										>
											{episode.content?.title || `Konten #${episode.content_id}`}
										</span>
									</td>
									<td class="px-6 py-4 text-sm whitespace-nowrap text-gray-500">
										{episode.episode_number || '-'}
									</td>
									<td class="px-6 py-4 text-sm whitespace-nowrap text-gray-500">
										{episode.duration || '-'}
									</td>
									<td class="px-6 py-4 text-sm whitespace-nowrap text-gray-500">
										{formatDate(episode.created_at)}
									</td>
									<td class="px-6 py-4 text-right text-sm font-medium whitespace-nowrap">
										<div class="flex space-x-2">
											<button
												onclick={() => editEpisode(episode.id)}
												class="text-indigo-600 hover:text-indigo-900"
											>
												<svg
													xmlns="http://www.w3.org/2000/svg"
													class="h-5 w-5"
													viewBox="0 0 20 20"
													fill="currentColor"
												>
													<path
														d="M13.586 3.586a2 2 0 112.828 2.828l-.793.793-2.828-2.828.793-.793zM11.379 5.793L3 14.172V17h2.828l8.38-8.379-2.83-2.828z"
													/>
												</svg>
											</button>
											<button
												onclick={() => deleteEpisode(episode.id)}
												class="text-red-600 hover:text-red-900"
											>
												<svg
													xmlns="http://www.w3.org/2000/svg"
													class="h-5 w-5"
													viewBox="0 0 20 20"
													fill="currentColor"
												>
													<path
														fill-rule="evenodd"
														d="M9 2a1 1 0 00-.894.553L7.382 4H4a1 1 0 000 2v10a2 2 0 002 2h8a2 2 0 002-2V6a1 1 0 100-2h-3.382l-.724-1.447A1 1 0 0011 2H9zM7 8a1 1 0 012 0v6a1 1 0 11-2 0V8zm5-1a1 1 0 00-1 1v6a1 1 0 102 0V8a1 1 0 00-1-1z"
														clip-rule="evenodd"
													/>
												</svg>
											</button>
										</div>
									</td>
								</tr>
							{/each}
						</tbody>
					</table>
				</div>
			</div>

			<!-- Pagination -->
			{#if totalPages > 1}
				<div class="mt-6 flex items-center justify-between rounded-lg bg-white px-4 py-3 shadow-md">
					<div class="flex flex-1 justify-between sm:hidden">
						<button
							onclick={() => changePage(currentPage - 1)}
							disabled={currentPage === 1}
							class="relative inline-flex items-center rounded-md border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50 disabled:cursor-not-allowed disabled:opacity-50"
						>
							Sebelumnya
						</button>
						<button
							onclick={() => changePage(currentPage + 1)}
							disabled={currentPage === totalPages}
							class="relative ml-3 inline-flex items-center rounded-md border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50 disabled:cursor-not-allowed disabled:opacity-50"
						>
							Selanjutnya
						</button>
					</div>
					<div class="hidden sm:flex sm:flex-1 sm:items-center sm:justify-between">
						<div>
							<p class="text-sm text-gray-700">
								Menampilkan <span class="font-medium"
									>{episodes.length === 0 ? 0 : (currentPage - 1) * pageSize + 1}</span
								>
								sampai
								<span class="font-medium">{Math.min(currentPage * pageSize, totalItems)}</span>
								dari
								<span class="font-medium">{totalItems}</span> episode
							</p>
						</div>
						<div>
							<nav
								class="relative z-0 inline-flex -space-x-px rounded-md shadow-sm"
								aria-label="Pagination"
							>
								<button
									onclick={() => changePage(currentPage - 1)}
									disabled={currentPage === 1}
									class="relative inline-flex items-center rounded-l-md border border-gray-300 bg-white px-2 py-2 text-sm font-medium text-gray-500 hover:bg-gray-50 disabled:cursor-not-allowed disabled:opacity-50"
								>
									<span class="sr-only">Previous</span>
									<svg
										class="h-5 w-5"
										xmlns="http://www.w3.org/2000/svg"
										viewBox="0 0 20 20"
										fill="currentColor"
										aria-hidden="true"
									>
										<path
											fill-rule="evenodd"
											d="M12.707 5.293a1 1 0 010 1.414L9.414 10l3.293 3.293a1 1 0 01-1.414 1.414l-4-4a1 1 0 010-1.414l4-4a1 1 0 011.414 0z"
											clip-rule="evenodd"
										/>
									</svg>
								</button>

								{#each getPaginationArray() as page}
									{#if page === '...'}
										<span
											class="relative inline-flex items-center border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-700"
										>
											...
										</span>
									{:else}
										<button
											onclick={() => changePage(Number(page))}
											class={`relative inline-flex items-center border px-4 py-2 text-sm font-medium ${
												currentPage === page
													? 'z-10 border-blue-500 bg-blue-50 text-blue-600'
													: 'border-gray-300 bg-white text-gray-500 hover:bg-gray-50'
											}`}
										>
											{page}
										</button>
									{/if}
								{/each}

								<button
									onclick={() => changePage(currentPage + 1)}
									disabled={currentPage === totalPages}
									class="relative inline-flex items-center rounded-r-md border border-gray-300 bg-white px-2 py-2 text-sm font-medium text-gray-500 hover:bg-gray-50 disabled:cursor-not-allowed disabled:opacity-50"
								>
									<span class="sr-only">Next</span>
									<svg
										class="h-5 w-5"
										xmlns="http://www.w3.org/2000/svg"
										viewBox="0 0 20 20"
										fill="currentColor"
										aria-hidden="true"
									>
										<path
											fill-rule="evenodd"
											d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z"
											clip-rule="evenodd"
										/>
									</svg>
								</button>
							</nav>
						</div>
					</div>
				</div>
			{/if}
		{/if}
	</div>
</div>
