<!-- Dashboard.svelte -->
<script>
	import { onMount } from 'svelte';

	// Mock data for the dashboard
	let stats = [
		{ title: 'Total Users', value: '3,897', change: '+12.5%', trend: 'up' },
		{ title: 'Revenue', value: '$48,385', change: '+7.2%', trend: 'up' },
		{ title: 'Active Projects', value: '126', change: '-2.3%', trend: 'down' },
		{ title: 'Conversion Rate', value: '28.6%', change: '+4.1%', trend: 'up' }
	];

	let recentActivities = [
		{
			user: 'John Doe',
			action: 'Created a new project',
			time: '2 minutes ago',
			avatar: '/avatars/john.jpg'
		},
		{
			user: 'Sarah Kim',
			action: 'Updated task status',
			time: '15 minutes ago',
			avatar: '/avatars/sarah.jpg'
		},
		{
			user: 'Mike Johnson',
			action: 'Completed milestone',
			time: '1 hour ago',
			avatar: '/avatars/mike.jpg'
		},
		{
			user: 'Anna Garcia',
			action: 'Added new comment',
			time: '3 hours ago',
			avatar: '/avatars/anna.jpg'
		}
	];

	let chartData = {
		labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun'],
		datasets: [
			{ name: 'Users', data: [420, 532, 501, 634, 703, 689] },
			{ name: 'Revenue', data: [362, 390, 410, 395, 430, 488] }
		]
	};

	let currentTab = 'overview';

	// Mock function to simulate chart initialization
	onMount(() => {
		// In a real application, you would initialize your chart library here
		console.log('Chart would be initialized here');
	});
</script>

