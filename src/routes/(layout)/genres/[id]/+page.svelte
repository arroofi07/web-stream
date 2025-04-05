<script lang="ts">
	import type { PageData } from './$types';
	import { fade, fly } from 'svelte/transition';
	import { Button } from '$lib/components/ui/button';
	import { goto } from '$app/navigation';
	// Define types based on API response
	interface Content {
		id: number;
		category_id: number | null;
		title: string;
		description: string;
		thumbnail: string;
		cover_image: string;
		total_episodes: number;
		status: string;
		release_date: string;
		country_origin: string;
		created_at: string;
		updated_at: string;
		pivot?: any;
	}

	interface Episode {
		id: number;
		content_id: number;
		title: string;
		episode_number: number;
		description: string;
		duration: number;
		release_date: string;
		content: Content;
		streaming_links: Array<{
			id: number;
			episode_id: number;
			server_name: string;
			quality: string;
			url: string;
			is_active: boolean;
		}>;
		created_at: string;
		updated_at: string;
	}
	interface Genre {
		id: number;
		name: string;
		description: string;
		created_at: string;
		updated_at: string;
		contents: Content[];
	}

	let { data } = $props<{ data: any }>();

	// More detailed debugging
	$inspect('Full data object:', data);
	$inspect('data.data:', data.data);
	$inspect('data.data.genre:', data.data.genre);
	$inspect('data.data.allContents:', data.data.allContents);

	// Extract data from the API response based on the actual structure
	const genre: Genre = data.data.genre;
	const allContents: Content[] = data.data.allContents || [];
	const episodes: Episode[] = data.data.episodes || [];

	// If genre is undefined, try to create a placeholder from the URL
	let genreName = '';
	if (!genre) {
		// Try to extract genre name from URL
		const urlParts = window.location.pathname.split('/');
		const genreId = urlParts[urlParts.length - 1];
		genreName = decodeURIComponent(genreId);
	}

	$inspect('Genre:', genre);
	$inspect('Genre contents:', genre?.contents);

	// Extract content IDs from genre.contents
	const genreContentIds = genre?.contents?.map((content) => content.id) || [];

	// Filter allContents to match the content IDs in genre.contents
	const filteredContents = $derived(
		allContents.filter((content) => genreContentIds.includes(content.id))
	);

	// Format date function
	function formatDate(dateString: string): string {
		const date = new Date(dateString);
		return date.toLocaleDateString('id-ID', {
			year: 'numeric',
			month: 'long',
			day: 'numeric'
		});
	}

	// View mode - grid or list
	let viewMode: 'grid' | 'list' = 'grid';

	// Add loading state similar to home page
	let isLoading = $state(false);
	let loadingContentId = $state<number | null>(null);

	// Function to handle navigation with loading
	async function navigateToDetail(id: number, contentId: number) {
		isLoading = true;
		loadingContentId = contentId;

		// Short timeout for better responsiveness
		await new Promise((resolve) => setTimeout(resolve, 500));

		goto(`/detail/${id}`);
	}
</script>

