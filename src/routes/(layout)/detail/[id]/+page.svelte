<script lang="ts">
	import { onMount } from 'svelte';
	import { page } from '$app/stores';
	import { afterNavigate, goto } from '$app/navigation';
	import Ongoing from '$lib/components/ongoing.svelte';

	interface EpisodeData {
		id: number;
		content_id: number;
		title: string;
		episode_number: number;
		description: string;
		duration: number;
		release_date: string;
		content: {
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
		};
		streaming_links: Array<{
			id: number;
			episode_id: number;
			server_name: string;
			quality: string;
			url: string;
			is_active: boolean;
			created_at: string;
			updated_at: string;
		}>;
		created_at: string;
		updated_at: string;
	}

	interface AllEpisodeData {
		id: number;
		content_id: number;
		title: string;
		episode_number: number;
		description: string;
		duration: number;
		release_date: string;
		content: {
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
		};
		streaming_links: Array<{
			id: number;
			episode_id: number;
			server_name: string;
			quality: string;
			url: string;
			is_active: boolean;
			created_at: string;
			updated_at: string;
		}>;
		created_at: string;
		updated_at: string;
	}

	interface ContentData {
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
	}

	interface CategoryData {
		id: number;
		name: string;
		contents: ContentData[];
		created_at: string;
		updated_at: string;
	}

	interface typeData {
		episodes: EpisodeData;
		allEpisodes: AllEpisodeData[];
		content: ContentData[];
		categories: CategoryData[];
	}

	export let data: typeData;
	let episode: EpisodeData = data.episodes;
	let allEpisodes: AllEpisodeData[] = data.allEpisodes;
	let content: ContentData[] = data.content;
	let categories: CategoryData[] = data.categories;
	let selectedServer = 0;
	let isDescriptionExpanded = false;
	let isLoading = false;

	// This function will run after every navigation
	afterNavigate(() => {
		// Update the data when the page changes
		episode = data.episodes;
		allEpisodes = data.allEpisodes;
		selectedServer = 0; // Reset selected server when changing episodes
		isDescriptionExpanded = false; // Reset description state
		isLoading = false; // End loading state after navigation completes
	});

	// Subscribe to changes in the data prop
	$: {
		episode = data.episodes;
		allEpisodes = data.allEpisodes;
	}

	// Function to handle episode navigation with loading state
	function navigateToEpisode(episodeId: number | undefined) {
		if (!episodeId) return;
		isLoading = true;
		goto(`/detail/${episodeId}`);
	}

	function formatDate(dateString: string) {
		const date = new Date(dateString);
		return date.toLocaleDateString('id-ID', {
			year: 'numeric',
			month: 'long',
			day: 'numeric'
		});
	}
</script>

