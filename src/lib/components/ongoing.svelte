<script lang="ts">
	import { goto } from '$app/navigation';
	import { page } from '$app/stores';

	// Define proper interfaces for your data
	interface ContentItem {
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

	interface EpisodeItem {
		id: number;
		content_id: number;
		title: string;
		episode_number: number;
		description: string;
		duration: number;
		release_date: string;
		created_at: string;
		updated_at: string;
	}

	export let content: ContentItem[] = [];
	export let allEpisodes: EpisodeItem[] = [];
	export let containerClass = '';
	let isLoading = false;

	// Function to handle episode navigation with loading state
	function navigateToEpisode(episodeId: number | undefined) {
		if (!episodeId) return;
		isLoading = true;
		goto(`/detail/${episodeId}`);
	}
</script>

<!-- Ongoing Donghua -->
<div class={containerClass}>
	<h2 class="mb-4 flex items-center text-xl font-bold">
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
		Ongoing Donghua
	</h2>

	<div class="px-4 py-6">
		<h2 class="mb-4 text-2xl font-bold">Lanjutkan Menonton</h2>

		<div class="grid grid-cols-1 gap-3 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
			{#each content
				.filter((c) => c.status === 'ongoing' && allEpisodes.some((ep) => ep.content_id === c.id))
				.sort((a, b) => b.id - a.id)
				.slice(0, 5) as contentItem, i}
				{@const latestEpisode = allEpisodes
					.filter((ep) => ep.content_id === contentItem.id)
					.sort((a, b) => b.id - a.id)[0]}

				<button
					class="group from-primary/90 to-primary relative w-full overflow-hidden rounded-lg bg-gradient-to-br text-left text-white shadow transition-all duration-300 hover:-translate-y-1 hover:shadow-lg"
					onclick={() => navigateToEpisode(latestEpisode.id)}
					onkeydown={(e) => e.key === 'Enter' && navigateToEpisode(latestEpisode.id)}
				>
					<div class="absolute inset-0 bg-black/20"></div>

					<div class="relative p-4">
						<!-- Content title with clean typography -->
						<h3 class="mb-2 font-semibold tracking-tight">{contentItem.title}</h3>

						<!-- Latest episode with visual indicator -->
						<div class="flex items-center space-x-2">
							<div class="h-2 w-2 animate-pulse rounded-full bg-rose-600"></div>
							<p class="text-sm font-medium">
								Terbaru: Episode {latestEpisode.episode_number}
							</p>
						</div>

						<!-- Play icon that appears on hover -->
						<div
							class="absolute right-3 bottom-3 rounded-full bg-white/20 p-2 opacity-0 transition-all duration-300 group-hover:opacity-100"
						>
							<svg
								xmlns="http://www.w3.org/2000/svg"
								class="h-5 w-5"
								viewBox="0 0 20 20"
								fill="currentColor"
							>
								<path
									fill-rule="evenodd"
									d="M10 18a8 8 0 100-16 8 8 0 000 16zM9.555 7.168A1 1 0 008 8v4a1 1 0 001.555.832l3-2a1 1 0 000-1.664l-3-2z"
									clip-rule="evenodd"
								/>
							</svg>
						</div>
					</div>
				</button>
			{/each}
		</div>

		{#if content.filter((c) => c.status === 'ongoing' && allEpisodes.some((ep) => ep.content_id === c.id)).length === 0}
			<div
				class="flex h-32 items-center justify-center rounded-lg border-2 border-dashed border-gray-300 bg-gray-50"
			>
				<p class="text-center text-gray-500">Tidak ada konten ongoing tersedia</p>
			</div>
		{/if}
	</div>
</div>
