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
	import { fade, fly } from 'svelte/transition';

	// let { featuredDonghua }: PageData = $props();
	let { data } = $props();
	let featuredDonghua = data.featuredDonghua;

	// Tambahkan state untuk animasi
	let isPageLoaded = false;

	onMount(() => {
		isPageLoaded = true;
		console.log('Page mounted');
	});
</script>

<div class="container mx-auto px-4 py-8">
	<!-- Hero Section -->
	<section
		class="relative mb-12 h-[600px] overflow-hidden rounded-xl shadow-2xl"
		in:fade={{ duration: 1000 }}
	>
		<div
			class="absolute inset-0 z-10 bg-gradient-to-r from-primary/80 via-primary/50 to-transparent"
		></div>
		<img
			src="/images/hero-banner.jpg"
			alt="Featured Donghua"
			class="h-full w-full transform object-cover transition-transform duration-700 hover:scale-105"
		/>
		<div
			class="absolute bottom-16 left-10 z-20 max-w-2xl"
			in:fly={{ y: 50, duration: 1000, delay: 300 }}
		>
			<Card class="border-none bg-primary/80 backdrop-blur-sm">
				<CardHeader>
					<CardTitle>
						<h1 class="text-shadow-lg text-6xl leading-tight font-bold text-white">
							Discover Amazing Donghua
						</h1>
					</CardTitle>
					<CardDescription>
						<p class="text-xl text-gray-200">Watch the best Chinese animations with HD quality</p>
					</CardDescription>
				</CardHeader>
				<CardFooter class="pt-0">
					<Button variant="secondary" size="lg" class="transition-transform hover:scale-105">
						Start Watching
					</Button>
				</CardFooter>
			</Card>
		</div>
	</section>

	<!-- Search Section -->
	<div class="mb-16">
		<div class="relative mx-auto max-w-2xl" in:fade={{ duration: 800, delay: 500 }}>
			<Input
				type="search"
				placeholder="Search donghua..."
				class="focus:border-primary w-full rounded-full border-2 border-gray-300 shadow-lg"
			/>
			<span class="absolute top-1/2 right-4 -translate-y-1/2 text-gray-400">🔍</span>
		</div>
	</div>

	<!-- Featured Donghua -->
	<section class="mb-16">
		<h2 class="mb-8 text-center text-4xl font-bold" in:fade={{ duration: 800, delay: 700 }}>
			Featured Donghua
		</h2>
		<div class="grid grid-cols-2 gap-8 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5">
			{#each featuredDonghua as donghua, i}
				<div in:fly={{ y: 50, duration: 800, delay: 800 + i * 100 }}>
					<Card
						class="group bg-primary flex h-full flex-col transition-all duration-300 hover:shadow-xl "
					>
						<CardHeader class="p-0">
							<div class="relative h-[150px] overflow-hidden rounded-t-lg lg:h-[250px]">
								<img
									src={donghua.image}
									alt={donghua.title}
									class="h-full w-full transform object-cover transition-transform duration-500 group-hover:scale-110"
								/>
								<div
									class="absolute top-3 right-3 rounded-full bg-black/80 px-3 py-1 text-sm text-white"
								>
									{donghua.episode}
								</div>
							</div>
						</CardHeader>
						<CardContent class="flex flex-grow flex-col">
							<CardTitle class="mb-3 line-clamp-2 text-xl">{donghua.title}</CardTitle>
						</CardContent>
						<CardFooter class="mt-auto">
							<Button
								variant="outline"
								class="hover:bg-primary w-full transition-colors hover:text-white"
							>
								Watch Now
							</Button>
						</CardFooter>
					</Card>
				</div>
			{/each}
		</div>
	</section>

	<!-- Categories -->
	<section class="mb-12">
		<h2 class="mb-8 text-center text-4xl font-bold" in:fade={{ duration: 800, delay: 900 }}>
			Categories
		</h2>
		<div class="flex flex-wrap justify-center gap-4" in:fade={{ duration: 800, delay: 1000 }}>
			<Button variant="outline" class="hover:bg-primary px-6 transition-colors hover:text-white">
				Action
			</Button>
			<Button variant="outline" class="hover:bg-primary px-6 transition-colors hover:text-white">
				Fantasy
			</Button>
			<Button variant="outline" class="hover:bg-primary px-6 transition-colors hover:text-white">
				Martial Arts
			</Button>
			<Button variant="outline" class="hover:bg-primary px-6 transition-colors hover:text-white">
				Adventure
			</Button>
			<Button variant="outline" class="hover:bg-primary px-6 transition-colors hover:text-white">
				Romance
			</Button>
		</div>
	</section>
</div>

<style>
	.text-shadow-lg {
		text-shadow: 2px 2px 4px rgba(0, 0, 0, 0.5);
	}
</style>
