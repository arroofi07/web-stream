<script lang="ts">
	import { onMount } from 'svelte';

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

	interface typeData {
		episodes: EpisodeData;
	}

	export let data: typeData;
	let episode: EpisodeData | null = null;

	onMount(() => {
		episode = data.episodes;
	});
</script>

<div class="min-h-screen bg-gray-900">
	<div class="container mx-auto px-4 py-8">
		{#if episode}
			<!-- Video Player Container -->
			{#if episode.streaming_links && episode.streaming_links.length > 0}
				{@const url = episode.streaming_links[0].url}
				<div class="relative mb-6 aspect-video w-full">
					<iframe
						src={url}
						class="absolute top-0 left-0 h-full w-full rounded-lg shadow-lg"
						allowfullscreen
						frameborder="0"
						title="Video Player"
					></iframe>
				</div>

				<!-- Video Info Section -->
				<div class="rounded-lg bg-gray-800 p-6">
					<h1 class="mb-4 text-2xl font-bold text-white">
						{episode.title} episode {episode.episode_number} sub indo
					</h1>
					<p class="mb-4 text-gray-300">{episode.description}</p>

					<!-- Additional Info -->
					<div class="space-y-4">
						<div class="flex items-center space-x-4">
							<div class="flex space-x-2 text-gray-400">
								<span>Episode {episode.episode_number}</span>
								<span>•</span>
								<span>{episode.duration} min</span>
							</div>
						</div>
					</div>
				</div>
			{:else}
				<div class="rounded-lg bg-gray-800 p-6">
					<p class="text-white">No streaming links available for this episode.</p>
				</div>
			{/if}
		{:else}
			<div class="rounded-lg bg-gray-800 p-6">
				<p class="text-white">Loading episode or no episode available...</p>
				<pre class="mt-4 text-xs text-gray-400">Loading...</pre>
			</div>
		{/if}
	</div>
</div>
