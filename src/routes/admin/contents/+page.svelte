<script lang="ts">
	import * as AlertDialog from '$lib/components/ui/alert-dialog';
	import { Button, buttonVariants } from '$lib/components/ui/button';
	import { Input } from '$lib/components/ui/input';
	import {
		Card,
		CardContent,
		CardHeader,
		CardTitle,
		CardDescription
	} from '$lib/components/ui/card';

	import { Badge } from '$lib/components/ui/badge';
	import { Separator } from '$lib/components/ui/separator';
	import { goto } from '$app/navigation';
	import { toast } from 'svelte-sonner';
	import { ChevronDown, Search, PlusCircle, Edit, Trash2 } from '@lucide/svelte';
	import type { PageData } from './$types';

	let { data }: { data: PageData } = $props();

	// Membuat state untuk contents yang bisa diubah
	let contents = $state(data.contents);

	// State untuk pencarian dan filter menggunakan $state()
	let searchQuery = $state('');
	let statusFilter = $state('all');
	let selectedContent: any = $state(null);

	// Reactive statement untuk memfilter konten
	const filteredContents = $derived(
		contents.filter(
			(content: any) =>
				content.title.toLowerCase().includes(searchQuery.toLowerCase()) &&
				(statusFilter === 'all' || content.status === statusFilter)
		)
	);

	// handle delete
	const handleDelete = async (id: string) => {
		try {
			const response = await fetch(`https://arpansi-enterprise.my.id/api/contents/${id}`, {
				method: 'DELETE'
			});

			if (response.ok) {
				contents = contents.filter((content: any) => content.id !== id);
				toast.success('Content deleted successfully');
				selectedContent = null;
			} else {
				const errorData = await response.json();
				toast.error(errorData.message || 'Failed to delete content');
			}
		} catch (error) {
			console.error('Delete error:', error);
			toast.error('An error occurred while deleting content');
		}
	};
</script>

<div class="container mx-auto space-y-6 px-4 py-8">
	<div class="flex flex-col items-center justify-between space-y-4 md:flex-row md:space-y-0">
		<div>
			<h1 class="text-foreground text-4xl font-extrabold tracking-tight">Contents Library</h1>
			<p class="text-muted-foreground">Manage and organize your content collection</p>
		</div>

		<div class="flex w-full flex-col gap-4 md:w-auto md:flex-row">
			<div class="relative flex-grow">
				<Search class="text-muted-foreground absolute top-1/2 left-3 -translate-y-1/2" size={20} />
				<Input
					type="text"
					placeholder="Search contents..."
					class="w-full pl-10"
					bind:value={searchQuery}
				/>
			</div>

			<div class="relative">
				<select
					bind:value={statusFilter}
					class="bg-background w-full appearance-none rounded-md border px-4 py-2 pr-8"
				>
					<option value="all">All Status</option>
					<option value="ongoing">Ongoing</option>
					<option value="completed">Completed</option>
				</select>
				<ChevronDown
					class="text-muted-foreground absolute top-1/2 right-2 -translate-y-1/2"
					size={20}
				/>
			</div>

			<Button
				variant="default"
				class="w-full md:w-auto"
				onclick={() => goto('/admin/contents/create')}
			>
				<PlusCircle class="mr-2" size={20} />
				New Content
			</Button>
		</div>
	</div>

	<Separator />

	{#if contents.length === 0}
		<div class="bg-muted rounded-lg py-12 text-center">
			<p class="text-muted-foreground text-2xl font-semibold">No contents found</p>
			<p class="text-muted-foreground mt-2">Start by adding a new content item</p>
		</div>
	{:else}
		<div class="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
			{#each filteredContents as content (content.id)}
				<Card class="group transition-all duration-300 hover:shadow-xl">
					<div class="relative">
						<img
							src={content.thumbnail}
							alt={content.title}
							class="h-48 w-full rounded-t-lg object-cover transition-opacity group-hover:opacity-80"
						/>
						<Badge
							variant={content.status === 'ongoing' ? 'secondary' : 'default'}
							class="absolute top-2 right-2"
						>
							{content.status}
						</Badge>
					</div>

					<CardContent class="space-y-3 p-4">
						<div>
							<h3 class="line-clamp-2 text-lg font-bold">{content.title}</h3>
							<p class="text-muted-foreground text-sm">
								{content.totalEpisodes} episodes • Released: {content.releaseDate}
							</p>
						</div>

						{#if content.genres && content.genres.length > 0}
							<div class="flex flex-wrap gap-2">
								{#each content.genres.slice(0, 3) as genre}
									<Badge variant="outline" size="sm">{genre}</Badge>
								{/each}
							</div>
						{/if}

						<div class="flex items-center justify-between pt-2">
							<Button
								variant="outline"
								size="sm"
								onclick={() => goto(`/admin/contents/update/${content.id}`)}
							>
								<Edit class="mr-2" size={16} />
								Edit
							</Button>
							<Button variant="destructive" size="sm" onclick={() => handleDelete(content.id)}>
								<Trash2 class="mr-2" size={16} />
								Delete
							</Button>
						</div>
					</CardContent>
				</Card>
			{:else}
				<div class="col-span-full text-center py-12 bg-muted rounded-lg">
					<p class="text-2xl font-semibold text-muted-foreground">No results match your search</p>
					<p class="text-muted-foreground mt-2">Try adjusting your search or filter</p>
				</div>
			{/each}
		</div>
	{/if}
</div>