<svelte:head>
	{#if genre}
		<title>{genre.name} | Donghua App</title>
		<meta name="description" content="Browse content in the {genre.name} category" />
	{:else}
		<title>Genre | Donghua App</title>
		<meta name="description" content="Browse content by genre" />
	{/if}
</svelte:head>

<!-- Enhanced Hero banner section with parallax effect -->
<div class="relative mb-8 overflow-hidden bg-gradient-to-br from-gray-900 to-gray-800 md:mb-16">
	<!-- Animated background pattern -->
	<div class="absolute inset-0 opacity-20">
		<div class="parallax-bg">
			<svg xmlns="http://www.w3.org/2000/svg" width="100%" height="100%">
				<defs>
					<pattern id="pattern" width="100" height="100" patternUnits="userSpaceOnUse">
						<circle cx="50" cy="50" r="20" fill="none" stroke="currentColor" stroke-width="2" />
						<circle cx="0" cy="0" r="10" fill="none" stroke="currentColor" stroke-width="1" />
						<circle cx="100" cy="100" r="15" fill="none" stroke="currentColor" stroke-width="1.5" />
					</pattern>
				</defs>
				<rect width="100%" height="100%" fill="url(#pattern)" />
			</svg>
		</div>
	</div>

	<div class="relative container mx-auto px-4 py-12 md:py-24">
		<div class="max-w-2xl">
			<div
				class="bg-primary/30 text-primary mb-4 inline-block rounded-full px-4 py-1.5 text-xs font-medium backdrop-blur-sm sm:px-6 sm:py-2 sm:text-sm"
				in:fade={{ duration: 400, delay: 150 }}
			>
				Explore Genre
			</div>
			<h1
				class="mb-4 text-3xl font-extrabold tracking-tight text-white sm:text-4xl md:mb-6 md:text-5xl lg:text-6xl"
				in:fade={{ duration: 400, delay: 250 }}
			>
				<span
					class="from-primary to-primary-light text-primary bg-gradient-to-r bg-clip-text capitalize"
					>{genre?.name || 'Genre'}</span
				>
			</h1>
			<div
				class="flex flex-wrap items-center gap-2 sm:gap-3"
				in:fade={{ duration: 400, delay: 450 }}
			>
				<div
					class="rounded-full bg-gray-800/70 px-3 py-1.5 text-xs font-medium text-white shadow-lg backdrop-blur-sm sm:px-5 sm:py-2.5 sm:text-sm"
				>
					<span class="text-primary font-bold">{filteredContents.length}</span> Content
				</div>
				<div
					class="rounded-full bg-gray-800/70 px-3 py-1.5 text-xs font-medium text-white shadow-lg backdrop-blur-sm sm:px-5 sm:py-2.5 sm:text-sm"
				>
					Genre <span class="text-primary font-bold">{genre?.name || 'Genre'}</span>
				</div>
			</div>
		</div>
	</div>

	<!-- Decorative elements -->
	<div class="bg-primary/10 absolute right-0 -bottom-10 h-40 w-1/3 rounded-full blur-3xl"></div>
	<div class="bg-primary/20 absolute top-20 -right-20 h-40 w-40 rounded-full blur-3xl"></div>
</div>

<section class="container mx-auto px-4 pb-12 md:pb-24">
	<!-- Enhanced filtering and view controls -->
	<div
		class="mb-6 flex flex-wrap items-center justify-between gap-3 rounded-xl bg-gray-100/50 p-3 shadow-sm backdrop-blur-sm md:mb-10 md:rounded-2xl md:p-4 dark:bg-gray-800/50"
	>
		<div class="flex items-center">
			<h2 class="text-base font-bold md:text-xl">
				Showing <span class="text-primary font-extrabold">{filteredContents.length}</span> results
			</h2>
		</div>

		<div class="flex items-center space-x-2 md:space-x-3">
			<Button
				class={`flex h-10 w-10 items-center justify-center rounded-lg transition-all duration-300 md:h-12 md:w-12 md:rounded-xl ${viewMode === 'grid' ? 'bg-primary shadow-primary/30 text-white shadow-lg' : 'bg-gray-200 text-gray-700 dark:bg-gray-700 dark:text-gray-300'}`}
				on:click={() => (viewMode = 'grid')}
			>
				<svg
					xmlns="http://www.w3.org/2000/svg"
					width="18"
					height="18"
					viewBox="0 0 24 24"
					fill="none"
					stroke="currentColor"
					stroke-width="2"
					stroke-linecap="round"
					stroke-linejoin="round"
				>
					<rect x="3" y="3" width="7" height="7"></rect>
					<rect x="14" y="3" width="7" height="7"></rect>
					<rect x="3" y="14" width="7" height="7"></rect>
					<rect x="14" y="14" width="7" height="7"></rect>
				</svg>
			</Button>
			<Button
				class={`flex h-10 w-10 items-center justify-center rounded-lg transition-all duration-300 md:h-12 md:w-12 md:rounded-xl ${viewMode === 'list' ? 'bg-primary shadow-primary/30 text-white shadow-lg' : 'bg-gray-200 text-gray-700 dark:bg-gray-700 dark:text-gray-300'}`}
				on:click={() => (viewMode = 'list')}
			>
				<svg
					xmlns="http://www.w3.org/2000/svg"
					width="18"
					height="18"
					viewBox="0 0 24 24"
					fill="none"
					stroke="currentColor"
					stroke-width="2"
					stroke-linecap="round"
					stroke-linejoin="round"
				>
					<line x1="8" y1="6" x2="21" y2="6"></line>
					<line x1="8" y1="12" x2="21" y2="12"></line>
					<line x1="8" y1="18" x2="21" y2="18"></line>
					<line x1="3" y1="6" x2="3" y2="6"></line>
					<line x1="3" y1="12" x2="3" y2="12"></line>
					<line x1="3" y1="18" x2="3" y2="18"></line>
				</svg>
			</Button>
		</div>
	</div>

	{#if filteredContents.length > 0}
		{#if viewMode === 'grid'}
			<div
				class="xs:grid-cols-2 grid grid-cols-1 gap-4 sm:grid-cols-2 sm:gap-6 md:grid-cols-3 md:gap-8 lg:grid-cols-4 xl:grid-cols-5"
				in:fade={{ duration: 300, delay: 150 }}
			>
				{#each filteredContents as content, i (content.id)}
					{@const matchingEpisode = episodes.find((episode) => episode.content_id === content.id)}
					<a
						href={matchingEpisode ? `/detail/${matchingEpisode.id}` : '#'}
						class={`group hover:shadow-primary/10 relative flex h-full flex-col overflow-hidden rounded-xl bg-white shadow-xl transition-all duration-500 hover:-translate-y-2 hover:shadow-2xl md:rounded-2xl dark:bg-gray-800 ${!matchingEpisode ? 'cursor-default' : 'cursor-pointer'}`}
						in:fly={{ y: 20, duration: 300, delay: 100 + i * 50 }}
						on:click|preventDefault={() => {
							if (matchingEpisode) {
								navigateToDetail(matchingEpisode.id, content.id);
							}
						}}
					>
						<div class="relative aspect-[2/3] overflow-hidden">
							<img
								src={content.thumbnail}
								alt={content.title}
								class="h-full w-full object-cover transition-all duration-500 group-hover:scale-110"
								loading="lazy"
							/>
							<div
								class="absolute inset-0 bg-gradient-to-t from-black/80 via-black/40 to-transparent opacity-80"
							></div>

							{#if isLoading && loadingContentId === content.id}
								<div
									class="absolute inset-0 flex items-center justify-center bg-black/60 transition-opacity"
								>
									<div
										class="h-8 w-8 animate-spin rounded-full border-4 border-white border-t-transparent"
									></div>
								</div>
							{/if}

							{#if matchingEpisode}
								<div class="absolute top-3 right-3">
									<span
										class="bg-primary flex items-center gap-1 rounded-full px-2.5 py-1.5 text-xs font-bold text-white shadow-lg"
									>
										<svg
											xmlns="http://www.w3.org/2000/svg"
											class="h-3.5 w-3.5"
											viewBox="0 0 24 24"
											fill="none"
											stroke="currentColor"
											stroke-width="3"
											stroke-linecap="round"
											stroke-linejoin="round"
										>
											<polygon points="5 3 19 12 5 21 5 3"></polygon>
										</svg>
										Watch
									</span>
								</div>
							{/if}

							<div class="absolute bottom-0 left-0 w-full p-4">
								<h3 class="mb-1 line-clamp-2 text-lg font-bold text-white md:text-xl">
									{content.title}
								</h3>
								<div class="flex flex-wrap gap-2">
									<span
										class="inline-flex items-center rounded-full bg-gray-800/70 px-2.5 py-0.5 text-xs font-medium text-white backdrop-blur-sm"
									>
										{content.status}
									</span>
									<span
										class="inline-flex items-center rounded-full bg-gray-800/70 px-2.5 py-0.5 text-xs font-medium text-white backdrop-blur-sm"
									>
										{content.total_episodes} Episodes
									</span>
								</div>
							</div>
						</div>
						<div class="flex flex-1 flex-col p-4">
							<p class="mb-4 line-clamp-2 flex-1 text-sm text-gray-600 dark:text-gray-300">
								{content.description}
							</p>
							<div class="mt-auto flex items-center justify-between">
								<span class="text-xs text-gray-500 dark:text-gray-400">
									{formatDate(content.release_date)}
								</span>
							</div>
						</div>
					</a>
				{/each}
			</div>
		{:else}
			<div class="space-y-4 md:space-y-6" in:fade={{ duration: 300, delay: 150 }}>
				{#each filteredContents as content, i (content.id)}
					{@const matchingEpisode = episodes.find((episode) => episode.content_id === content.id)}
					<a
						href={matchingEpisode ? `/detail/${matchingEpisode.id}` : '#'}
						class={`group hover:shadow-primary/20 flex flex-col overflow-hidden rounded-xl bg-white shadow-lg transition-all duration-300 hover:-translate-x-1 hover:translate-y-0 hover:shadow-xl sm:flex-row md:rounded-2xl dark:bg-gray-800 ${!matchingEpisode ? 'cursor-default' : 'cursor-pointer'}`}
						in:fly={{ y: 20, duration: 300, delay: 100 + i * 50 }}
						on:click|preventDefault={() => {
							if (matchingEpisode) {
								navigateToDetail(matchingEpisode.id, content.id);
							}
						}}
					>
						<div class="relative h-48 w-full overflow-hidden sm:h-auto sm:w-1/3 md:w-1/4">
							<img
								src={content.thumbnail}
								alt={content.title}
								class="h-full w-full object-cover transition-all duration-500 group-hover:scale-110"
								loading="lazy"
							/>
							<div
								class="absolute inset-0 bg-gradient-to-r from-black/60 to-transparent opacity-0 transition-opacity duration-300 group-hover:opacity-100"
							></div>

							{#if isLoading && loadingContentId === content.id}
								<div
									class="absolute inset-0 flex items-center justify-center bg-black/60 transition-opacity"
								>
									<div
										class="h-8 w-8 animate-spin rounded-full border-4 border-white border-t-transparent"
									></div>
								</div>
							{/if}

							{#if matchingEpisode}
								<div class="absolute top-3 right-3 sm:hidden">
									<span
										class="bg-primary flex items-center gap-1 rounded-full px-2.5 py-1.5 text-xs font-bold text-white shadow-lg"
									>
										<svg
											xmlns="http://www.w3.org/2000/svg"
											class="h-3.5 w-3.5"
											viewBox="0 0 24 24"
											fill="none"
											stroke="currentColor"
											stroke-width="3"
											stroke-linecap="round"
											stroke-linejoin="round"
										>
											<polygon points="5 3 19 12 5 21 5 3"></polygon>
										</svg>
										Watch
									</span>
								</div>
							{/if}
						</div>
						<div class="flex flex-1 flex-col p-4 sm:p-6">
							<div class="flex items-start justify-between">
								<h3 class="mb-2 text-xl font-bold md:text-2xl">{content.title}</h3>
								{#if matchingEpisode}
									<div class="hidden sm:block">
										<span
											class="bg-primary flex items-center gap-1 rounded-full px-2.5 py-1.5 text-xs font-bold text-white shadow-lg"
										>
											<svg
												xmlns="http://www.w3.org/2000/svg"
												class="h-3.5 w-3.5"
												viewBox="0 0 24 24"
												fill="none"
												stroke="currentColor"
												stroke-width="3"
												stroke-linecap="round"
												stroke-linejoin="round"
											>
												<polygon points="5 3 19 12 5 21 5 3"></polygon>
											</svg>
											Watch
										</span>
									</div>
								{/if}
							</div>
							<div class="mb-3 flex flex-wrap gap-2">
								<span
									class="inline-flex items-center rounded-full bg-gray-200 px-2.5 py-0.5 text-xs font-medium text-gray-800 dark:bg-gray-700 dark:text-gray-200"
								>
									{content.status}
								</span>
								<span
									class="inline-flex items-center rounded-full bg-gray-200 px-2.5 py-0.5 text-xs font-medium text-gray-800 dark:bg-gray-700 dark:text-gray-200"
								>
									{content.total_episodes} Episodes
								</span>
								<span
									class="inline-flex items-center rounded-full bg-gray-200 px-2.5 py-0.5 text-xs font-medium text-gray-800 dark:bg-gray-700 dark:text-gray-200"
								>
									{content.country_origin}
								</span>
							</div>
							<p class="mb-4 flex-1 text-sm text-gray-600 dark:text-gray-300">
								{content.description}
							</p>
							<div class="flex items-center justify-between">
								<span class="text-xs text-gray-500 dark:text-gray-400">
									{formatDate(content.release_date)}
								</span>

								{#if matchingEpisode}
									<span
										class="from-primary to-primary-light inline-flex items-center rounded-full bg-gradient-to-r px-4 py-1.5 text-sm font-medium text-white shadow-sm transition-all duration-300 hover:shadow-md"
									>
										Watch Now
									</span>
								{:else}
									<span
										class="inline-flex items-center rounded-full bg-gray-200 px-4 py-1.5 text-sm font-medium text-gray-700 dark:bg-gray-700 dark:text-gray-300"
									>
										Coming Soon
									</span>
								{/if}
							</div>
						</div>
					</a>
				{/each}
			</div>
		{/if}
	{:else}
		<div
			class="flex flex-col items-center justify-center rounded-xl bg-white py-12 text-center shadow-xl md:rounded-2xl md:py-20 dark:bg-gray-800"
			in:fade={{ duration: 300, delay: 150 }}
		>
			<div class="mb-6 rounded-full bg-gray-100 p-4 md:mb-8 md:p-6 dark:bg-gray-700">
				<svg
					xmlns="http://www.w3.org/2000/svg"
					class="h-12 w-12 text-gray-500 md:h-20 md:w-20"
					fill="none"
					viewBox="0 0 24 24"
					stroke="currentColor"
				>
					<path
						stroke-linecap="round"
						stroke-linejoin="round"
						stroke-width="2"
						d="M7 4v16M17 4v16M3 8h18M3 16h18"
					/>
				</svg>
			</div>
			<h2 class="mb-2 text-xl font-bold md:mb-3 md:text-3xl">No content found</h2>
			<p class="mb-6 max-w-md text-sm text-gray-600 md:mb-8 md:text-base dark:text-gray-400">
				Maaf, tidak ada konten di {genre?.name || genreName}. Silakan coba kategori lainnya.
			</p>
			<a
				href="/genres"
				class="from-primary to-primary-dark hover:from-primary-dark hover:to-primary hover:shadow-primary/30 rounded-lg bg-gradient-to-r px-6 py-3 text-sm font-medium text-white transition-all duration-300 hover:shadow-lg md:rounded-xl md:px-8 md:py-4 md:text-base"
			>
				Lihat Semua Genre
			</a>
		</div>
	{/if}
</section>

<style>
	/* Enhanced animations and styling */
	.parallax-bg {
		animation: float 20s ease-in-out infinite;
		transform-origin: center;
	}

	@keyframes float {
		0%,
		100% {
			transform: translateY(0) scale(1);
		}
		50% {
			transform: translateY(-20px) scale(1.05);
		}
	}

	@keyframes pulse {
		0%,
		100% {
			transform: scale(1);
		}
		50% {
			transform: scale(1.05);
		}
	}

	/* Add responsive utilities */
	@media (max-width: 480px) {
		.xs\:grid-cols-2 {
			grid-template-columns: repeat(2, minmax(0, 1fr));
		}
	}

	/* Add hover effects */
	.card-hover-effect {
		transition: all 0.3s ease;
	}

	.card-hover-effect:hover {
		transform: translateY(-5px);
		box-shadow: 0 10px 25px -5px rgba(var(--color-primary), 0.1);
	}

	/* Improve loading animations */
	.content-fade-in {
		animation: contentFadeIn 0.5s ease forwards;
		opacity: 0;
	}

	@keyframes contentFadeIn {
		from {
			opacity: 0;
			transform: translateY(10px);
		}
		to {
			opacity: 1;
			transform: translateY(0);
		}
	}

	/* Enhanced card hover effects */
	a.group {
		position: relative;
		isolation: isolate;
		transform: translateZ(0);
		will-change: transform;
	}

	a.group::before {
		content: '';
		position: absolute;
		inset: 0;
		z-index: -1;
		border-radius: inherit;
		opacity: 0;
		transition: opacity 0.3s ease;
	}

	a.group:hover::before {
		opacity: 1;
		box-shadow: 0 0 0 2px var(--color-primary, #6366f1);
	}

	/* Improve image loading */
	img {
		background-color: #f3f4f6;
		transition:
			opacity 0.3s ease,
			transform 0.5s ease;
	}

	img[loading] {
		opacity: 0.5;
	}

	/* Enhance accessibility */
	a:focus-visible {
		outline: 2px solid var(--color-primary, #6366f1);
		outline-offset: 2px;
	}
</style>