<div class="min-h-screen bg-gradient-to-b from-gray-900 to-black text-gray-100">
	<div class="container mx-auto max-w-6xl px-4 py-8">
		<!-- Social Bar Ad -->
		<div class="mb-6">
			{@html `<script type='text/javascript' src='//pl26302165.effectiveratecpm.com/2d/8c/88/2d8c88477fa6d1c610e37670b907ee53.js'><\/script>`}
		</div>

		{#if isLoading}
			<div class="rounded-lg border border-gray-700 bg-gray-800 p-6 shadow-lg">
				<div class="flex h-64 items-center justify-center">
					<div class="text-center">
						<div class="mb-4">
							<svg
								class="text-primary mx-auto h-10 w-10 animate-spin"
								xmlns="http://www.w3.org/2000/svg"
								fill="none"
								viewBox="0 0 24 24"
							>
								<circle
									class="opacity-25"
									cx="12"
									cy="12"
									r="10"
									stroke="currentColor"
									stroke-width="4"
								></circle>
								<path
									class="opacity-75"
									fill="currentColor"
									d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
								></path>
							</svg>
						</div>
						<p class="text-lg font-medium text-white">Memuat episode...</p>
						<p class="mt-2 text-sm text-gray-400">Mohon tunggu sebentar</p>
					</div>
				</div>
			</div>
		{:else if episode}
			<div class="mb-6 flex flex-col items-center gap-4 md:flex-row">
				<!-- Content Thumbnail -->
				<div class="w-full flex-shrink-0 md:w-1/4">
					<img
						src={episode.content.thumbnail}
						alt={episode.content.title}
						class="border-primary h-48 w-full rounded-lg border-2 object-cover shadow-lg md:h-64"
					/>
				</div>

				<!-- Content Info -->
				<div class="w-full md:w-3/4">
					<h1 class="text-primary mb-2 text-3xl font-bold capitalize">
						{episode.content.title}
					</h1>
					<h2 class="mb-4 text-2xl font-semibold text-white">
						Episode {episode.episode_number} - {episode.title}
					</h2>

					<div class="mb-4 flex flex-wrap gap-3">
						<span
							class="bg-primary flex items-center rounded-full px-3 py-1 text-sm font-medium text-white"
						>
							<svg
								xmlns="http://www.w3.org/2000/svg"
								class="mr-1 h-4 w-4"
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
							{formatDate(episode.content.release_date)}
						</span>
						<span
							class="bg-primary flex items-center rounded-full px-3 py-1 text-sm font-medium text-white"
						>
							<svg
								xmlns="http://www.w3.org/2000/svg"
								class="mr-1 h-4 w-4"
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
							{episode.duration} menit
						</span>
						<span
							class="bg-primary flex items-center rounded-full px-3 py-1 text-sm font-medium text-white"
						>
							<svg
								xmlns="http://www.w3.org/2000/svg"
								class="mr-1 h-4 w-4"
								fill="none"
								viewBox="0 0 24 24"
								stroke="currentColor"
							>
								<path
									stroke-linecap="round"
									stroke-linejoin="round"
									stroke-width="2"
									d="M3 21v-4m0 0V5a2 2 0 012-2h6.5l1 1H21l-3 6 3 6h-8.5l-1-1H5a2 2 0 00-2 2zm9-13.5V9"
								/>
							</svg>
							{episode.content.country_origin}
						</span>
						<span
							class="bg-primary flex items-center rounded-full px-3 py-1 text-sm font-medium text-white"
						>
							<svg
								xmlns="http://www.w3.org/2000/svg"
								class="mr-1 h-4 w-4"
								fill="none"
								viewBox="0 0 24 24"
								stroke="currentColor"
							>
								<path
									stroke-linecap="round"
									stroke-linejoin="round"
									stroke-width="2"
									d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2"
								/>
							</svg>
							{episode.content.status}
						</span>
					</div>

					<!-- genres -->
					<h1 class="text-primary mb-2 text-3xl font-bold">Genres</h1>
					<div class="mb-4 flex flex-wrap gap-3">
						{#each categories as category}
							{#if category.contents.some((c) => c.id === episode.content.id)}
								<span
									class="bg-primary flex items-center rounded-full px-3 py-1 text-sm font-medium text-white"
								>
									<svg
										xmlns="http://www.w3.org/2000/svg"
										class="mr-1 h-4 w-4"
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
									{category.name}
								</span>
							{/if}
						{/each}
					</div>
				</div>
			</div>

			<!-- Video Player Container -->
			{#if episode.streaming_links && episode.streaming_links.length > 0}
				<div
					class="relative mb-6 aspect-video w-full overflow-hidden rounded-xl border border-gray-700 bg-black shadow-2xl"
				>
					<iframe
						src={episode.streaming_links[selectedServer].url}
						class="absolute top-0 left-0 h-full w-full"
						allowfullscreen
						frameborder="0"
						title="Video Player"
					></iframe>
				</div>

				<!-- Server Selection -->
				{#if episode.streaming_links.length > 1}
					<div class="mb-6">
						<h3 class="text-primary mb-2 text-lg font-semibold">Pilih Server:</h3>
						<div class="flex flex-wrap gap-2">
							{#each episode.streaming_links as link, index}
								<button
									class="rounded-lg px-4 py-2 {selectedServer === index
										? 'bg-primary text-white'
										: 'bg-gray-800 text-gray-300 hover:bg-gray-700'} flex items-center transition-all duration-200"
									onclick={() => (selectedServer = index)}
								>
									<span class="mr-2">{link.server_name}</span>
									<span class="rounded bg-gray-900 px-2 py-0.5 text-xs">{link.quality}</span>
								</button>
							{/each}
						</div>
					</div>
				{/if}

				<!-- Navigation -->
				<div class="mb-6 flex justify-between">
					{#if episode && episode.episode_number > 1 && allEpisodes}
						<button
							onclick={() =>
								navigateToEpisode(
									allEpisodes.find(
										(ep) =>
											ep.content_id === episode.content_id &&
											ep.episode_number === episode.episode_number - 1
									)?.id
								)}
							class="flex items-center rounded-lg bg-gray-800 px-4 py-2 text-gray-300 transition-all duration-200 hover:bg-gray-700"
						>
							<svg
								xmlns="http://www.w3.org/2000/svg"
								class="mr-2 h-5 w-5"
								fill="none"
								viewBox="0 0 24 24"
								stroke="currentColor"
							>
								<path
									stroke-linecap="round"
									stroke-linejoin="round"
									stroke-width="2"
									d="M15 19l-7-7 7-7"
								/>
							</svg>
							Episode Sebelumnya
						</button>
					{:else}
						<div></div>
					{/if}

					{#if allEpisodes && episode}
						{#if allEpisodes.some((ep) => ep.content_id === episode.content_id && ep.episode_number === episode.episode_number + 1)}
							<button
								onclick={() =>
									navigateToEpisode(
										allEpisodes.find(
											(ep) =>
												ep.content_id === episode.content_id &&
												ep.episode_number === episode.episode_number + 1
										)?.id
									)}
								class="bg-primary hover:bg-primary/80 flex items-center rounded-lg px-4 py-2 text-white transition-all duration-200"
							>
								Episode Selanjutnya
								<svg
									xmlns="http://www.w3.org/2000/svg"
									class="ml-2 h-5 w-5"
									fill="none"
									viewBox="0 0 24 24"
									stroke="currentColor"
								>
									<path
										stroke-linecap="round"
										stroke-linejoin="round"
										stroke-width="2"
										d="M9 5l7 7-7 7"
									/>
								</svg>
							</button>
						{:else}
							<div></div>
						{/if}
					{:else}
						<div></div>
					{/if}
				</div>

				<!-- Episode List -->
				<div
					class="mb-6 rounded-lg border border-gray-700 bg-gray-800/50 p-6 shadow-lg backdrop-blur"
				>
					<h2 class="mb-4 flex items-center text-xl font-bold text-white">
						<svg
							xmlns="http://www.w3.org/2000/svg"
							class="text-primary mr-2 h-5 w-5"
							fill="none"
							viewBox="0 0 24 24"
							stroke="currentColor"
						>
							<path
								stroke-linecap="round"
								stroke-linejoin="round"
								stroke-width="2"
								d="M4 6h16M4 10h16M4 14h16M4 18h16"
							/>
						</svg>
						Daftar Episode
					</h2>

					<div
						class="grid grid-cols-2 gap-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6"
					>
						{#if allEpisodes && allEpisodes.length > 0}
							{#each allEpisodes.filter((ep) => ep.content_id === episode.content_id) as ep, i}
								<button
									onclick={() => navigateToEpisode(ep.id)}
									class={`rounded px-3 py-2 ${episode && episode.episode_number === ep.episode_number ? 'bg-primary text-white' : 'bg-gray-700 text-gray-200 hover:bg-gray-600'} text-center transition-all duration-200`}
								>
									{ep.episode_number}
								</button>
							{/each}
						{:else}
							<p class="text-gray-400">Tidak ada episode tersedia untuk episode ini.</p>
						{/if}
					</div>
				</div>

				<!-- Description -->
				<div
					class="mb-6 rounded-lg border border-gray-700 bg-gray-800/50 p-6 shadow-lg backdrop-blur"
				>
					<div class="mb-4 flex items-center justify-between">
						<h2 class="flex items-center text-xl font-bold text-white">
							<svg
								xmlns="http://www.w3.org/2000/svg"
								class="text-primary mr-2 h-5 w-5"
								fill="none"
								viewBox="0 0 24 24"
								stroke="currentColor"
							>
								<path
									stroke-linecap="round"
									stroke-linejoin="round"
									stroke-width="2"
									d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
								/>
							</svg>
							Deskripsi
						</h2>
					</div>

					<div
						class={`relative text-gray-300 ${!isDescriptionExpanded && 'max-h-24 overflow-hidden'}`}
					>
						<p>{episode.content.description || 'Tidak ada deskripsi untuk episode ini.'}</p>

						{#if !isDescriptionExpanded}
							<div class="absolute right-0 bottom-0 left-0 h-12"></div>
						{/if}
					</div>

					{#if episode.content.description && episode.content.description.length > 100}
						<button
							class="text-primary hover:text-primary/80 mt-4 flex items-center font-medium transition-all duration-200"
							onclick={() => (isDescriptionExpanded = !isDescriptionExpanded)}
						>
							{#if isDescriptionExpanded}
								<span>Tutup</span>
								<svg
									xmlns="http://www.w3.org/2000/svg"
									class="ml-1 h-4 w-4"
									fill="none"
									viewBox="0 0 24 24"
									stroke="currentColor"
								>
									<path
										stroke-linecap="round"
										stroke-linejoin="round"
										stroke-width="2"
										d="M5 15l7-7 7 7"
									/>
								</svg>
							{:else}
								<span>Baca Selengkapnya</span>
								<svg
									xmlns="http://www.w3.org/2000/svg"
									class="ml-1 h-4 w-4"
									fill="none"
									viewBox="0 0 24 24"
									stroke="currentColor"
								>
									<path
										stroke-linecap="round"
										stroke-linejoin="round"
										stroke-width="2"
										d="M19 9l-7 7-7-7"
									/>
								</svg>
							{/if}
						</button>
					{/if}
				</div>

				<!-- Ongoing Donghua -->
				<Ongoing
					{content}
					{allEpisodes}
					containerClass="rounded-lg border p-6 shadow-lg backdrop-blur bg-gray-800/50 border-gray-700 text-white"
				/>
			{:else}
				<div class="rounded-lg border border-gray-700 bg-gray-800 p-6 shadow-lg">
					<div class="mb-4 flex items-center text-yellow-400">
						<svg
							xmlns="http://www.w3.org/2000/svg"
							class="mr-2 h-6 w-6"
							fill="none"
							viewBox="0 0 24 24"
							stroke="currentColor"
						>
							<path
								stroke-linecap="round"
								stroke-linejoin="round"
								stroke-width="2"
								d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"
							/>
						</svg>
						<p class="text-lg font-semibold">
							Tidak ada link streaming tersedia untuk episode ini.
						</p>
					</div>
					<p class="text-gray-400">
						Episode ini mungkin belum dirilis atau sedang dalam pemeliharaan. Silakan coba lagi
						nanti.
					</p>
				</div>
			{/if}
		{:else}
			<div class="rounded-lg border border-gray-700 bg-gray-800 p-6 shadow-lg">
				<div class="flex h-64 items-center justify-center">
					<div class="text-center">
						<div class="mb-4">
							<svg
								class="text-primary mx-auto h-10 w-10 animate-spin"
								xmlns="http://www.w3.org/2000/svg"
								fill="none"
								viewBox="0 0 24 24"
							>
								<circle
									class="opacity-25"
									cx="12"
									cy="12"
									r="10"
									stroke="currentColor"
									stroke-width="4"
								></circle>
								<path
									class="opacity-75"
									fill="currentColor"
									d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
								></path>
							</svg>
						</div>
						<p class="text-lg font-medium text-white">Memuat episode...</p>
						<p class="mt-2 text-sm text-gray-400">Mohon tunggu sebentar</p>
					</div>
				</div>
			</div>
		{/if}

		<!-- Native Banner Ad at the bottom -->
		<div
			class="mx-auto mt-6 mb-16 w-full rounded-xl border border-gray-700 bg-gray-800/50 p-6 shadow-lg backdrop-blur"
		>
			<div class="mb-4 text-center">
				<span class="text-sm text-gray-400">Sponsored Content</span>
			</div>
			{@html `<script async="async" data-cfasync="false" src="//pl26302113.effectiveratecpm.com/d561750ea858b8acfce6ddcf0eb58de7/invoke.js"><\/script>
			<div id="container-d561750ea858b8acfce6ddcf0eb58de7"></div>`}
		</div>
	</div>
</div>
