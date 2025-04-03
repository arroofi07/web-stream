<script lang="ts">
	import { Button } from '$lib/components/ui/button';
	import {
		LayoutDashboard,
		FileText,
		ChartBarStacked,
		Layers,
		Clapperboard,
		Link,
		Settings,
		LogOut
	} from '@lucide/svelte';
	import { goto } from '$app/navigation';
</script>

<!-- Enhanced Sidebar -->
<aside class="w-64 border-r shadow-lg transition-all duration-300 ease-in-out">
	<div class="flex items-center justify-between border-b p-6">
		<div class="flex items-center gap-3">
			<h1 class="text-xl font-bold text-gray-800">Admin Stream</h1>
		</div>
		<button class="text-gray-500 hover:text-gray-700">
			<Settings size="20" />
		</button>
	</div>

	<!-- User Profile with Gradient -->
	<div class="bg-gradient-to-r from-blue-500 to-purple-600 p-6 text-white">
		<div class="flex items-center gap-4">
			<img src="#" alt="Admin" class="h-12 w-12 rounded-full border-2 border-white object-cover" />
			<div>
				<p class="text-lg font-semibold">Axe Anonym</p>
				<p class="text-sm opacity-75">make money</p>
			</div>
		</div>
	</div>

	<!-- Navigation with Icons and Active States -->
	<nav class="space-y-2 p-4">
		<!-- dashboard -->
		<Button
			variant="ghost"
			class="w-full justify-start gap-3 text-gray-600 hover:bg-blue-50 hover:text-blue-600"
			onclick={() => goto('/admin')}
		>
			<LayoutDashboard size="18" />
			Dashboard
		</Button>

		<!-- genres -->
		<!-- <Button
			variant="ghost"
			class="w-full justify-start gap-3 text-gray-600 hover:bg-blue-50 hover:text-blue-600"
			onclick={() => {
				goto('/admin/genres');
			}}
		>
			<Layers size="18" />
			Genres
		</Button>
		 -->
		<!-- genres -->
		<Button
			variant="ghost"
			class="w-full justify-start gap-3 text-gray-600 hover:bg-blue-50 hover:text-blue-600"
			onclick={() => {
				goto('/admin/categories');
			}}
		>
			<Layers size="18" />
			Categories/Genres
		</Button>

		<!-- contents -->
		<Button
			variant="ghost"
			class="w-full justify-start gap-3 text-gray-600 hover:bg-blue-50 hover:text-blue-600"
			onclick={() => {
				goto('/admin/contents');
			}}
		>
			<Clapperboard size="18" />
			Contents
		</Button>

		<!-- episodes -->
		<Button
			variant="ghost"
			class="w-full justify-start gap-3 text-gray-600 hover:bg-blue-50 hover:text-blue-600"
			onclick={() => {
				goto('/admin/episodes');
			}}
		>
			<FileText size="18" />
			Episodes
		</Button>

		<!-- streaming links -->
		<Button
			variant="ghost"
			class="w-full justify-start gap-3 text-gray-600 hover:bg-blue-50 hover:text-blue-600"
			onclick={() => {
				goto('/admin/streaming-links');
			}}
		>
			<Link size="18" />
			Streaming Links
		</Button>
	</nav>
	<!-- Logout Section -->
	<div class=" bottom-0 w-full border-t p-4">
		<Button variant="ghost" class="w-full justify-start gap-3 text-red-500 hover:bg-red-50">
			<LogOut size="18" />
			Logout
		</Button>
	</div>
</aside>
