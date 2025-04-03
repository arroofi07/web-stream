<script lang="ts">
	import { page } from '$app/stores';
	import { onMount } from 'svelte';
	import { toast } from 'svelte-sonner';
	import { Trash, Edit } from '@lucide/svelte';
	import { goto } from '$app/navigation';
	// Define the types for the data
	interface Episode {
		id: number;
		content_id: number;
		title: string;
		episode_number: number;
		description: string;
		duration: number;
		release_date: string;
	}

	interface StreamingLink {
		id: number;
		episode_id: number;
		server_name: string;
		quality: string;
		url: string;
		is_active: boolean;
		episode: Episode; // Changed from Array to single object
		created_at: string;
		updated_at: string;
	}

	interface PageEpisodeStructure {
		streamingLinks: StreamingLink[];
	}

	// Get the data from props
	const data = $page.data;
	const streamingLinks = data?.streamingLinks || [];

	// Filter options
	let filterQuality = '';
	let filterServer = '';
	let searchQuery = '';
	let qualityOptions: string[] = [];
	let serverOptions: string[] = [];

	// Get unique quality options
	$: qualityOptions = [
		...new Set(streamingLinks.map((link: StreamingLink) => link.quality))
	] as string[];

	// Get unique server options
	$: serverOptions = [
		...new Set(streamingLinks.map((link: StreamingLink) => link.server_name))
	] as string[];

	// Filter function
	$: filteredLinks =
		streamingLinks?.filter((link: StreamingLink) => {
			const matchesQuality = filterQuality ? link.quality === filterQuality : true;
			const matchesServer = filterServer ? link.server_name === filterServer : true;
			const matchesSearch = searchQuery
				? link.episode.title?.toLowerCase().includes(searchQuery.toLowerCase()) ||
					link.episode.description?.toLowerCase().includes(searchQuery.toLowerCase())
				: true;

			return matchesQuality && matchesServer && matchesSearch;
		}) || [];

	// For the embedded player
	let selectedLink: StreamingLink | null = null;

	function formatDate(dateString: string): string {
		const date = new Date(dateString);
		return date.toLocaleDateString();
	}

	function watchStream(link: StreamingLink) {
		selectedLink = link;
	}

	function closePlayer() {
		selectedLink = null;
	}

	// delete streaming link
	const deleteStreamingLink = async (id: number) => {
		const response = await fetch(`http://arpansi-enterprise.my.id/api/streaming-links/${id}`, {
			method: 'DELETE'
		});
		if (response.ok) {
			// Update the local state by filtering out the deleted link
			const updatedLinks = streamingLinks.filter((link: StreamingLink) => link.id !== id);
			// @ts-ignore - Reassigning a store value
			data.streamingLinks = updatedLinks;
			toast.success('Streaming link deleted successfully');
		} else {
			toast.error('Failed to delete streaming link');
		}
	};
</script>

