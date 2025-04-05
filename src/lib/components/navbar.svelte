<script module>
	export function clickOutside(node: any) {
		const handleClick = (event: any) => {
			if (!node.contains(event.target)) {
				node.dispatchEvent(new CustomEvent('outclick'));
			}
		};

		document.addEventListener('click', handleClick, true);

		return {
			destroy() {
				document.removeEventListener('click', handleClick, true);
			}
		};
	}
	import * as Card from '$lib/components/ui/card';
	import { Search, PanelTopOpen, X, ChevronRight } from '@lucide/svelte';
	import { fade, slide } from 'svelte/transition';
	import Input from './ui/input/input.svelte';
	import { goto } from '$app/navigation';
</script>

<script lang="ts">
	import logo from '$lib/assets/logo/logo-3.png';
	let mobileMenuOpen = $state(false);
	let searchExpanded = $state(false);
	let activeDropdown = $state<string | null>(null);
	let searchQuery = $state('');
	let isSearching = $state(false);
	let isNavigating = $state(false);

	function toggleDropdown(label: string) {
		activeDropdown = activeDropdown === label ? null : label;
	}

	function handleSearch(event: Event) {
		// Prevent default form submission
		event.preventDefault();

		// Check if the search query is not empty
		if (searchQuery.trim()) {
			console.log('Navigating to search:', searchQuery);
			isSearching = true;
			// Navigate to home with search query
			goto(`/home?search=${encodeURIComponent(searchQuery.trim())}`).then(() => {
				isSearching = false;
			});
			// Close mobile search if open
			searchExpanded = false;
		}
	}

	function resetAndGoHome() {
		searchQuery = '';
		isNavigating = true;
		goto('/home').then(() => {
			isNavigating = false;
		});
	}
</script>

<nav id="navbar" class="bg-primary z-50 border-b-2 border-white px-4 py-3 text-black">
	<div class="mx-auto flex max-w-7xl items-center justify-between">
		<!-- Logo and Search Section -->
		<div class="flex items-center gap-4">
			<a
				href="/home"
				class="flex items-center gap-2 transition-transform hover:scale-105"
				onclick={(e) => {
					e.preventDefault();
					resetAndGoHome();
				}}
			>
				<div class="relative h-10 w-10">
					<img
						src={logo}
						alt="logo"
						class="h-10 w-10 rounded-full border-2 border-white/20 shadow-lg"
					/>
					{#if isNavigating}
						<div class="absolute inset-0 flex items-center justify-center rounded-full bg-white/50">
							<div
								class="h-6 w-6 animate-spin rounded-full border-2 border-black border-t-transparent"
							></div>
						</div>
					{/if}
				</div>
				<span
					class="bg-gradient-to-r from-white to-gray-300 bg-clip-text text-lg font-extrabold tracking-wider text-transparent uppercase drop-shadow-sm md:block"
					>Free Nonton</span
				>
			</a>
		</div>

		<!-- search desktop -->
		<div class="relative hidden md:block">
			<form onsubmit={handleSearch}>
				<Input
					type="search"
					placeholder="Search for movies..."
					class="w-72 border-white/20 bg-white/10 pl-9 placeholder:text-black focus:bg-white/20 focus:ring-0 focus:ring-offset-0 focus:outline-none focus-visible:ring-0 focus-visible:outline-none"
					bind:value={searchQuery}
				/>
				<button
					type="submit"
					class="absolute top-2.5 left-2.5 h-5 w-5 text-black"
					disabled={isSearching}
				>
					{#if isSearching}
						<div
							class="h-5 w-5 animate-spin rounded-full border-2 border-current border-t-transparent"
						></div>
					{:else}
						<Search class="h-5 w-5" />
					{/if}
				</button>

				{#if searchQuery}
					<button
						type="button"
						class="absolute top-2.5 right-2.5 h-5 w-5 text-black opacity-70 hover:opacity-100"
						onclick={() => {
							searchQuery = '';
						}}
					>
						<X class="h-5 w-5" />
					</button>
				{/if}
			</form>
		</div>

		<!-- Mobile Search Toggle -->
		<button
			class="rounded-full p-2 text-white/80 transition-colors hover:bg-white/20 md:hidden"
			onclick={() => (searchExpanded = !searchExpanded)}
		>
			<Search class="h-5 w-5 text-black" />
		</button>
	</div>

	<!-- Mobile Search Bar (Expandable) -->
	{#if searchExpanded}
		<div class="px-2 pt-3 md:hidden" transition:slide={{ duration: 200 }}>
			<div class="relative">
				<form onsubmit={handleSearch}>
					<Input
						type="search"
						placeholder="Search for movies..."
						class="w-full border-white/20 bg-white/10 pl-9 placeholder:text-black focus:ring-0 focus:ring-offset-0 focus:outline-none focus-visible:ring-0 focus-visible:outline-none"
						bind:value={searchQuery}
					/>
					<button
						type="submit"
						class="absolute top-2.5 left-2.5 h-5 w-5 text-black"
						disabled={isSearching}
					>
						{#if isSearching}
							<div
								class="h-5 w-5 animate-spin rounded-full border-2 border-current border-t-transparent"
							></div>
						{:else}
							<Search class="h-5 w-5" />
						{/if}
					</button>

					{#if searchQuery}
						<button
							type="button"
							class="absolute top-2.5 right-2.5 h-5 w-5 text-black opacity-70 hover:opacity-100"
							onclick={() => {
								searchQuery = '';
							}}
						>
							<X class="h-5 w-5" />
						</button>
					{/if}
				</form>
			</div>
		</div>
	{/if}

	<!-- Mobile Navigation Menu -->
</nav>

<style>
	/* Remove focus outline and ring from all inputs */
	:global(input:focus) {
		outline: none !important;
		box-shadow: none !important;
		border-color: transparent !important;
		ring: 0 !important;
	}

	:global(input:focus-visible) {
		outline: none !important;
		box-shadow: none !important;
		border-color: transparent !important;
		ring: 0 !important;
	}
</style>
