<script lang="ts">
  import { onMount } from 'svelte';

  interface AnalyticsData {
    totalSales: number;
    totalOrders: number;
    topProducts: { id: number; name: string; sales: number }[];
  }

  let analytics: AnalyticsData = { totalSales: 0, totalOrders: 0, topProducts: [] };
  let isLoading = true;
  let error = '';

  onMount(async () => {
    await fetchAnalytics();
  });

  async function fetchAnalytics() {
    try {
      const response = await fetch('/api/analytics');
      if (response.ok) {
        analytics = await response.json();
      } else {
        error = 'Failed to load analytics';
      }
    } catch (err) {
      error = 'Network error loading analytics';
    } finally {
      isLoading = false;
    }
  }
</script>

<div class="mx-auto max-w-7xl px-4 sm:px-6 md:px-8">
  <h1 class="text-2xl font-semibold text-gray-900">Analytics</h1>

  {#if isLoading}
    <div class="flex justify-center py-12">
      <div class="h-12 w-12 animate-spin rounded-full border-4 border-green-500 border-t-transparent"></div>
    </div>
  {:else if error}
    <div class="rounded bg-red-100 p-4 text-red-700">{error}</div>
  {:else}
    <div class="mt-6 grid grid-cols-1 gap-5 sm:grid-cols-2">
      <div class="overflow-hidden rounded-lg bg-white px-4 py-5 shadow sm:p-6">
        <dt class="truncate text-sm font-medium text-gray-500">Total Sales</dt>
        <dd class="mt-1 text-3xl font-semibold text-gray-900">₱{analytics.totalSales.toFixed(2)}</dd>
      </div>
      <div class="overflow-hidden rounded-lg bg-white px-4 py-5 shadow sm:p-6">
        <dt class="truncate text-sm font-medium text-gray-500">Total Orders</dt>
        <dd class="mt-1 text-3xl font-semibold text-gray-900">{analytics.totalOrders}</dd>
      </div>
    </div>
    <div class="mt-8">
      <h2 class="text-lg font-medium text-gray-900">Top Products</h2>
      <table class="min-w-full divide-y divide-gray-300 mt-4">
        <thead class="bg-gray-50">
          <tr>
            <th class="py-3.5 pl-4 pr-3 text-left text-sm font-semibold text-gray-900 sm:pl-6">Product</th>
            <th class="px-3 py-3.5 text-left text-sm font-semibold text-gray-900">Sales</th>
          </tr>
        </thead>
        <tbody class="divide-y divide-gray-200 bg-white">
          {#each analytics.topProducts as product}
            <tr>
              <td class="whitespace-nowrap py-4 pl-4 pr-3 text-sm font-medium text-indigo-600 sm:pl-6">{product.name}</td>
              <td class="whitespace-nowrap px-3 py-4 text-sm text-gray-500">₱{product.sales.toFixed(2)}</td>
            </tr>
          {/each}
        </tbody>
      </table>
    </div>
  {/if}
</div>