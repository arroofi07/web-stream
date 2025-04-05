<script lang="ts">
	import { onMount, onDestroy, afterUpdate } from 'svelte';
	import { Button } from '$lib/components/ui/button';
	import {
		Card,
		CardContent,
		CardDescription,
		CardFooter,
		CardHeader,
		CardTitle
	} from '$lib/components/ui/card';
	import { Input } from '$lib/components/ui/input';
	import { fade, fly, scale } from 'svelte/transition';
	import { goto } from '$app/navigation';
	import { Search, Play, Star, X } from '@lucide/svelte';
	import overGoddess from '$lib/assets/cover/tales-of-herding-gods.jpg';
	import { page } from '$app/stores';
	import Ongoing from '$lib/components/ongoing.svelte';
	import { browser } from '$app/environment';

	interface typeData {
		data: {
			// contents start
			contents: Array<{
				id: number;
				category_id: number;
				title: string;
				description: string;
				thumbnail: string;
				cover_image: string;
				total_episodes: number;
				status: string;
				release_date: Date;
				country_origin: string;
			}>;
			// contents end

			// episode start
			episodes: Array<{
				id: number;
				content_id: number;
				title: string;
				episode_number: number;
				description: string;
				duration: number;
				release_date: Date;
				// content: {
				// 	id: number;
				// 	category_id: number;
				// 	title: string;
				// 	description: string;
				// 	thumbnail: string;
				// 	cover_image: string;
				// 	total_episodes: number;
				// 	status: string;
				// 	release_date: Date;
				// 	country_origin: string;
				// };
				streaming_links: Array<{
					id: number;
					episode_id: number;
					server_name: string;
					quality: string;
					url: string;
					is_active: boolean;
				}>;
			}>;

			// episode end

			// genres start
			categories: Array<{
				id: number;
				name: string;
				description: string;
				contents: Array<{
					id: number;
					title: string;
					description: string;
					thumbnail: string;
					cover_image: string;
				}>;
			}>;
			// genres end
		};
	}

	// Use $props() for Svelte 5 runes mode and define the correct type
	let { data } = $props<{ data: any }>();

	// Extract data from props
	let episodes = data.data?.episodes || [];
	let contents = data.data?.contents || [];
	let categories = data.data?.categories || [];

	// Precompute episode map for faster lookups
	const episodesByContentId = $state(new Map());

	// Get search query from URL using page store
	let searchQueryFromUrl = $state('');

	// Memoize content filtering for better performance
	let contentFilterCache = $state(new Map());

	$effect(() => {
		// Update searchQuery when URL changes
		const newSearchQuery = $page.url.searchParams.get('search') || '';

		// Only update if the query has changed
		if (newSearchQuery !== searchQueryFromUrl) {
			searchQueryFromUrl = newSearchQuery;
			searchQueryState = newSearchQuery;

			// If search query is empty, reset immediately without searching
			if (!newSearchQuery) {
				resetSearch(false);
			} else {
				handleSearch();
			}
		}
	});

	// State for animations
	let isPageLoaded = false;

	// State for hover effect
	let hoveredCard = $state(-1);

	// Add loading state
	let isLoading = $state(false);
	let loadingContentId = $state<number | null>(null);

	// Pagination state
	let currentPage = $state(1);
	let itemsPerPage = $state(10);
	let totalPages = $state(1);
	let paginatedContents = $state<typeof contents>([]);

	// Search functionality
	let searchQueryState = $state(searchQueryFromUrl || '');
	let filteredContents = $state<typeof contents>([]);
	let isSearching = $state(false);

	// State for cover image rotation
	let currentCoverIndex = $state(0);
	let coverImageInterval: number;
	let maxImagesToShow = 4; // Limit to first 4 images

	// Add loading state for genre links
	let loadingGenreId = $state<number | null>(null);

	// Add these variables for ad management
	let adLoaded = $state(false);
	let adAttempts = $state(0);
	const MAX_AD_ATTEMPTS = 3;

	// Add these variables for navigation tracking
	let isReturningToPage = $state(false);
	let pageVisits = $state(0);

	function changeCoverImage() {
		if (contents && contents.length > 0) {
			// Only use the first 4 images (or fewer if there aren't 4 available)
			const availableImages = Math.min(maxImagesToShow, contents.length);
			return contents[currentCoverIndex % availableImages].cover_image;
		}
		return '';
	}

	onMount(() => {
		isPageLoaded = true;
		pageVisits++;

		// Check if this is a return visit
		if (browser) {
			// Use sessionStorage to track if we're returning to the page
			const lastVisitedPage = sessionStorage.getItem('lastVisitedPage');
			if (lastVisitedPage && lastVisitedPage !== window.location.pathname) {
				isReturningToPage = true;
				// Fast refresh for returning users
				quickRefreshContent();
			}
			// Store current page for future reference
			sessionStorage.setItem('lastVisitedPage', window.location.pathname);
		}

		// Build episode map for faster lookups
		buildEpisodeMap();

		// Initialize filtered contents - use all contents if no search query
		if (!searchQueryState) {
			filteredContents = [...(contents || [])];
			updatePaginatedContents();
		} else {
			handleSearch();
		}

		// Start rotating cover images every 2 seconds
		if (contents && contents.length > 0) {
			coverImageInterval = setInterval(() => {
				// Only cycle through the first 4 images
				const availableImages = Math.min(maxImagesToShow, contents.length);
				currentCoverIndex = (currentCoverIndex + 1) % availableImages;
			}, 4000);
		}

		// Improved ad loading strategy with priority loading for returning users
		if (isReturningToPage) {
			// Load ads immediately for returning users
			loadAds(true);
		} else {
			// Normal loading for first visit
			loadAds();
		}

		// Add navigation event listener to detect when user is coming back to this page
		if (browser) {
			window.addEventListener('pageshow', handlePageShow);
		}
	});

	onDestroy(() => {
		if (coverImageInterval) {
			clearInterval(coverImageInterval);
		}

		// Clean up event listener
		if (browser) {
			window.removeEventListener('pageshow', handlePageShow);
		}
	});

	// Function to handle page show events (including back navigation)
	function handlePageShow(event) {
		// Check if the page is being loaded from cache (back/forward navigation)
		if (event.persisted) {
			isReturningToPage = true;
			// Perform a quick refresh when returning via back button
			quickRefreshContent();
			// Reload ads with priority
			loadAds(true);
		}
	}

	// Function to quickly refresh content without full page reload
	function quickRefreshContent() {
		console.log('Performing quick refresh of content');

		// Reset loading states
		isLoading = false;
		loadingContentId = null;
		loadingGenreId = null;

		// Rebuild episode map to ensure latest data
		buildEpisodeMap();

		// Update filtered and paginated contents
		if (!searchQueryState) {
			filteredContents = [...(contents || [])];
		} else {
			performSearch();
		}

		updatePaginatedContents();

		// Force UI update
		isPageLoaded = false;
		setTimeout(() => {
			isPageLoaded = true;
		}, 10);
	}

	// Build a map of content_id to episodes for faster lookups
	function buildEpisodeMap() {
		episodes.forEach((episode: { content_id: number }) => {
			if (!episodesByContentId.has(episode.content_id)) {
				episodesByContentId.set(episode.content_id, []);
			}
			episodesByContentId.get(episode.content_id).push(episode);
		});

		// Pre-sort episodes by id (descending) for each content
		episodesByContentId.forEach((eps, contentId) => {
			episodesByContentId.set(
				contentId,
				eps.sort((a: { id: number }, b: { id: number }) => b.id - a.id)
			);
		});
	}

	// Function to handle search with debounce
	let searchTimeout: number;
	function handleSearch() {
		// Show searching state immediately
		isSearching = true;

		// Clear any existing timeout
		clearTimeout(searchTimeout);

		// Set a timeout to debounce the search
		searchTimeout = setTimeout(() => {
			performSearch();
			isSearching = false;
		}, 50); // Reduced timeout for faster response
	}

	// Actual search implementation
	function performSearch() {
		// Reset to first page when searching
		currentPage = 1;

		const query = searchQueryState.trim().toLowerCase();

		// Check if we have cached results for this query
		if (contentFilterCache.has(query)) {
			filteredContents = contentFilterCache.get(query);
		} else {
			// Filter contents based on search query
			if (!query) {
				filteredContents = [...(contents || [])];
			} else {
				filteredContents = (contents || []).filter((content: { title: string }) =>
					content.title.toLowerCase().includes(query)
				);
			}

			// Cache the results
			contentFilterCache.set(query, filteredContents);
		}

		// Update URL with search parameter without page reload
		const url = new URL(window.location.href);
		if (query) {
			url.searchParams.set('search', searchQueryState);
		} else {
			url.searchParams.delete('search');
		}
		window.history.pushState({}, '', url);

		// Update paginated contents
		updatePaginatedContents();
	}

	// Function to update paginated contents - optimized version
	function updatePaginatedContents() {
		// Filter contents that have episodes - use our map for faster lookups
		const contentsWithEpisodes = filteredContents.filter(
			(content: { id: number }) =>
				episodesByContentId.has(content.id) && episodesByContentId.get(content.id).length > 0
		);

		// Sort by latest episode ID (highest first) - use our pre-sorted episodes
		const sortedContents = [...contentsWithEpisodes].sort((a, b) => {
			const latestEpisodeA = episodesByContentId.get(a.id)?.[0];
			const latestEpisodeB = episodesByContentId.get(b.id)?.[0];
			return (latestEpisodeB?.id || 0) - (latestEpisodeA?.id || 0);
		});

		// Calculate total pages
		totalPages = Math.ceil(sortedContents.length / itemsPerPage) || 1;

		// Get current page items
		const startIndex = (currentPage - 1) * itemsPerPage;
		const endIndex = startIndex + itemsPerPage;
		paginatedContents = sortedContents.slice(startIndex, endIndex);
	}

	// Function to change page
	function changePage(page: number) {
		if (page < 1 || page > totalPages) return;
		currentPage = page;
		updatePaginatedContents();
	}

	const string = $state('hello there!!');

	function navigate() {
		goto(`/detail/${string}`);
	}

	// Function to handle navigation with loading
	async function navigateToDetail(id: number, contentId: number) {
		isLoading = true;
		loadingContentId = contentId;

		// Shorter timeout for better responsiveness
		await new Promise((resolve) => setTimeout(resolve, 150));

		goto(`/detail/${id}`);
	}

	// Helper function to get latest episode for a content
	function getLatestEpisode(contentId: number) {
		return episodesByContentId.get(contentId)?.[0];
	}

	// Function to reset search
	function resetSearch(updateUrl = true) {
		// Clear search query
		searchQueryState = '';

		// Reset to first page
		currentPage = 1;

		// Use cached all contents if available
		if (contentFilterCache.has('')) {
			filteredContents = contentFilterCache.get('');
		} else {
			filteredContents = [...(contents || [])];
			contentFilterCache.set('', filteredContents);
		}

		// Update URL if needed
		if (updateUrl) {
			const url = new URL(window.location.href);
			url.searchParams.delete('search');
			window.history.pushState({}, '', url);
		}

		// Update paginated contents
		updatePaginatedContents();
	}

	// Function to handle genre navigation with loading
	async function navigateToGenre(genreId: number) {
		loadingGenreId = genreId;

		// Short timeout for better responsiveness
		await new Promise((resolve) => setTimeout(resolve, 200));

		goto(`/genres/${genreId}`);
	}

	// Function to load ads with retry mechanism
	function loadAds(isPriority = false) {
		// Load social bar script with better error handling
		if (!adLoaded && adAttempts < MAX_AD_ATTEMPTS) {
			adAttempts++;

			try {
				// Load the social bar script
				const socialBarScript = document.createElement('script');
				socialBarScript.type = 'text/javascript';
				socialBarScript.src =
					'//pl26302165.effectiveratecpm.com/2d/8c/88/2d8c88477fa6d1c610e37670b907ee53.js';
				socialBarScript.async = !isPriority; // Make it blocking for priority loads

				// Load the banner ad script
				const bannerAdScript = document.createElement('script');
				bannerAdScript.setAttribute('data-cfasync', 'false');
				bannerAdScript.src =
					'//pl26302113.effectiveratecpm.com/d561750ea858b8acfce6ddcf0eb58de7/invoke.js';
				bannerAdScript.async = !isPriority; // Make it blocking for priority loads

				// Add event listeners to track loading
				socialBarScript.onload = () => {
					console.log('Social bar script loaded successfully');
					adLoaded = true;
				};

				bannerAdScript.onload = () => {
					console.log('Banner ad script loaded successfully');

					// Create container if it doesn't exist
					if (!document.getElementById('container-d561750ea858b8acfce6ddcf0eb58de7')) {
						const container = document.createElement('div');
						container.id = 'container-d561750ea858b8acfce6ddcf0eb58de7';
						const adContainer = document.querySelector('.ad-container');
						if (adContainer) {
							adContainer.appendChild(container);
						}
					}
				};

				// Error handling
				socialBarScript.onerror = () => {
					console.error('Failed to load social bar script, retrying...');
					setTimeout(() => loadAds(isPriority), isPriority ? 500 : 1000); // Faster retry for priority
				};

				bannerAdScript.onerror = () => {
					console.error('Failed to load banner ad script, retrying...');
					setTimeout(() => loadAds(isPriority), isPriority ? 500 : 1000); // Faster retry for priority
				};

				// Append scripts to document
				document.head.appendChild(socialBarScript);
				document.head.appendChild(bannerAdScript);
			} catch (error) {
				console.error('Error loading ad scripts:', error);
				// Retry after a delay
				setTimeout(() => loadAds(isPriority), isPriority ? 800 : 1500);
			}
		}
	}