<div class="min-h-screen bg-gray-100 dark:bg-gray-900">
	<!-- Main Content -->
	<main class="p-4 pt-20 md:ml-64 md:pt-4">
		<!-- Page Header -->
		<div class="mb-6 flex flex-col md:flex-row md:items-center md:justify-between">
			<div>
				<h1 class="text-2xl font-bold text-gray-900 dark:text-white">Dashboard</h1>
				<p class="text-sm text-gray-500 dark:text-gray-400">
					Welcome back, Alex! Here's what's happening today.
				</p>
			</div>


			<div class="mt-4 flex space-x-3 md:mt-0">
				<button
					class="rounded-md border border-gray-300 bg-white px-4 py-2 text-sm text-gray-700 shadow-sm hover:bg-gray-50 dark:border-gray-600 dark:bg-gray-700 dark:text-gray-200 dark:hover:bg-gray-600"
				>
					<span>Export</span>
				</button>
				<button
					class="flex items-center rounded-md bg-blue-600 px-4 py-2 text-sm text-white shadow-sm hover:bg-blue-700"
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
							d="M12 6v6m0 0v6m0-6h6m-6 0H6"
						/>
					</svg>
					<span>New Project</span>
				</button>
			</div>
		</div>

		<!-- Stats Grid -->
		<div class="mb-6 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
			{#each stats as stat}
				<div class="rounded-lg bg-white p-6 shadow-sm dark:bg-gray-800">
					<div class="flex items-center justify-between">
						<h3 class="text-sm font-medium text-gray-500 dark:text-gray-400">{stat.title}</h3>
						<span
							class="rounded-full px-2 py-1 text-xs {stat.trend === 'up'
								? 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200'
								: 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200'}">{stat.change}</span
						>
					</div>
					<p class="mt-2 text-3xl font-bold text-gray-900 dark:text-white">{stat.value}</p>
				</div>
			{/each}
		</div>

		<!-- Charts Section -->
		<div class="mb-6 grid grid-cols-1 gap-6 lg:grid-cols-3">
			<div class="rounded-lg bg-white p-6 shadow-sm lg:col-span-2 dark:bg-gray-800">
				<div class="mb-4 flex items-center justify-between">
					<h3 class="text-lg font-medium text-gray-900 dark:text-white">Performance Overview</h3>
					<div class="flex space-x-2">
						<button
							class="rounded-md bg-blue-100 px-3 py-1 text-xs text-blue-600 dark:bg-blue-900 dark:text-blue-300"
							>Monthly</button
						>
						<button class="rounded-md px-3 py-1 text-xs text-gray-600 dark:text-gray-300"
							>Weekly</button
						>
						<button class="rounded-md px-3 py-1 text-xs text-gray-600 dark:text-gray-300"
							>Daily</button
						>
					</div>
				</div>
				<div class="h-72 w-full">
					<!-- In a real application, you'd render a chart here -->
					<div
						class="flex h-full items-center justify-center rounded-lg bg-gray-50 dark:bg-gray-700"
					>
						<p class="text-gray-500 dark:text-gray-400">Chart would be rendered here</p>
					</div>
				</div>
			</div>

			<div class="rounded-lg bg-white p-6 shadow-sm dark:bg-gray-800">
				<h3 class="mb-4 text-lg font-medium text-gray-900 dark:text-white">Latest Activity</h3>
				<div class="space-y-4">
					{#each recentActivities as activity}
						<div class="flex items-start">
							<div class="mr-3 flex-shrink-0">
								<div class="h-10 w-10 rounded-full bg-gray-200 dark:bg-gray-700"></div>
							</div>
							<div>
								<p class="text-sm font-medium text-gray-900 dark:text-white">{activity.user}</p>
								<p class="text-sm text-gray-500 dark:text-gray-400">{activity.action}</p>
								<p class="mt-1 text-xs text-gray-400 dark:text-gray-500">{activity.time}</p>
							</div>
						</div>
					{/each}
				</div>
				<div class="mt-4 border-t border-gray-200 pt-4 dark:border-gray-700">
					<button class="text-sm text-blue-600 hover:underline dark:text-blue-400"
						>View all activity</button
					>
				</div>
			</div>
		</div>

		<!-- Projects Table -->
		<div class="rounded-lg bg-white p-6 shadow-sm dark:bg-gray-800">
			<div class="mb-4 flex items-center justify-between">
				<h3 class="text-lg font-medium text-gray-900 dark:text-white">Active Projects</h3>
				<button class="text-sm text-blue-600 hover:underline dark:text-blue-400">View all</button>
			</div>
			<div class="overflow-x-auto">
				<table class="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
					<thead>
						<tr>
							<th
								class="px-6 py-3 text-left text-xs font-medium tracking-wider text-gray-500 uppercase dark:text-gray-400"
								>Project</th
							>
							<th
								class="px-6 py-3 text-left text-xs font-medium tracking-wider text-gray-500 uppercase dark:text-gray-400"
								>Deadline</th
							>
							<th
								class="px-6 py-3 text-left text-xs font-medium tracking-wider text-gray-500 uppercase dark:text-gray-400"
								>Status</th
							>
							<th
								class="px-6 py-3 text-left text-xs font-medium tracking-wider text-gray-500 uppercase dark:text-gray-400"
								>Team</th
							>
							<th
								class="px-6 py-3 text-left text-xs font-medium tracking-wider text-gray-500 uppercase dark:text-gray-400"
								>Progress</th
							>
						</tr>
					</thead>
					<tbody class="divide-y divide-gray-200 dark:divide-gray-700">
						<tr>
							<td class="px-6 py-4 whitespace-nowrap">
								<div class="text-sm font-medium text-gray-900 dark:text-white">
									Website Redesign
								</div>
								<div class="text-xs text-gray-500 dark:text-gray-400">Design Team</div>
							</td>
							<td class="px-6 py-4 whitespace-nowrap">
								<div class="text-sm text-gray-900 dark:text-white">April 15, 2025</div>
							</td>
							<td class="px-6 py-4 whitespace-nowrap">
								<span
									class="rounded-full bg-green-100 px-2 py-1 text-xs text-green-800 dark:bg-green-900 dark:text-green-200"
									>On Track</span
								>
							</td>
							<td class="px-6 py-4 whitespace-nowrap">
								<div class="flex -space-x-2">
									<div
										class="h-8 w-8 rounded-full bg-gray-200 ring-2 ring-white dark:bg-gray-700 dark:ring-gray-800"
									></div>
									<div
										class="h-8 w-8 rounded-full bg-gray-300 ring-2 ring-white dark:bg-gray-600 dark:ring-gray-800"
									></div>
									<div
										class="h-8 w-8 rounded-full bg-gray-400 ring-2 ring-white dark:bg-gray-500 dark:ring-gray-800"
									></div>
								</div>
							</td>
							<td class="px-6 py-4 whitespace-nowrap">
								<div class="h-2.5 w-full rounded-full bg-gray-200 dark:bg-gray-700">
									<div class="h-2.5 rounded-full bg-blue-600" style="width: 75%"></div>
								</div>
								<span class="text-xs text-gray-500 dark:text-gray-400">75%</span>
							</td>
						</tr>
						<tr>
							<td class="px-6 py-4 whitespace-nowrap">
								<div class="text-sm font-medium text-gray-900 dark:text-white">
									Mobile App Development
								</div>
								<div class="text-xs text-gray-500 dark:text-gray-400">Engineering</div>
							</td>
							<td class="px-6 py-4 whitespace-nowrap">
								<div class="text-sm text-gray-900 dark:text-white">May 20, 2025</div>
							</td>
							<td class="px-6 py-4 whitespace-nowrap">
								<span
									class="rounded-full bg-yellow-100 px-2 py-1 text-xs text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200"
									>At Risk</span
								>
							</td>
							<td class="px-6 py-4 whitespace-nowrap">
								<div class="flex -space-x-2">
									<div
										class="h-8 w-8 rounded-full bg-gray-200 ring-2 ring-white dark:bg-gray-700 dark:ring-gray-800"
									></div>
									<div
										class="h-8 w-8 rounded-full bg-gray-300 ring-2 ring-white dark:bg-gray-600 dark:ring-gray-800"
									></div>
									<div
										class="h-8 w-8 rounded-full bg-gray-400 ring-2 ring-white dark:bg-gray-500 dark:ring-gray-800"
									></div>
									<div
										class="h-8 w-8 rounded-full bg-gray-500 ring-2 ring-white dark:bg-gray-400 dark:ring-gray-800"
									></div>
								</div>
							</td>
							<td class="px-6 py-4 whitespace-nowrap">
								<div class="h-2.5 w-full rounded-full bg-gray-200 dark:bg-gray-700">
									<div class="h-2.5 rounded-full bg-blue-600" style="width: 45%"></div>
								</div>
								<span class="text-xs text-gray-500 dark:text-gray-400">45%</span>
							</td>
						</tr>
						<tr>
							<td class="px-6 py-4 whitespace-nowrap">
								<div class="text-sm font-medium text-gray-900 dark:text-white">
									Marketing Campaign
								</div>
								<div class="text-xs text-gray-500 dark:text-gray-400">Marketing</div>
							</td>
							<td class="px-6 py-4 whitespace-nowrap">
								<div class="text-sm text-gray-900 dark:text-white">April 8, 2025</div>
							</td>
							<td class="px-6 py-4 whitespace-nowrap">
								<span
									class="rounded-full bg-red-100 px-2 py-1 text-xs text-red-800 dark:bg-red-900 dark:text-red-200"
									>Delayed</span
								>
							</td>
							<td class="px-6 py-4 whitespace-nowrap">
								<div class="flex -space-x-2">
									<div
										class="h-8 w-8 rounded-full bg-gray-200 ring-2 ring-white dark:bg-gray-700 dark:ring-gray-800"
									></div>
									<div
										class="h-8 w-8 rounded-full bg-gray-300 ring-2 ring-white dark:bg-gray-600 dark:ring-gray-800"
									></div>
								</div>
							</td>
							<td class="px-6 py-4 whitespace-nowrap">
								<div class="h-2.5 w-full rounded-full bg-gray-200 dark:bg-gray-700">
									<div class="h-2.5 rounded-full bg-blue-600" style="width: 30%"></div>
								</div>
								<span class="text-xs text-gray-500 dark:text-gray-400">30%</span>
							</td>
						</tr>
					</tbody>
				</table>
			</div>
		</div>
	</main>
</div>
