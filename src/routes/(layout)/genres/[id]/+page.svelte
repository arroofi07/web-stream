<script lang="ts">
	import type { PageData } from './$types';
	import { fade, fly } from 'svelte/transition';
	import { Button } from '$lib/components/ui/button';

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

	interface Category {
		id: number;
		name: string;
		description: string;
		created_at: string;
		updated_at: string;
		contents: Content[];
	}

	export let data: PageData;

	// Extract data from the API response
	const genre: Category = data.genre;
	const allContents: Content[] = data.allContents.data;

	// Get content IDs from the genre
	const genreContentIds = genre.contents.map((content) => content.id);

	// Filter contents that match the genre content IDs
	$: filteredContents = allContents.filter((content) => genreContentIds.includes(content.id));

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
</script>

<svelte:head>
	<title>{genre.name} | Donghua App</title>
	<meta name="description" content="Browse content in the {genre.name} category" />
</svelte:head>

<!-- Enhanced Hero banner section with parallax effect -->
<div class="relative mb-16 overflow-hidden bg-gradient-to-br from-gray-900 to-gray-800">
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

	<div class="relative container mx-auto px-4 py-24">
		<div class="max-w-2xl">
			<div
				class="bg-primary/30 text-primary mb-4 inline-block rounded-full px-6 py-2 text-sm font-medium backdrop-blur-sm"
				in:fade={{ duration: 400, delay: 150 }}
			>
				Explore Genre
			</div>
			<h1
				class="mb-6 text-5xl font-extrabold tracking-tight text-white md:text-6xl"
				in:fade={{ duration: 400, delay: 250 }}
			>
				<span
					class="from-primary to-primary-light bg-gradient-to-r bg-clip-text text-primary capitalize"
					>{genre.name}</span
				>
			</h1>
			<div class="flex flex-wrap items-center gap-3" in:fade={{ duration: 400, delay: 450 }}>
				<div
					class="rounded-full bg-gray-800/70 px-5 py-2.5 text-sm font-medium text-white shadow-lg backdrop-blur-sm"
				>
					<span class="text-primary font-bold">{filteredContents.length}</span> Content
				</div>
				<div
					class="rounded-full bg-gray-800/70 px-5 py-2.5 text-sm font-medium text-white shadow-lg backdrop-blur-sm"
				>
					<span class="text-primary font-bold">{genre.name}</span> Genre
				</div>
			</div>
		</div>
	</div>

	<!-- Decorative elements -->
	<div class="bg-primary/10 absolute right-0 -bottom-10 h-40 w-1/3 rounded-full blur-3xl"></div>
	<div class="bg-primary/20 absolute top-20 -right-20 h-40 w-40 rounded-full blur-3xl"></div>
</div>

