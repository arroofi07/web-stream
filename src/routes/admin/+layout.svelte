<script lang="ts">
	import { Button } from '$lib/components/ui/button';
	import {
		LayoutDashboard,
		FileText,
		BarChart2,
		Layers,
		Bell,
		User,
		Search,
		Settings,
		LogOut
	} from '@lucide/svelte';
	import SidebarAdmin from '$lib/components/sidebar-admin.svelte';
</script>

<div class="flex h-screen overflow-hidden bg-gray-50">
	<SidebarAdmin />

	<!-- Main Content Area -->
	<main class="flex flex-1 flex-col overflow-hidden">
		<!-- Enhanced Top Navigation -->
		<header class="flex items-center justify-between border-b bg-white p-4 shadow-sm">
			<div class="relative max-w-md flex-1">
				<input
					type="text"
					placeholder="Search dashboard..."
					class="w-full rounded-full border py-2 pr-4 pl-10 transition focus:ring-2 focus:ring-blue-500"
				/>
				<Search
					class="absolute top-1/2 left-3 -translate-y-1/2 transform text-gray-400"
					size="18"
				/>
			</div>

			<div class="flex items-center gap-6">
				<div class="relative">
					<Bell size="20" class="cursor-pointer text-gray-600 hover:text-blue-600" />
					<span
						class="absolute -top-2 -right-2 flex h-5 w-5 items-center justify-center rounded-full bg-red-500 text-xs text-white"
					>
						7
					</span>
				</div>
				<div class="relative">
					<User size="20" class="cursor-pointer text-gray-600 hover:text-blue-600" />
					<span
						class="absolute -top-2 -right-2 flex h-5 w-5 items-center justify-center rounded-full bg-green-500 text-xs text-white"
					>
						4
					</span>
				</div>
			</div>
		</header>

		<!-- Page Content -->
		<div class="flex-1 overflow-y-auto bg-gray-50 p-6">
			<slot />
		</div>
	</main>
</div>
