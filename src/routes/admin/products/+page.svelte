<script lang="ts">
  import { onMount } from 'svelte';
  import type { Product } from '../../shop/+page.svelte'; // Import Product interface from shop page

  let products: Product[] = [];
  let isLoading = true;
  let error = '';
  let showForm = false;
  let editingProduct: Product | null = null;

  // Form state
  let form: Product = {
    id: 0,
    name: '',
    price: 0,
    category: '',
    image: '',
    description: ''
  };

  onMount(async () => {
    await fetchProducts();
  });

  async function fetchProducts() {
    try {
      const response = await fetch('/api/products');
      if (response.ok) {
        products = await response.json();
      } else {
        error = 'Failed to load products';
      }
    } catch (err) {
      error = 'Network error loading products';
    } finally {
      isLoading = false;
    }
  }

  async function saveProduct() {
    try {
      const method = editingProduct ? 'PUT' : 'POST';
      const url = editingProduct ? `/api/products/${editingProduct.id}` : '/api/products';
      const response = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(form)
      });
      if (response.ok) {
        await fetchProducts();
        resetForm();
      } else {
        error = 'Failed to save product';
      }
    } catch (err) {
      error = 'Error saving product';
    }
  }

  async function deleteProduct(id: number) {
    if (!confirm('Are you sure you want to delete this product?')) return;
    try {
      const response = await fetch(`/api/products/${id}`, { method: 'DELETE' });
      if (response.ok) {
        await fetchProducts();
      } else {
        error = 'Failed to delete product';
      }
    } catch (err) {
      error = 'Error deleting product';
    }
  }

  function editProduct(product: Product) {
    editingProduct = product;
    form = { ...product };
    showForm = true;
  }

  function resetForm() {
    form = { id: 0, name: '', price: 0, category: '', image: '', description: '' };
    editingProduct = null;
    showForm = false;
  }
</script>

<div class="mx-auto max-w-7xl px-4 sm:px-6 md:px-8">
  <div class="flex justify-between items-center">
    <h1 class="text-2xl font-semibold text-gray-900">Products</h1>
    <button
      on:click={() => { showForm = true; resetForm(); }}
      class="rounded bg-green-500 px-4 py-2 text-white hover:bg-green-600"
    >
      Add Product
    </button>
  </div>

  {#if showForm}
    <div class="mt-6 bg-white p-6 rounded-lg shadow">
      <h2 class="text-lg font-medium mb-4">{editingProduct ? 'Edit Product' : 'Add Product'}</h2>
      <form on:submit|preventDefault={saveProduct}>
        <div class="grid grid-cols-1 gap-4">
          <div>
            <label class="block text-sm font-medium text-gray-700">Name</label>
            <input
              type="text"
              bind:value={form.name}
              required
              class="mt-1 block w-full rounded-md border-gray-300 shadow-sm"
            />
          </div>
          <div>
            <label class="block text-sm font-medium text-gray-700">Price</label>
            <input
              type="number"
              step="0.01"
              bind:value={form.price}
              required
              class="mt-1 block w-full rounded-md border-gray-300 shadow-sm"
            />
          </div>
          <div>
            <label class="block text-sm font-medium text-gray-700">Category</label>
            <select
              bind:value={form.category}
              required
              class="mt-1 block w-full rounded-md border-gray-300 shadow-sm"
            >
              <option value="">Select a category</option>
              <option value="Clothing">Clothing</option>
              <option value="Footwear">Footwear</option>
              <option value="Accessories">Accessories</option>
            </select>
          </div>
          <div>
            <label class="block text-sm font-medium text-gray-700">Image URL</label>
            <input
              type="url"
              bind:value={form.image}
              class="mt-1 block w-full rounded-md border-gray-300 shadow-sm"
            />
          </div>
          <div>
            <label class="block text-sm font-medium text-gray-700">Description</label>
            <textarea
              bind:value={form.description}
              class="mt-1 block w-full rounded-md border-gray-300 shadow-sm"
            ></textarea>
          </div>
        </div>
        <div class="mt-6 flex gap-4">
          <button
            type="submit"
            class="rounded bg-green-500 px-4 py-2 text-white hover:bg-green-600"
          >
            Save
          </button>
          <button
            type="button"
            on:click={resetForm}
            class="rounded bg-gray-300 px-4 py-2 text-gray-700 hover:bg-gray-400"
          >
            Cancel
          </button>
        </div>
      </form>
    </div>
  {/if}

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
            <th class="px-3 py-3.5 text-left text-sm font-semibold text-gray-900">Price</th>
            <th class="px-3 py-3.5 text-left text-sm font-semibold text-gray-900">Category</th>
            <th class="relative py-3.5 pl-3 pr-4 sm:pr-6">Actions</th>
          </tr>
        </thead>
        <tbody class="divide-y divide-gray-200 bg-white">
          {#each products as product}
            <tr>
              <td class="whitespace-nowrap py-4 pl-4 pr-3 text-sm font-medium text-indigo-600 sm:pl-6">{product.name}</td>
              <td class="whitespace-nowrap px-3 py-4 text-sm text-gray-500">${product.price.toFixed(2)}</td>
              <td class="whitespace-nowrap px3 py-4 text-sm text-gray-500">{product.category}</td>
              <td class="relative whitespace-nowrap py-4 pl-3 pr-4 text-right text-sm font-medium sm:pr-6">
                <button
                  on:click={() => editProduct(product)}
                  class="text-indigo-600 hover:text-indigo-900 mr-4"
                >
                  Edit
                </button>
                <button
                  on:click={() => deleteProduct(product.id)}
                  class="text-red-600 hover:text-red-900"
                >
                  Delete
                </button>
              </td>
            </tr>
          {/each}
        </tbody>
      </table>
    </div>
  {/if}
</div>