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
</script>

<script lang="ts">
	import * as Card from '$lib/components/ui/card';
	import { Search, PanelTopOpen, X, ChevronRight } from '@lucide/svelte';
	import { fade, slide } from 'svelte/transition';
	import Input from './ui/input/input.svelte';

	const navItems = [
		{
			label: 'Home',
			href: '/'
		},
		{
			label: 'Genres',
			href: '/genres'
		},
		{
			label: 'Contact',
			href: '/contact'
		}
	];

	let mobileMenuOpen = $state(false);
	let searchExpanded = $state(false);
	let activeDropdown = $state<string | null>(null);

	function toggleDropdown(label: string) {
		activeDropdown = activeDropdown === label ? null : label;
	}
</script>

<nav id="navbar" class="bg-primary z-50 px-4 py-3 text-black border-b-2 border-white">
	<div class="mx-auto flex max-w-7xl items-center justify-between">
		<!-- Logo and Search Section -->
		<div class="flex items-center gap-4">
			<a href="/" class="flex items-center gap-2 transition-transform hover:scale-105">
				<img
					src="/logo.png"
					alt="logo"
					class="h-10 w-10 rounded-full border-2 border-white/20 shadow-lg"
				/>
				<span class="hidden font-sans text-lg font-bold tracking-wide md:block">MovieHub</span>
			</a>

			<!-- Desktop Search -->
			<div class="relative hidden md:block">
				<Input
					type="search"
					placeholder="Search for movies..."
					class="w-64 border-white/20 bg-white/10 pl-9 placeholder:text-black focus:bg-white/20"
				/>
				<Search class="absolute top-2.5 left-2.5 h-5 w-5 text-black" />
			</div>

			<!-- Mobile Search Toggle -->
			<button
				class="rounded-full p-2 text-white/80 transition-colors hover:bg-white/20 md:hidden"
				onclick={() => (searchExpanded = !searchExpanded)}
			>
				<Search class="h-5 w-5 text-black" />
			</button>
		</div>

		<!-- Desktop Navigation -->
		<div class="hidden items-center gap-1 md:flex">
			{#each navItems as item}
				<a href={item.href} class="rounded-md px-3 py-2 font-semibold hover:bg-white/20">
					{item.label}
				</a>
			{/each}
		</div>

		<!-- Mobile Menu Button -->
		<button
			class="rounded-md p-1.5 text-black transition-colors hover:bg-white/20 md:hidden"
			onclick={() => (mobileMenuOpen = !mobileMenuOpen)}
			aria-label={mobileMenuOpen ? 'Close menu' : 'Open menu'}
		>
			{#if mobileMenuOpen}
				<X class="h-6 w-6 text-black" />
			{:else}
				<PanelTopOpen class="h-6 w-6 text-black" />
			{/if}
		</button>
	</div>

	<!-- Mobile Search Bar (Expandable) -->
	{#if searchExpanded}
		<div class="px-2 pt-3 md:hidden" transition:slide={{ duration: 200 }}>
			<div class="relative">
				<Input
					type="search"
					placeholder="Search for movies..."
					class="w-full border-white/20 bg-white/10 pl-9 placeholder:text-black"
				/>
				<Search class="absolute top-2.5 left-2.5 h-5 w-5 text-black" />
			</div>
		</div>
	{/if}

	<!-- Mobile Navigation Menu -->
	{#if mobileMenuOpen}
		<div
			class="bg-primary-dark absolute right-0 left-0 z-20 py-3 shadow-xl"
			transition:slide={{ duration: 200 }}
		>
			<div class="bg-primary flex flex-col space-y-1 px-4">
				{#each navItems as item}
					<div class="py-1">
						<button
							class="flex w-full items-center justify-between rounded-md px-3 py-2 font-medium hover:bg-white/10"
							onclick={() => toggleDropdown(item.label)}
						>
							{item.label}
							<ChevronRight class="h-4 w-4 transition-transform" />
						</button>
					</div>
				{/each}
			</div>
		</div>
	{/if}
</nav>
