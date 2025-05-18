<script lang="ts">
  import { onMount } from 'svelte';

  interface Customer {
    id: number;
    name: string;
    email: string;
    totalOrders: number;
    totalSpent: number;
  }

  let customers: Customer[] = [];
  let isLoading = true;
  let error = '';

  onMount(async () => {
    await fetchCustomers();
  });

  async function fetchCustomers() {
    try {
      const response = await fetch('/api/customers');
      if (response.ok) {
        customers = await response.json();
      } else {
        error = 'Failed to load customers';
      }
    } catch (err) {
      error = 'Network error loading customers';
    } finally {
      isLoading = false;
    }
  }
</script>

<div class="mx-auto max-w-7xl px-4 sm:px-6 md:px-8">
  <h1 class="text-2xl font-semibold text-gray-900">Customers</h1>

  {#if isLoading}
    <div class="flex justify-center py-12">
      <div class="h-12 w-12 animate-spin rounded-full border-4 border-green-500 border-t-transparent"></div>
    </div>
  {:else if error}
    <div class="rounded bg-red-100 p-4 text-red-700">{error}</div>
  {:else}
    <div class="mt-8">
      <table class="min-w-full divide-y divide-gray-300">
        <thead class="bg-gray-50">
          <tr>
            <th class="py-3.5 pl-4 pr-3 text-left text-sm font-semibold text-gray-900 sm:pl-6">Name</th>
            <th class="px-3 py-3.5 text-left text-sm font-semibold text-gray-900">Email</th>
            <th class="px-3 py-3.5 text-left text-sm font-semibold text-gray-900">Total Orders</th>
            <th class="px-3 py-3.5 text-left text-sm font-semibold text-gray-900">Total Spent</th>
            <th class="relative py-3.5 pl-3 pr-4 sm:pr-6">Actions</th>
          </tr>
        </thead>
        <tbody class="divide-y divide-gray-200 bg-white">
          {#each customers as customer}
            <tr>
              <td class="whitespace-nowrap py-4 pl-4 pr-3 text-sm font-medium text-indigo-600 sm:pl-6">{customer.name}</td>
              <td class="whitespace-nowrap px-3 py-4 text-sm text-gray-500">{customer.email}</td>
              <td class="whitespace-nowrap px-3 py-4 text-sm text-gray-500">{customer.totalOrders}</td>
              <td class="whitespace-nowrap px-3 py-4 text-sm text-gray-500">₱{customer.totalSpent.toFixed(2)}</td>
              <td class="relative whitespace-nowrap py-4 pl-3 pr-4 text-right text-sm font-medium sm:pr-6">
                <a href={`/admin/customers/${customer.id}`} class="text-indigo-600 hover:text-indigo-900">View</a>
              </td>
            </tr>
          {/each}
        </tbody>
      </table>
    </div>
  {/if}
</div>