<script module>
	import { page } from '$app/stores';
</script>

<script lang="ts">
	let id = $page.params.id;
	export let data;
</script>

<div class="min-h-screen bg-gray-900">
	<div class="container mx-auto px-4 py-8">
		<!-- Video Player Container -->
		<div class="relative mb-6 aspect-video w-full">
			<iframe
				src={data.videoUrl}
				class="absolute left-0 top-0 h-full w-full rounded-lg shadow-lg"
				allowfullscreen
				frameborder="0"
				title="Video Player"
			></iframe>
		</div>

		<!-- Video Info Section -->
		<div class="rounded-lg bg-gray-800 p-6">
			<h1 class="mb-4 text-2xl font-bold text-white">
				Video #{data.id}
			</h1>

			<!-- Additional Info -->
			<div class="space-y-4">
				<div class="flex items-center space-x-4">
					<div class="flex space-x-2 text-gray-400">
						<button class="transition-colors duration-200 hover:text-white">
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
									d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z"
								/>
							</svg>
						</button>
						<button class="transition-colors duration-200 hover:text-white">
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
									d="M8.684 13.342C8.886 12.938 9 12.482 9 12c0-.482-.114-.938-.316-1.342m0 2.684a3 3 0 110-2.684m0 2.684l6.632 3.316m-6.632-6l6.632-3.316m0 0a3 3 0 105.367-2.684 3 3 0 00-5.367 2.684zm0 9.316a3 3 0 105.367 2.684 3 3 0 00-5.367-2.684z"
								/>
							</svg>
						</button>
					</div>
				</div>
			</div>
		</div>
	</div>
</div>
