<script lang="ts">
	import { onMount } from 'svelte';
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
	import { Search, Play, Star } from '@lucide/svelte';
	import overGoddess from '$lib/assets/cover/tales-of-herding-gods.jpg';

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

	// Use $props() for Svelte 5 runes mode
	let data: typeData = $props();
	let episodes = data.data.episodes;
	let contents = data.data.contents;
	let categories = data.data.categories;

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

	onMount(() => {
		isPageLoaded = true;
		console.log('Page mounted');
		updatePaginatedContents();
	});

	// Function to update paginated contents
	function updatePaginatedContents() {
		// Filter contents that have episodes
		const contentsWithEpisodes = contents.filter((content) =>
			episodes.some((ep) => ep.content_id === content.id)
		);

		// Sort by latest episode ID (highest first)
		const sortedContents = [...contentsWithEpisodes].sort((a, b) => {
			const latestEpisodeA = episodes
				.filter((ep) => ep.content_id === a.id)
				.sort((x, y) => y.id - x.id)[0];

			const latestEpisodeB = episodes
				.filter((ep) => ep.content_id === b.id)
				.sort((x, y) => y.id - x.id)[0];

			return latestEpisodeB?.id - latestEpisodeA?.id;
		});

		// Calculate total pages
		totalPages = Math.ceil(sortedContents.length / itemsPerPage);

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

		// Short timeout to show loading effect (300ms)
		await new Promise((resolve) => setTimeout(resolve, 300));

		goto(`/detail/${id}`);
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
			<img
				src={overGoddess}
				alt="Featured Donghua"
				class="h-full w-full object-cover transition-transform duration-1000 hover:scale-105"
			/>
			<div
				class="absolute bottom-0 left-0 z-10 w-full p-8 md:bottom-20 md:left-16 md:max-w-2xl"
				in:fly={{ y: 50, duration: 1000, delay: 300 }}
			>
				<div class="space-y-6">
					<h1 class="text-shadow-lg text-5xl leading-tight font-extrabold text-white md:text-7xl">
						Dunia <span class="text-primary">Donghua</span> yang Luar Biasa
					</h1>
					<p class="text-lg text-gray-200 md:text-xl">
						Rasakan keajaiban animasi dengan kualitas HD yang memukau.
					</p>
					<div class="flex flex-wrap gap-4 pt-4">
						<Button size="lg" class="bg-primary hover:bg-primary/90 group relative overflow-hidden">
							<span
								class="absolute inset-0 bg-white/20 transition-transform duration-300 group-hover:translate-x-full"
							></span>
							<Play class="mr-2 h-5 w-5" /> Mulai Menonton
						</Button>
					</div>
				</div>
			</div>
		</section>

		<!-- Search Section - Redesigned with better positioning and style -->
		<div class="relative z-30 -mt-10 mb-20">
			<div class="relative mx-auto max-w-3xl" in:fade={{ duration: 800, delay: 500 }}>
				<div
					class="border-primary flex items-center overflow-hidden rounded-full border-2 bg-white shadow-xl dark:bg-gray-800"
				>
					<Input
						type="search"
						placeholder="Search for your favorite donghua.. "
						class="border-0 px-6 py-6 text-lg focus:ring-0"
					/>
					<Button class="mr-2 flex h-12 w-12 items-center justify-center rounded-full">
						<Search class="h-5 w-5" />
					</Button>
				</div>
			</div>
		</div>

		<!-- Latest Releases Section - New section -->
		<section class="mb-20">
			<div class="mb-10 flex items-center justify-between">
				<h2 class="relative text-4xl font-bold">
					Rilis <span class="text-primary">Terbaru</span>
					<span class="bg-primary absolute -bottom-2 left-0 h-1 w-24"></span>
				</h2>
				<Button variant="ghost" class="text-primary hover:bg-primary/10">View All</Button>
			</div>

			<div class="grid grid-cols-2 gap-6 md:grid-cols-3 lg:grid-cols-4">
				{#each paginatedContents as content, i}
					{#if episodes.filter((ep) => ep.content_id === content.id).length > 0}
						{@const latestEpisode = episodes
							.filter((ep) => ep.content_id === content.id)
							.sort((a, b) => b.id - a.id)[0]}
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
										Episode {latestEpisode.episode_number}
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

			<!-- Pagination Controls -->
			{#if totalPages > 1}
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
						class="hover:border-primary dark:hover:border-primary group border-b border-gray-200 pb-2 transition-all duration-300 dark:border-gray-700"
						in:fly={{ y: 20, duration: 800, delay: 1000 + i * 50 }}
					>
						<div class="flex items-center justify-between">
							<a
								href={`/genre/${category.name.toLowerCase()}`}
								class="hover:text-primary flex items-center text-lg transition-colors duration-300 group-hover:translate-x-1"
							>
								<span class="text-primary mr-2 font-medium">{i + 1}.</span>
								{category.name}
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

		<!-- CTA Section - New section -->
		<section class="mb-12">
			<div class="bg-primary relative overflow-hidden rounded-2xl p-8 md:p-12">
				<div
					class="absolute top-0 right-0 h-64 w-64 translate-x-1/4 -translate-y-1/4 rounded-full bg-white/10"
				></div>
				<div
					class="absolute bottom-0 left-0 h-40 w-40 -translate-x-1/4 translate-y-1/4 rounded-full bg-white/10"
				></div>

				<div class="relative z-10 max-w-2xl">
					<h2 class="mb-4 text-3xl font-bold text-white md:text-4xl">Join Our Donghua Community</h2>
					<p class="mb-6 text-lg text-white/90">
						Get notified about new releases, special events, and exclusive content.
					</p>

					<div class="flex flex-col space-y-4 sm:flex-row sm:space-y-0 sm:space-x-4">
						<Input
							type="email"
							placeholder="Enter your email"
							class="h-12 border-white/30 bg-white/20 text-white placeholder:text-white/70 focus:border-white"
						/>
						<Button class="text-primary h-12 bg-white hover:bg-white/90">Subscribe Now</Button>
					</div>
				</div>
			</div>
		</section>

		<!-- Footer Button -->
		<div class="mb-8 text-center">
			<h3 class="font-sans text-lg font-semibold">
				Created by Naa Enterprise 🙆‍♂️🙋‍♂️ & Svelte Powered 2025
			</h3>
		</div>
	</div>
</div>

<style>
	.text-shadow-lg {
		text-shadow: 2px 2px 4px rgba(0, 0, 0, 0.7);
	}

	/* Untuk warna theme */
</style>