<div class="container mx-auto px-4 py-8">
	<header class="mb-8">
		<h1 class="mb-2 text-3xl font-bold text-gray-800">Streaming Links</h1>
		<p class="text-gray-600">Browse and watch episodes from our collection</p>
	</header>

	<!-- Filters -->
	<div class="mb-6 rounded-lg bg-gray-100 p-4">
		<div class="flex flex-col gap-4 md:flex-row">
			<div class="flex-1">
				<label for="search" class="mb-1 block text-sm font-medium text-gray-700">Search</label>
				<input
					type="text"
					id="search"
					bind:value={searchQuery}
					placeholder="Search by title or description"
					class="w-full rounded-md border border-gray-300 p-2"
				/>
			</div>

			<div class="w-full md:w-1/4">
				<label for="quality" class="mb-1 block text-sm font-medium text-gray-700">Quality</label>
				<select
					id="quality"
					bind:value={filterQuality}
					class="w-full rounded-md border border-gray-300 p-2"
				>
					<option value="">All Qualities</option>
					{#each qualityOptions as quality}
						<option value={quality}>{quality}</option>
					{/each}
				</select>
			</div>

			<div class="w-full md:w-1/4">
				<label for="server" class="mb-1 block text-sm font-medium text-gray-700">Server</label>
				<select
					id="server"
					bind:value={filterServer}
					class="w-full rounded-md border border-gray-300 p-2"
				>
					<option value="">All Servers</option>
					{#each serverOptions as server}
						<option value={server}>{server}</option>
					{/each}
				</select>
			</div>

			<div class="flex w-full items-center justify-center pt-4 md:w-1/4">
				<button
					class="cursor-pointer rounded-md bg-blue-600 px-4 py-2 text-sm text-white transition-colors hover:bg-blue-700"
					onclick={() => goto('/admin/streaming-links/create')}
				>
					Add Streaming Link
				</button>
			</div>
		</div>
	</div>

	<!-- Link count -->
	<p class="mb-4 text-gray-600">Showing {filteredLinks.length} links</p>

	<!-- Player modal -->
	{#if selectedLink}
		<div class="bg-opacity-75 fixed inset-0 z-50 flex items-center justify-center bg-black p-4">
			<div class="w-full max-w-4xl rounded-lg bg-white">
				<div class="flex items-center justify-between border-b p-4">
					<h2 class="text-xl font-bold">
						{selectedLink.episode.title} - Episode {selectedLink.episode.episode_number}
					</h2>
					<button class="text-gray-500 hover:text-gray-700" onclick={closePlayer}>
						<svg
							xmlns="http://www.w3.org/2000/svg"
							class="h-6 w-6"
							fill="none"
							viewBox="0 0 24 24"
							stroke="currentColor"
						>
							<path
								stroke-linecap="round"
								stroke-linejoin="round"
								stroke-width="2"
								d="M6 18L18 6M6 6l12 12"
							/>
						</svg>
					</button>
				</div>
				<div class="aspect-w-16 aspect-h-9">
					<iframe
						title={`${selectedLink.episode.title} - Episode ${selectedLink.episode.episode_number}`}
						src={selectedLink.url}
						frameborder="0"
						allowfullscreen
						class="h-full w-full"
					></iframe>
				</div>
				<div class="p-4">
					<p class="mb-2 text-sm text-gray-600">
						Quality: {selectedLink.quality} | Server: {selectedLink.server_name}
					</p>
					<p class="mb-2">{selectedLink.episode.description}</p>
					<p class="text-sm text-gray-500">
						Duration: {selectedLink.episode.duration} minutes | Released: {formatDate(
							selectedLink.episode.release_date
						)}
					</p>
				</div>
			</div>
		</div>
	{/if}

	<!-- Links list -->
	<div class="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
		{#each filteredLinks as link}
			<div
				class="overflow-hidden rounded-lg border border-gray-200 bg-white shadow-md transition-shadow hover:shadow-lg"
			>
				<div class="p-4">
					<div class="mb-2 flex items-start justify-between">
						<h2 class="text-xl font-semibold">{link.episode.title}</h2>
						<span class="rounded-full bg-blue-100 px-2 py-1 text-xs text-blue-800"
							>Ep {link.episode.episode_number}</span
						>
					</div>

					<p class="mb-4 line-clamp-2 text-sm text-gray-600">{link.episode.description}</p>

					<div class="mb-4 flex flex-wrap gap-2">
						<span
							class="flex items-center rounded-full bg-gray-100 px-2 py-1 text-xs text-gray-800"
						>
							<svg
								xmlns="http://www.w3.org/2000/svg"
								class="mr-1 h-3 w-3"
								fill="none"
								viewBox="0 0 24 24"
								stroke="currentColor"
							>
								<path
									stroke-linecap="round"
									stroke-linejoin="round"
									stroke-width="2"
									d="M15 10l4.553-2.276A1 1 0 0121 8.618v6.764a1 1 0 01-1.447.894L15 14M5 18h8a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z"
								/>
							</svg>
							{link.quality}
						</span>
						<span
							class="flex items-center rounded-full bg-gray-100 px-2 py-1 text-xs text-gray-800"
						>
							<svg
								xmlns="http://www.w3.org/2000/svg"
								class="mr-1 h-3 w-3"
								fill="none"
								viewBox="0 0 24 24"
								stroke="currentColor"
							>
								<path
									stroke-linecap="round"
									stroke-linejoin="round"
									stroke-width="2"
									d="M5 12h14M5 12a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v4a2 2 0 01-2 2M5 12a2 2 0 00-2 2v4a2 2 0 002 2h14a2 2 0 002-2v-4a2 2 0 00-2-2H5z"
								/>
							</svg>
							{link.server_name}
						</span>
						<span
							class="flex items-center rounded-full bg-gray-100 px-2 py-1 text-xs text-gray-800"
						>
							<svg
								xmlns="http://www.w3.org/2000/svg"
								class="mr-1 h-3 w-3"
								fill="none"
								viewBox="0 0 24 24"
								stroke="currentColor"
							>
								<path
									stroke-linecap="round"
									stroke-linejoin="round"
									stroke-width="2"
									d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
								/>
							</svg>
							{link.episode.duration} min
						</span>
					</div>

					<div class="flex items-center justify-between">
						<span class="text-xs text-gray-500"
							>Released: {formatDate(link.episode.release_date)}</span
						>
						<button
							onclick={() => watchStream(link)}
							class="rounded-md bg-blue-600 px-4 py-2 text-sm text-white transition-colors hover:bg-blue-700"
							disabled={!link.is_active}
							class:opacity-50={!link.is_active}
						>
							{link.is_active ? 'Watch Now' : 'Unavailable'}
						</button>
					</div>
					<div class="flex items-start justify-start gap-2">
						<button
							onclick={() => deleteStreamingLink(link.id)}
							class="cursor-pointer rounded-md bg-red-600 px-4 py-2 text-sm text-white transition-colors hover:bg-red-700"
						>
							<Trash class="h-4 w-4" />
						</button>
						<button
							onclick={() => goto(`/admin/streaming-links/update/${link.id}`)}
							class="cursor-pointer rounded-md bg-blue-600 px-4 py-2 text-sm text-white transition-colors hover:bg-blue-700"
						>
							<Edit class="h-4 w-4" />
						</button>
					</div>
				</div>
			</div>
		{/each}
	</div>

	<!-- Empty state -->
	{#if filteredLinks.length === 0}
		<div class="py-12 text-center">
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
					d="M3 9a2 2 0 012-2h.93a2 2 0 001.664-.89l.812-1.22A2 2 0 0110.07 4h3.86a2 2 0 011.664.89l.812 1.22A2 2 0 0018.07 7H19a2 2 0 012 2v9a2 2 0 01-2 2H5a2 2 0 01-2-2V9z"
				/>
				<path
					stroke-linecap="round"
					stroke-linejoin="round"
					stroke-width="2"
					d="M15 13a3 3 0 11-6 0 3 3 0 016 0z"
				/>
			</svg>
			<h3 class="mb-2 text-lg font-medium text-gray-900">No streaming links found</h3>
			<p class="mx-auto max-w-md text-gray-500">
				Try adjusting your filters or search terms to find what you're looking for.
			</p>
		</div>
	{/if}
</div>

<style>
	/* For the aspect ratio of the video player */
	.aspect-w-16 {
		position: relative;
		padding-bottom: 56.25%; /* 16:9 Aspect Ratio */
	}

	.aspect-h-9 {
		height: 0;
	}

	.aspect-w-16 iframe {
		position: absolute;
		top: 0;
		left: 0;
		width: 100%;
		height: 100%;
	}

	/* For text truncation */
	.line-clamp-2 {
		display: -webkit-box;
		-webkit-line-clamp: 2;
		-webkit-box-orient: vertical;
		overflow: hidden;
	}
</style>