<section class="container mx-auto px-4 pb-24">
	<!-- Enhanced filtering and view controls -->
	<div
		class="mb-10 flex flex-wrap items-center justify-between gap-4 rounded-2xl bg-gray-100/50 p-4 shadow-sm backdrop-blur-sm dark:bg-gray-800/50"
	>
		<div class="flex items-center">
			<h2 class="text-xl font-bold">
				Showing <span class="text-primary font-extrabold">{filteredContents.length}</span> results
			</h2>
		</div>

		<div class="flex items-center space-x-3">
			<Button
				class={`flex h-12 w-12 items-center justify-center rounded-xl transition-all duration-300 ${viewMode === 'grid' ? 'bg-primary shadow-primary/30 text-white shadow-lg' : 'bg-gray-200 text-gray-700 dark:bg-gray-700 dark:text-gray-300'}`}
				on:click={() => (viewMode = 'grid')}
			>
				<svg
					xmlns="http://www.w3.org/2000/svg"
					width="20"
					height="20"
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
				class={`flex h-12 w-12 items-center justify-center rounded-xl transition-all duration-300 ${viewMode === 'list' ? 'bg-primary shadow-primary/30 text-white shadow-lg' : 'bg-gray-200 text-gray-700 dark:bg-gray-700 dark:text-gray-300'}`}
				on:click={() => (viewMode = 'list')}
			>
				<svg
					xmlns="http://www.w3.org/2000/svg"
					width="20"
					height="20"
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
				class="grid grid-cols-2 gap-8 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5"
				in:fade={{ duration: 300, delay: 150 }}
			>
				{#each filteredContents as content, i (content.id)}
					<div
						class="group hover:shadow-primary/10 relative overflow-hidden rounded-2xl bg-white shadow-xl transition-all duration-500 hover:-translate-y-2 hover:shadow-2xl dark:bg-gray-800"
						in:fly={{ y: 20, duration: 300, delay: 100 + i * 50 }}
					>
						<div class="flex h-full flex-col">
							<div class="relative aspect-[3/4] overflow-hidden rounded-t-2xl">
								<img
									src={content.cover_image}
									alt={content.title}
									class="h-full w-full object-cover transition-transform duration-700 group-hover:scale-110"
								/>
								<!-- Enhanced gradient overlay -->
								<div
									class="absolute inset-0 bg-gradient-to-t from-black/90 via-black/40 to-transparent opacity-80"
								></div>

								<div
									class="absolute inset-0 flex items-center justify-center bg-black/40 opacity-0 transition-opacity duration-500 group-hover:opacity-100"
								>
									<div
										class="bg-primary/80 transform rounded-full p-4 backdrop-blur-sm transition-transform duration-500 group-hover:scale-110 hover:scale-125"
									>
										<svg
											xmlns="http://www.w3.org/2000/svg"
											class="h-10 w-10 text-white"
											viewBox="0 0 24 24"
											fill="none"
											stroke="currentColor"
											stroke-width="2"
											stroke-linecap="round"
											stroke-linejoin="round"
										>
											<polygon points="5 3 19 12 5 21 5 3"></polygon>
										</svg>
									</div>
								</div>

								<!-- Status badge -->
								<div
									class="absolute top-3 right-3 rounded-full bg-gradient-to-r from-green-500 to-green-600 px-3 py-1 text-xs font-bold text-white shadow-lg"
								>
									{content.status}
								</div>

								<!-- Origin badge -->
								<div
									class="absolute top-3 left-3 rounded-full bg-gray-800/80 px-3 py-1 text-xs font-bold text-white shadow-lg backdrop-blur-sm"
								>
									{content.country_origin === 'china' ? 'Donghua' : 'Anime'}
								</div>

								<!-- Episode count -->
								<div
									class="from-primary to-primary-dark absolute bottom-3 left-3 rounded-full bg-gradient-to-r px-3 py-1 text-xs font-medium text-white shadow-lg"
								>
									{content.total_episodes} Episode{content.total_episodes > 1 ? 's' : ''}
								</div>
							</div>

							<div class="flex-1 p-5">
								<h3
									class="group-hover:text-primary mb-2 line-clamp-1 text-lg font-bold transition-colors duration-300"
								>
									{content.title}
								</h3>
								<p class="mb-3 text-sm font-medium text-gray-600 dark:text-gray-400">
									Subtitle Indonesia
								</p>
								<div class="mb-5 flex items-center">
									<svg
										xmlns="http://www.w3.org/2000/svg"
										class="mr-1 h-4 w-4 text-gray-500"
										fill="none"
										viewBox="0 0 24 24"
										stroke="currentColor"
									>
										<path
											stroke-linecap="round"
											stroke-linejoin="round"
											stroke-width="2"
											d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"
										/>
									</svg>
									<span class="text-xs text-gray-500">
										{formatDate(content.release_date)}
									</span>
								</div>
								<a
									href={`/detail/${content.id}`}
									class="from-primary to-primary-dark hover:from-primary-dark hover:to-primary hover:shadow-primary/30 block w-full rounded-xl bg-gradient-to-r px-4 py-3 text-center text-white transition-all duration-300 hover:shadow-lg"
								>
									Watch Now
								</a>
							</div>
						</div>
					</div>
				{/each}
			</div>
		{:else}
			<div class="space-y-6" in:fade={{ duration: 300, delay: 150 }}>
				{#each filteredContents as content, i (content.id)}
					<div
						class="group hover:shadow-primary/20 flex overflow-hidden rounded-2xl bg-white shadow-lg transition-all duration-300 hover:-translate-x-1 hover:translate-y-0 hover:shadow-xl dark:bg-gray-800"
						in:fly={{ y: 20, duration: 300, delay: 100 + i * 50 }}
					>
						<div class="relative h-40 w-32 overflow-hidden rounded-l-2xl sm:h-56 sm:w-40">
							<img
								src={content.cover_image}
								alt={content.title}
								class="h-full w-full object-cover transition-transform duration-700 group-hover:scale-110"
							/>
							<div
								class="absolute top-3 right-3 rounded-full bg-gradient-to-r from-green-500 to-green-600 px-2 py-1 text-xs font-bold text-white shadow-md"
							>
								{content.status}
							</div>
						</div>

						<div class="flex flex-1 flex-col p-6">
							<div class="mb-3 flex items-center gap-3">
								<div
									class="rounded-full bg-gray-200 px-3 py-1.5 text-xs font-medium text-gray-800 dark:bg-gray-700 dark:text-gray-200"
								>
									{content.country_origin === 'china' ? 'Donghua' : 'Anime'}
								</div>
								<div
									class="bg-primary/10 text-primary rounded-full px-3 py-1.5 text-xs font-medium"
								>
									{content.total_episodes} Episodes
								</div>
							</div>

							<h3
								class="group-hover:text-primary mb-3 text-xl font-bold transition-colors duration-300 sm:text-2xl"
							>
								{content.title}
							</h3>

							<p class="mb-3 text-sm text-gray-600 dark:text-gray-400">Subtitle Indonesia</p>

							<div class="mb-5 flex items-center">
								<svg
									xmlns="http://www.w3.org/2000/svg"
									class="mr-1 h-4 w-4 text-gray-500"
									fill="none"
									viewBox="0 0 24 24"
									stroke="currentColor"
								>
									<path
										stroke-linecap="round"
										stroke-linejoin="round"
										stroke-width="2"
										d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"
									/>
								</svg>
								<span class="text-xs text-gray-500">
									{formatDate(content.release_date)}
								</span>
							</div>

							<div class="mt-auto">
								<a
									href={`/detail/${content.id}`}
									class="from-primary to-primary-dark hover:from-primary-dark hover:to-primary hover:shadow-primary/30 inline-block rounded-xl bg-gradient-to-r px-8 py-3 text-center text-white transition-all duration-300 hover:shadow-lg"
								>
									Watch Now
								</a>
							</div>
						</div>
					</div>
				{/each}
			</div>
		{/if}
	{:else}
		<div
			class="flex flex-col items-center justify-center rounded-2xl bg-white py-20 text-center shadow-xl dark:bg-gray-800"
			in:fade={{ duration: 300, delay: 150 }}
		>
			<div class="mb-8 rounded-full bg-gray-100 p-6 dark:bg-gray-700">
				<svg
					xmlns="http://www.w3.org/2000/svg"
					class="h-20 w-20 text-gray-500"
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
			<h2 class="mb-3 text-3xl font-bold">No content found</h2>
			<p class="mb-8 max-w-md text-gray-600 dark:text-gray-400">
				We couldn't find any content in the {genre.name} category. Please try another category.
			</p>
			<a
				href="/genres"
				class="from-primary to-primary-dark hover:from-primary-dark hover:to-primary hover:shadow-primary/30 rounded-xl bg-gradient-to-r px-8 py-4 font-medium text-white transition-all duration-300 hover:shadow-lg"
			>
				Browse Categories
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
</style>
