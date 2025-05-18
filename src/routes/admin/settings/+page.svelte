<script lang="ts">
  import { onMount } from 'svelte';

  let categories: string[] = [];
  let newCategory = '';
  let error = '';
  let success = '';

  onMount(async () => {
    await fetchSettings();
  });

  async function fetchSettings() {
    try {
      const response = await fetch('/api/settings');
      if (!response.ok) throw new Error(`Failed to load settings: ${response.statusText}`);
      const data = await response.json();
      if (!Array.isArray(data.categories)) throw new Error('Invalid settings data');
      categories = data.categories;
    } catch (err) {
      error = err instanceof Error ? err.message : 'Network error loading settings';
      console.error('Fetch settings error:', err);
    }
  }

  async function addCategory() {
    if (!newCategory.trim()) {
      error = 'Category name is required';
      return;
    }
    try {
      const response = await fetch('/api/settings/categories', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ category: newCategory })
      });
      if (!response.ok) {
        const errorData = await response.json();
        error = errorData.error || `Failed to add category: ${response.statusText}`;
        return;
      }
      const data = await response.json();
      categories = [...categories, data.category];
      newCategory = '';
      success = 'Category added successfully!';
      setTimeout(() => (success = ''), 3000); // Clear success message after 3 seconds
    } catch (err) {
      error = err instanceof Error ? err.message : 'Error adding category';
      console.error('Add category error:', err);
    }
  }

  async function deleteCategory(category: string) {
    if (!confirm(`Are you sure you want to delete ${category}?`)) return;
    try {
      const response = await fetch(`/api/settings/categories?category=${encodeURIComponent(category)}`, { method: 'DELETE' });
      if (!response.ok) {
        const errorData = await response.json();
        error = errorData.error || `Failed to delete category: ${response.statusText}`;
        return;
      }
      const data = await response.json();
      categories = categories.filter(c => c !== category);
      success = 'Category deleted successfully!';
      setTimeout(() => (success = ''), 3000); // Clear success message after 3 seconds
    } catch (err) {
      error = err instanceof Error ? err.message : 'Error deleting category';
      console.error('Delete category error:', err);
    }
  }
</script>

<div class="mx-auto max-w-7xl px-4 sm:px-6 md:px-8">
  <h1 class="text-2xl font-semibold text-gray-900">Settings</h1>

  {#if error}
    <div class="mt-4 rounded bg-red-100 p-4 text-red-700">{error}</div>
  {/if}
  {#if success}
    <div class="mt-4 rounded bg-green-100 p-4 text-green-700">{success}</div>
  {/if}

  <div class="mt-6">
    <h2 class="text-lg font-medium text-gray-900">Product Categories</h2>
    <div class="mt-4">
      <div class="flex gap-4 mb-4">
        <input
          type="text"
          bind:value={newCategory}
          placeholder="New category"
          class="block w-full max-w-xs rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm text-black"
        />
        <button
          on:click={addCategory}
          class="rounded bg-green-500 px-4 py-2 text-white hover:bg-green-600 focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-offset-2 disabled:opacity-50"
          disabled={!newCategory.trim()}
        >
          Add Category
        </button>
      </div>
      <ul class="divide-y divide-gray-200">
        {#each categories as category}
          <li class="flex justify-between items-center py-2">
            <span class="text-sm text-gray-700">{category}</span>
            <button
              on:click={() => deleteCategory(category)}
              class="text-red-600 hover:text-red-900 focus:outline-none"
            >
              Delete
            </button>
          </li>
        {/each}
      </ul>
    </div>
  </div>
</div>