</script>

<div
	class="min-h-screen bg-gradient-to-b from-gray-50 to-gray-100 dark:from-gray-900 dark:to-gray-800"
>
	<div class="container mx-auto px-4 py-8">
		<!-- Hero Section - Improved with full-width design and better contrast -->
		<section
			class="relative mb-20 h-[80vh] overflow-hidden rounded-3xl shadow-2xl"
			in:fade={{ duration: 1200 }}
		>
			<div
				class="absolute inset-0 z-10 bg-gradient-to-r from-black/90 via-black/60 to-transparent"
			></div>

			{#key currentCoverIndex}
				<img
					src={changeCoverImage()}
					alt="Featured Donghua"
					class="h-full w-full object-cover transition-transform duration-1000 hover:scale-105"
					in:fade={{ duration: 800 }}
				/>
			{/key}

			<div
				class="absolute bottom-0 left-0 z-10 w-full p-8 md:bottom-20 md:left-16 md:max-w-2xl"
				in:fly={{ y: 50, duration: 1000, delay: 300 }}
			>
				<div class="space-y-6">
					<h1 class="text-shadow-lg text-5xl leading-tight font-extrabold text-white md:text-7xl">
						Dunia <span class="text-primary">Donghua</span> yang Luar Biasa
					</h1>
					<p class="text-lg text-gray-200 md:text-xl">
						Ayo nikmati tontonan berkualitas dengan resolusi tinggi dari berbagai donghua.
					</p>
					<div class="flex flex-wrap gap-4 pt-4">
						<Button size="lg" class="bg-primary hover:bg-primary/90 group relative overflow-hidden">
							<span
								class="absolute inset-0 bg-white/20 transition-transform duration-300 group-hover:translate-x-full"
							></span>
							Ayo Nonton Sekarang
						</Button>
					</div>
				</div>
			</div>
		</section>

		<div class="relative z-30 -mt-20 mb-20">
			<div class="mx-auto">
				<div class="overflow-hidden rounded-xl bg-white shadow-xl dark:bg-gray-800">
					<div class="p-6 text-center">
						<p class="text-sm">
							<span class="text-primary mr-2 font-bold">Pasang Iklan:</span>
							email
							<a href="mailto:axeanonym@gmail.com" class="text-primary font-bold hover:underline">
								axeanonym@gmail.com
							</a>
						</p>
					</div>
				</div>
			</div>
		</div>

		<!-- Search Section with loading indicator -->
		<div class="relative z-30 -mt-10 mb-20">
			<div class="relative mx-auto max-w-3xl">
				<div
					class="group hover:shadow-primary/20 relative flex items-center overflow-hidden rounded-2xl bg-white shadow-2xl transition-all duration-300 dark:bg-gray-800"
				>
					<!-- Background animation effect -->
					<div
						class="from-primary/5 to-secondary/5 absolute inset-0 bg-gradient-to-r opacity-0 transition-opacity duration-500 group-hover:opacity-100"
					></div>

					<!-- Left decoration element -->
					<div
						class="from-primary to-secondary absolute top-0 left-0 h-full w-2 bg-gradient-to-b opacity-80"
					></div>

					<Input
						type="search"
						placeholder="Cari donghua favoritmu..."
						class="z-40  flex-1 border-0 bg-transparent  px-6 py-6 text-lg transition-all focus-visible:outline-none "
						bind:value={searchQueryState}
						onkeyup={(e: KeyboardEvent) => e.key === 'Enter' && handleSearch()}
					/>

					<div class="flex items-center pr-3">
						<Button
							class="from-primary to-secondary hover:shadow-primary/30 relative mr-2 ml-2 h-12 w-12 overflow-hidden rounded-full bg-gradient-to-br text-white shadow-lg transition-all duration-300"
							onclick={handleSearch}
							disabled={isSearching}
						>
							<div
								class="absolute inset-0 bg-white opacity-0 transition-opacity duration-300 hover:opacity-20"
							></div>
							{#if isSearching}
								<div
									class="h-5 w-5 animate-spin rounded-full border-2 border-current border-t-transparent"
								></div>
							{:else}
								<Search class="h-5 w-5" />
							{/if}
						</Button>
					</div>
				</div>
			</div>
		</div>

		<!-- Native Banner Ad -->
		<div
			class="ad-container mx-auto mb-16 max-w-5xl rounded-xl bg-white p-6 shadow-lg dark:bg-gray-800"
		>
			<div class="mb-4 text-center">
				<span class="text-sm text-gray-500 dark:text-gray-400">Sponsored Content</span>
			</div>

			{#if !adLoaded}
				<div class="flex items-center justify-center py-8">
					<div
						class="border-primary h-8 w-8 animate-spin rounded-full border-4 border-t-transparent"
					></div>
					<span class="ml-3 text-gray-600 dark:text-gray-400">Loading advertisement...</span>
				</div>
			{/if}

			<div id="container-d561750ea858b8acfce6ddcf0eb58de7"></div>
		</div>

		<!-- Latest Releases Section -->
		<section class="mb-20">
			<div class="mb-10 flex items-center justify-between">
				<h2 class="relative text-4xl font-bold">
					Rilis <span class="text-primary">Terbaru</span>
					<span class="bg-primary absolute -bottom-2 left-0 h-1 w-24"></span>
				</h2>
				<!-- <Button variant="ghost" class="text-primary hover:bg-primary/10">View All</Button> -->
			</div>

			{#if isSearching}
				<div class="flex flex-col items-center justify-center py-16 text-center">
					<div
						class="border-primary mb-4 h-12 w-12 animate-spin rounded-full border-4 border-t-transparent"
					></div>
					<h3 class="mb-2 text-2xl font-bold">Searching...</h3>
				</div>
			{:else if paginatedContents.length === 0}
				<div class="flex flex-col items-center justify-center py-16 text-center">
					<div class="mb-4 text-5xl">🔍</div>
					<h3 class="mb-2 text-2xl font-bold">No results found</h3>
					<p class="text-gray-600 dark:text-gray-400">
						Kami tidak menemukan konten yang cocok dengan "{searchQueryState}"
					</p>
					<Button class="mt-6" onclick={resetSearch}>Reset</Button>
				</div>
			{:else}
				<div class="grid grid-cols-2 gap-6 md:grid-cols-3 lg:grid-cols-4">
					{#each paginatedContents as content, i}
						{@const latestEpisode = getLatestEpisode(content.id)}
						{#if latestEpisode}
							<Card
								class="group overflow-hidden border-none shadow-lg transition-all hover:scale-105 hover:shadow-xl active:scale-75"
								on:mouseenter={() => (hoveredCard = i)}
								on:mouseleave={() => (hoveredCard = -1)}
								on:click={() => navigateToDetail(latestEpisode.id, content.id)}
							>
								<div class="flex h-full flex-col">
									<div class="relative h-48 overflow-hidden">
										<img
											src={content.cover_image}
											alt="Latest Release"
											class="h-full w-full object-cover transition-transform duration-300 group-hover:scale-110"
										/>
										<div
											class="absolute inset-0 flex items-center justify-center bg-black/30 opacity-0 transition-opacity group-hover:opacity-100"
										>
											<Play class="h-12 w-12 text-white" />
										</div>
										{#if isLoading && loadingContentId === content.id}
											<div
												class="absolute inset-0 flex items-center justify-center bg-black/60 transition-opacity"
											>
												<div
													class="h-8 w-8 animate-spin rounded-full border-4 border-white border-t-transparent"
												></div>
											</div>
										{/if}
										<div
											class={`absolute top-2 right-2 rounded-md px-2 py-1 text-xs font-bold text-white ${i % 2 === 0 ? 'bg-green-500' : 'bg-amber-500'}`}
										>
											{content.status}
										</div>
										<div
											class={`absolute top-2 left-2 rounded-md bg-gray-600 px-2 py-1 text-xs font-bold text-white `}
										>
											{#if content.country_origin === 'china'}
												Donghua
											{:else if content.country_origin === 'japan'}
												Anime
											{:else}
												Anime
											{/if}
										</div>
										<div
											class="bg-primary absolute bottom-2 left-2 rounded-md border-[1px] border-white px-2 py-1 text-xs font-medium text-black"
										>
											Ep {latestEpisode.episode_number}
										</div>
										<div
											class={`absolute right-2 bottom-2 rounded-md bg-gray-600 px-2 py-1 text-xs font-medium text-white`}
										>
											{latestEpisode.duration} min
										</div>
									</div>
									<div class="flex-1 bg-white p-4 dark:bg-gray-800">
										<div class="mb-2 flex items-center justify-between">
											<h3 class="line-clamp-1 text-lg font-bold">
												{content.title}
											</h3>
										</div>
										<p class="mb-2 text-sm font-semibold text-gray-600 dark:text-gray-400">
											Subtitle Indonesia
										</p>
										<div class="mb-3 flex items-center">
											<span class="text-xs text-gray-500">
												{new Date(latestEpisode.release_date).toLocaleDateString()}
											</span>
										</div>
										<Button
											size="sm"
											class="bg-primary/90 w-full cursor-pointer text-white transition-colors duration-300 hover:bg-black"
											variant={hoveredCard === i ? 'default' : 'outline'}
										>
											Watch
										</Button>
									</div>
								</div>
							</Card>
						{/if}
					{/each}
				</div>
			{/if}

			<!-- Pagination Controls -->
			{#if totalPages > 1 && !isSearching}
				<div class="mt-8 flex justify-center">
					<div class="flex items-center space-x-2">
						<Button
							variant="outline"
							size="sm"
							disabled={currentPage === 1}
							on:click={() => changePage(currentPage - 1)}
							class="px-3"
						>
							&lt;
						</Button>

						{#each Array(totalPages) as _, index}
							{@const pageNumber = index + 1}
							<Button
								variant={currentPage === pageNumber ? 'default' : 'outline'}
								size="sm"
								on:click={() => changePage(pageNumber)}
								class={currentPage === pageNumber ? 'bg-primary text-white' : ''}
							>
								{pageNumber}
							</Button>
						{/each}

						<Button
							variant="outline"
							size="sm"
							disabled={currentPage === totalPages}
							on:click={() => changePage(currentPage + 1)}
							class="px-3"
						>
							&gt;
						</Button>
					</div>
				</div>
			{/if}
		</section>

		<!-- Genre Section - Simplified text-based list -->
		<section class="mb-20">
			<div class="mb-10 flex items-center justify-between" in:fade={{ duration: 800, delay: 900 }}>
				<h2 class="relative text-4xl font-bold">
					Daftar <span class="text-primary">Genre</span>
					<span class="bg-primary absolute -bottom-2 left-0 h-1 w-24"></span>
				</h2>
			</div>

			<div class="grid grid-cols-2 gap-x-12 gap-y-6 md:grid-cols-3 lg:grid-cols-4">
				{#each categories as category, i}
					<div
						class="hover:border-primary dark:hover:border-primary group border-b border-gray-200 pb-2 transition-all duration-300 dark:border-gray-700"
						in:fly={{ y: 20, duration: 800, delay: 1000 + i * 50 }}
						onclick={() => navigateToGenre(category.id)}
					>
						<div class="flex items-center justify-between">
							<a
								href={`/genres/${category.id}`}
								class="hover:text-primary flex items-center text-lg transition-colors duration-300 group-hover:translate-x-1"
							>
								<span class="text-primary mr-2 font-medium">{i + 1}.</span>
								{category.name}
								{#if loadingGenreId === category.id}
									<span
										class="border-primary ml-2 inline-block h-4 w-4 animate-spin rounded-full border-2 border-t-transparent"
									></span>
								{/if}
							</a>
							<span class="text-sm text-gray-500 dark:text-gray-400"
								>{category.contents.length}
							</span>
						</div>
					</div>
				{/each}
			</div>
			<!-- 
			<div class="mt-8 text-center">
				<Button
					variant="outline"
					class="hover:bg-primary border-primary text-primary transition-colors hover:text-white"
				>
					View All Categories
				</Button>
			</div> -->
		</section>

		<!-- ongoing donghua -->
		<Ongoing
			content={contents}
			allEpisodes={episodes}
			containerClass="rounded-lg border mb-10 p-6 shadow-lg backdrop-blur bg-white text-black"
		/>

		<!-- Footer Button -->
		<div class="mb-8 text-center">
			<h3 class="font-sans text-lg font-semibold">Created With Svelte Powered 2025</h3>
		</div>
	</div>
</div>

<style>
	.text-shadow-lg {
		text-shadow: 2px 2px 4px rgba(0, 0, 0, 0.7);
	}

	/* Untuk warna theme */
</style>
