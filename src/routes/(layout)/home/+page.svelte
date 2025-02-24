<script lang="ts">
  import { onMount } from 'svelte';
  import { Button } from "$lib/components/ui/button";
  import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "$lib/components/ui/card";
  import { Input } from "$lib/components/ui/input";
  import type { PageData } from './$types';

  let { featuredDonghua }: PageData = $props();


  onMount(() => {
    console.log('Page mounted');
  });
</script>

<div class="container mx-auto px-4 py-8">
  <!-- Hero Section -->
  <section class="relative h-[500px] rounded-xl overflow-hidden mb-12">
    <div class="absolute inset-0 bg-gradient-to-r from-black/60 to-transparent z-10"></div>
    <img 
      src="/images/hero-banner.jpg" 
      alt="Featured Donghua" 
      class="w-full h-full object-cover"
    />
    <div class="absolute bottom-10 left-10 z-20 text-white">
      <h1 class="text-5xl font-bold mb-4">Discover Amazing Donghua</h1>
      <p class="text-xl mb-6">Watch the best Chinese animations with HD quality</p>
      <Button variant="secondary" size="lg">Start Watching</Button>
    </div>
  </section>

  <!-- Search Section -->
  <div class="mb-12">
    <Input 
      type="search" 
      placeholder="Search donghua..." 
      class="w-full max-w-xl mx-auto"
    />
  </div>

  <!-- Featured Donghua -->
  <section class="mb-12">
    <h2 class="text-3xl font-bold mb-6">Featured Donghua</h2>
    <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
      {#each featuredDonghua as donghua}
        <Card>
          <CardHeader class="p-0">
            <div class="relative h-[200px] rounded-t-lg overflow-hidden">
              <img 
                src={donghua.image} 
                alt={donghua.title}
                class="w-full h-full object-cover"
              />
              <div class="absolute top-2 right-2 bg-black/70 text-white px-2 py-1 rounded">
                {donghua.episode}
              </div>
            </div>
          </CardHeader>
          <CardContent class="pt-4">
            <CardTitle class="text-lg mb-2">{donghua.title}</CardTitle>
            <CardDescription class="flex items-center">
              <span class="text-yellow-400">★</span>
              <span class="ml-1">{donghua.rating}</span>
            </CardDescription>
          </CardContent>
          <CardFooter>
            <Button variant="outline" class="w-full">Watch Now</Button>
          </CardFooter>
        </Card>
      {/each}
    </div>
  </section>

  <!-- Categories -->
  <section class="mb-12">
    <h2 class="text-3xl font-bold mb-6">Categories</h2>
    <div class="flex flex-wrap gap-4">
      <Button variant="outline">Action</Button>
      <Button variant="outline">Fantasy</Button>
      <Button variant="outline">Martial Arts</Button>
      <Button variant="outline">Adventure</Button>
      <Button variant="outline">Romance</Button>
    </div>
  </section>
</div>