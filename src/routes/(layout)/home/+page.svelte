<script lang="ts">
	import { onMount, onDestroy } from 'svelte';
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

	// Add these variables for enhanced caching and performance
	let cachedContents = $state(new Map());
	let lastRefreshTimestamp = $state(0);
	const CACHE_LIFETIME = 5 * 60 * 1000; // 5 minutes in milliseconds
	let isQuickLoading = $state(false);

	// Add these variables for ad management
	let adLoaded = $state(false);
	let adAttempts = $state(0);
	const MAX_AD_ATTEMPTS = 3;
	let adContainerId = 'container-d561750ea858b8acfce6ddcf0eb58de7';

	// Add these variables for navigation tracking
	let isReturningToPage = $state(false);
	let pageVisits = $state(0);

	// Add these variables for content filtering by country
	let activeCountryFilter = $state<string | null>(null);
	let countryFilteredContents = $state<typeof contents>([]);

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
	let itemsPerPage = $state(12);
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

	onMount(() => {
		isPageLoaded = true;
		pageVisits++;

		// Check browser cache first for faster loading
		if (browser) {
			const cachedData = sessionStorage.getItem('homePageCache');
			const cachedTimestamp = parseInt(sessionStorage.getItem('homePageCacheTimestamp') || '0');

			// If we have recent cached data, use it immediately
			if (cachedData && Date.now() - cachedTimestamp < CACHE_LIFETIME) {
				try {
					const parsedCache = JSON.parse(cachedData);

					// Apply cached data for instant display
					if (parsedCache.filteredContents) {
						filteredContents = parsedCache.filteredContents;
						paginatedContents = parsedCache.paginatedContents || [];
						totalPages = parsedCache.totalPages || 1;
						isQuickLoading = true;

						// Show content immediately
						updatePaginatedContents();

						console.log('Using cached data for instant display');
					}
				} catch (e) {
					console.error('Error parsing cached data:', e);
				}
			}
		}

		// Always build episode map and initialize data
		buildEpisodeMap();

		// Initialize filtered contents - use all contents if no search query
		if (!searchQueryState) {
			filteredContents = [...(contents || [])];
			updatePaginatedContents();
		} else {
			handleSearch();
		}

		// Cache the current state for future quick loads
		if (browser) {
			try {
				const cacheData = {
					filteredContents,
					paginatedContents,
					totalPages
				};
				sessionStorage.setItem('homePageCache', JSON.stringify(cacheData));
				sessionStorage.setItem('homePageCacheTimestamp', Date.now().toString());
				console.log('Updated page cache');
			} catch (e) {
				console.error('Error caching page data:', e);
			}
		}

		// Start rotating cover images
		if (contents && contents.length > 0) {
			coverImageInterval = setInterval(() => {
				const availableImages = Math.min(maxImagesToShow, contents.length);
				currentCoverIndex = (currentCoverIndex + 1) % availableImages;
			}, 4000);
		}

		// Reset ad state when mounting
		adLoaded = false;
		adAttempts = 0;

		// Add navigation event listener to detect when user is coming back to this page
		if (browser) {
			window.addEventListener('pageshow', handlePageShow);
		}

		// Load ads with high priority
		loadAds(true);
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
	function handlePageShow(event: any) {
		// Check if the page is being loaded from cache (back/forward navigation)
		if (event.persisted) {
			console.log('Page loaded from cache (back/forward navigation)');

			// Force a full page refresh when returning to home with a small delay
			if (browser) {
				setTimeout(() => {
					window.location.reload();
				}, 50); // Small delay to ensure everything is ready
			}
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

		// Apply country filter if active
		if (activeCountryFilter) {
			filteredContents = filteredContents.filter(
				(content: { country_origin: string }) =>
					content.country_origin.toLowerCase() === activeCountryFilter
			);
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

	// Function to preload ad scripts without executing them
	function preloadAdScripts() {
		if (browser) {
			// Preload social bar script
			const socialBarPreload = document.createElement('link');
			socialBarPreload.rel = 'preload';
			socialBarPreload.as = 'script';
			socialBarPreload.href =
				'//arrivingserpentoutbalance.com/2d/8c/88/2d8c88477fa6d1c610e37670b907ee53.js';
			document.head.appendChild(socialBarPreload);

			// Preload banner ad script
			const bannerAdPreload = document.createElement('link');
			bannerAdPreload.rel = 'preload';
			bannerAdPreload.as = 'script';
			bannerAdPreload.href =
				'//arrivingserpentoutbalance.com/d561750ea858b8acfce6ddcf0eb58de7/invoke.js';
			document.head.appendChild(bannerAdPreload);

			console.log('Preloaded ad scripts');
		}
	}

	// Function to load ads with improved performance
	function loadAds(highPriority = false) {
		if (!adLoaded && adAttempts < MAX_AD_ATTEMPTS) {
			adAttempts++;
			console.log(
				`Loading ads (attempt ${adAttempts}/${MAX_AD_ATTEMPTS}), priority: ${highPriority}`
			);

			try {
				// Create a new ad container if it doesn't exist
				if (!document.getElementById(adContainerId)) {
					const container = document.createElement('div');
					container.id = adContainerId;
					const adContainer = document.querySelector('.ad-container');
					if (adContainer) {
						// Clear any existing content
						adContainer.querySelectorAll(`#${adContainerId}`).forEach((el) => el.remove());
						adContainer.appendChild(container);
					}
				}

				// Social bar script - always load this regardless of adLoaded state
				const socialBarScript = document.createElement('script');
				socialBarScript.type = 'text/javascript';
				socialBarScript.src =
					'//arrivingserpentoutbalance.com/2d/8c/88/2d8c88477fa6d1c610e37670b907ee53.js';
				socialBarScript.async = false; // Make it synchronous to ensure it loads

				// Banner ad script
				const bannerAdScript = document.createElement('script');
				bannerAdScript.setAttribute('data-cfasync', 'false');
				bannerAdScript.src =
					'//arrivingserpentoutbalance.com/d561750ea858b8acfce6ddcf0eb58de7/invoke.js';
				bannerAdScript.async = false; // Make it synchronous to ensure it loads

				// Success handlers
				socialBarScript.onload = () => {
					console.log('Social bar script loaded');
				};

				bannerAdScript.onload = () => {
					console.log('Banner ad script loaded');
					adLoaded = true;
				};

				// Error handlers with faster retries for high priority
				socialBarScript.onerror = () => {
					console.error('Failed to load social bar script');
					setTimeout(() => {
						document.head.appendChild(socialBarScript.cloneNode(true));
					}, 300);
				};

				bannerAdScript.onerror = () => {
					console.error('Failed to load banner ad script');
					setTimeout(() => loadAds(true), 300);
				};

				// Remove any existing scripts to avoid conflicts
				document.querySelectorAll('script[src*="effectiveratecpm.com"]').forEach((script) => {
					script.remove();
				});

				// Append scripts
				document.head.appendChild(socialBarScript);
				document.head.appendChild(bannerAdScript);
			} catch (error) {
				console.error('Error loading ad scripts:', error);
				setTimeout(() => loadAds(true), 500);
			}
		}
	}

	// Add this function to handle cover image rotation
	function changeCoverImage() {
		if (!contents || contents.length === 0) {
			return overGoddess; // Fallback to default image
		}

		// Use the current index to get the image
		const content = contents[currentCoverIndex];
		return content?.cover_image || overGoddess;
	}

	// Function to filter content by country origin
	function filterByCountry(country: string) {
		// If clicking the already active filter, reset it
		if (activeCountryFilter === country.toLowerCase()) {
			activeCountryFilter = null;
			resetCountryFilter();
			return;
		}

		activeCountryFilter = country.toLowerCase();
		isLoading = true;

		// Reset to first page
		currentPage = 1;

		// Filter contents based on country - fix the country values to match your data
		if (country.toLowerCase() === 'jepang') {
			countryFilteredContents = (contents || []).filter(
				(content: { country_origin: string }) => content.country_origin.toLowerCase() === 'jepang' // Changed to match your data
			);
		} else if (country.toLowerCase() === 'china') {
			countryFilteredContents = (contents || []).filter(
				(content: { country_origin: string }) => content.country_origin.toLowerCase() === 'china'
			);
		}

		// Update filtered contents with country filter
		filteredContents = countryFilteredContents;

		// Update paginated contents
		updatePaginatedContents();

		// Finish loading
		setTimeout(() => {
			isLoading = false;
		}, 300);
	}

	// Function to reset country filter
	function resetCountryFilter() {
		activeCountryFilter = null;

		// If there's a search query, apply that filter
		if (searchQueryState) {
			performSearch();
		} else {
			// Otherwise show all contents
			filteredContents = [...(contents || [])];
			updatePaginatedContents();
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
						Dunia <span class="text-primary">Animasi</span> yang Luar Biasa
					</h1>
					<p class="text-lg text-gray-200 md:text-xl">
						Ayo nikmati tontonan berkualitas dengan resolusi tinggi dari berbagai Animasi.
					</p>
					<div class="flex flex-wrap gap-4 pt-4">
						<Button size="lg" class="bg-primary hover:bg-primary/90 group relative overflow-hidden">
							<a
								href=""
								target="_blank"
								rel="noopener noreferrer"
							>
								Ayo Nonton Sekarang
							</a>
						</Button>
					</div>
				</div>
			</div>
		</section>

		<div class="relative z-30 -mt-20 mb-7">
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

		<!-- Native Banner Ad -->
		<div class="ad-container mx-auto mb-16 rounded-xl bg-white p-6 shadow-lg dark:bg-gray-800">
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
						placeholder="Cari animasi favoritmu..."
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

		<!-- Category Selection Section -->
		<section class="mb-16">
			<h1 class="mb-8 text-center text-3xl font-bold">Pilih Animasi yang ingin kamu tonton</h1>
			<div class="mx-auto grid max-w-3xl grid-cols-2 gap-4">
				<Button
					class={`group relative cursor-pointer overflow-hidden rounded-xl ${
						activeCountryFilter === 'jepang'
							? 'from-primary shadow-primary/10 bg-gradient-to-r to-black'
							: 'from-primary/80 to-primary/80 hover:from-primary/90 hover:to-primary hover:shadow-primary/20 bg-gradient-to-r'
					} p-6 shadow-lg transition-all duration-300`}
					onclick={() => filterByCountry('jepang')}
				>
					<div
						class="absolute inset-0 bg-white opacity-0 transition-opacity duration-300 group-hover:opacity-10"
					></div>
					<div class="flex flex-col items-center justify-center space-y-2">
						<span class="font-sans text-xl font-semibold text-white">
							Anime
							<span class="hidden text-xs text-white/80 md:block lg:block">(Jepang)</span>
						</span>
					</div>
				</Button>
				<Button
					class={`group relative cursor-pointer overflow-hidden rounded-xl ${
						activeCountryFilter === 'china'
							? 'from-primary shadow-primary/10 bg-gradient-to-r to-black'
							: 'from-primary/80 to-primary/80 hover:from-primary hover:to-primary/90 hover:shadow-primary/20 bg-gradient-to-r'
					} p-6 shadow-lg transition-all duration-300`}
					onclick={() => filterByCountry('china')}
				>
					<div
						class="absolute inset-0 bg-white opacity-0 transition-opacity duration-300 group-hover:opacity-10"
					></div>
					<div class="flex flex-col items-center justify-center space-y-2">
						<span class="font-sans text-xl font-semibold text-white">
							Donghua
							<span class="hidden text-xs text-white/80 md:block lg:block">(China)</span>
						</span>
					</div>
				</Button>
			</div>

			{#if activeCountryFilter}
				<div class="mt-4 flex justify-center">
					<Button
						variant="outline"
						size="sm"
						onclick={resetCountryFilter}
						class="bg-primary flex items-center gap-2 text-white"
					>
						<X class="h-4 w-4" />
						Reset Filter
					</Button>
				</div>
			{/if}
		</section>

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
								onmouseenter={() => (hoveredCard = i)}
								onmouseleave={() => (hoveredCard = -1)}
								onclick={() => navigateToDetail(latestEpisode.id, content.id)}
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
										<div class="mb-2">
											<h3
												class="line-clamp-2 min-h-[2.5rem] text-sm leading-tight font-bold sm:min-h-[3rem] sm:text-base md:text-lg"
												title={content.title}
											>
												{content.title}
											</h3>
										</div>
										<p
											class="mb-2 text-xs font-semibold text-gray-600 sm:text-sm dark:text-gray-400"
										>
											Subtitle Indonesia
										</p>
										<div class="mb-3 flex items-center">
											<span class="text-xs text-gray-500">
												{new Date(latestEpisode.release_date).toLocaleDateString()}
											</span>
										</div>
										<Button
											size="sm"
											class="bg-primary/90 w-full cursor-pointer text-xs text-white transition-colors duration-300 hover:bg-black sm:text-sm"
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
							onclick={() => changePage(currentPage - 1)}
							class="px-3"
						>
							&lt;
						</Button>

						{#each Array(totalPages) as _, index}
							{@const pageNumber = index + 1}
							<Button
								variant={currentPage === pageNumber ? 'default' : 'outline'}
								size="sm"
								onclick={() => changePage(pageNumber)}
								class={currentPage === pageNumber ? 'bg-primary text-white' : ''}
							>
								{pageNumber}
							</Button>
						{/each}

						<Button
							variant="outline"
							size="sm"
							disabled={currentPage === totalPages}
							onclick={() => changePage(currentPage + 1)}
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
						class="hover:border-primary dark:hover:border-primary group cursor-pointer border-b border-gray-200 pb-2 transition-all duration-300 dark:border-gray-700"
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

		<!-- Native Banner Ad -->
		<div class="ad-container mx-auto mb-16 rounded-xl bg-white p-6 shadow-lg dark:bg-gray-800">
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
