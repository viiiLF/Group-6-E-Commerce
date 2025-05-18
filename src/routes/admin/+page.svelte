<script lang="ts">
  import { onMount } from 'svelte';
  
  // Existing interfaces
  interface Stats {
    name: string;
    stat: string | number;
    change: string;
    changeType: 'increase' | 'decrease';
  }
  
  interface RecentOrder {
    id: string;
    customerName: string;
    date: string;
    amount: string;
    status: 'Processing' | 'Shipped' | 'Delivered' | 'Cancelled';
  }
  
  // Updated Product interface to match shop page
  interface Product {
    id?: string;
    name: string;
    price: number;
    description: string;
    image: string; // Changed from image_url to image
    category: string; // Added category
    created_at?: string;
  }
  
  let stats: Stats[] = [
    { name: 'Total Revenue', stat: '$24,598', change: '12%', changeType: 'increase' },
    { name: 'New Orders', stat: 43, change: '8%', changeType: 'increase' },
    { name: 'Customers', stat: 2156, change: '5%', changeType: 'increase' },
    { name: 'Avg. Order Value', stat: '$124', change: '3%', changeType: 'decrease' }
  ];
  
  let recentOrders: RecentOrder[] = [
    { id: 'ORD-001', customerName: 'John Brown', date: '2025-05-10', amount: '$149.99', status: 'Delivered' },
    { id: 'ORD-002', customerName: 'Emily Davis', date: '2025-05-12', amount: '$89.50', status: 'Shipped' },
    { id: 'ORD-003', customerName: 'Michael Wilson', date: '2025-05-14', amount: '$214.75', status: 'Processing' },
    { id: 'ORD-004', customerName: 'Sarah Miller', date: '2025-05-15', amount: '$76.25', status: 'Processing' },
    { id: 'ORD-005', customerName: 'David Taylor', date: '2025-05-09', amount: '$320.00', status: 'Delivered' }
  ];
  
  let products: Product[] = [];
  let newProduct: Product = {
    name: '',
    price: 0,
    description: '',
    image: '',
    category: ''
  };
  let error = '';
  let success = '';
  let isLoading = false;
  let categories: string[] = []; // To store available categories
  
  onMount(() => {
    fetchDashboardData();
    fetchProducts();
    fetchCategories(); // Fetch categories on mount
  });
  
  async function fetchDashboardData() {
    try {
      // Example API call (uncomment and adjust based on your backend)
      // const response = await fetch('/api/admin/dashboard');
      // if (response.ok) {
      //   const data = await response.json();
      //   stats = data.stats;
      //   recentOrders = data.recentOrders;
      // }
    } catch (error) {
      console.error('Failed to fetch dashboard data:', error);
    }
  }
  
  async function fetchProducts() {
    try {
      const response = await fetch('/api/products');
      if (response.ok) {
        products = await response.json();
      } else {
        error = 'Failed to fetch products';
      }
    } catch (err) {
      console.error('Error fetching products:', err);
      error = 'Network error while fetching products';
    }
  }
  
  async function fetchCategories() {
    try {
      const response = await fetch('/admin/settings');
      if (response.ok) {
        const data = await response.json();
        categories = data.categories;
      } else {
        error = 'Failed to fetch categories';
      }
    } catch (err) {
      console.error('Error fetching categories:', err);
      error = 'Network error while fetching categories';
    }
  }
  
  async function handleProductSubmit() {
    isLoading = true;
    error = '';
    success = '';

    try {
      const response = await fetch('/api/products', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(newProduct)
      });

      if (response.ok) {
        const addedProduct = await response.json();
        products = [...products, addedProduct];
        success = 'Product added successfully!';
        newProduct = { name: '', price: 0, description: '', image: '', category: '' };
      } else {
        const data = await response.json();
        error = data.message || 'Failed to add product';
      }
    } catch (err) {
      console.error('Error adding product:', err);
      error = 'Network error while adding product';
    } finally {
      isLoading = false;
    }
  }
  
  function getStatusColor(status: string): string {
    switch (status) {
      case 'Processing': return 'bg-yellow-100 text-yellow-800';
      case 'Shipped': return 'bg-blue-100 text-blue-800';
      case 'Delivered': return 'bg-green-100 text-green-800';
      case 'Cancelled': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  }
</script>

<div class="mx-auto max-w-7xl px-4 sm:px-6 md:px-8">
  <h1 class="text-2xl font-semibold text-gray-900">Dashboard</h1>
  
  <!-- Stats Section -->
  <div class="mt-6">
    <div class="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4">
      {#each stats as item}
        <div class="overflow-hidden rounded-lg bg-white px-4 py-5 shadow sm:p-6">
          <dt class="truncate text-sm font-medium text-gray-500">{item.name}</dt>
          <dd class="mt-1 text-3xl font-semibold text-gray-900">{item.stat}</dd>
          <dd class="mt-2 flex items-center text-sm font-medium">
            <div class={item.changeType === 'increase' ? 'text-green-600' : 'text-red-600'}>
              <span class="inline-flex items-center">
                {#if item.changeType === 'increase'}
                  <svg class="-ml-1 mr-0.5 h-5 w-5 flex-shrink-0 self-center text-green-500" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
                    <path fill-rule="evenodd" d="M5.293 9.707a1 1 0 010-1.414l4-4a1 1 0 011.414 0l4 4a1 1 0 01-1.414 1.414L11 7.414V15a1 1 0 11-2 0V7.414L6.707 9.707a1 1 0 01-1.414 0z" clip-rule="evenodd" />
                  </svg>
                {:else}
                  <svg class="-ml-1 mr-0.5 h-5 w-5 flex-shrink-0 self-center text-red-500" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
                    <path fill-rule="evenodd" d="M14.707 10.293a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 111.414-1.414L9 12.586V5a1 1 0 012 0v7.586l2.293-2.293a1 1 0 011.414 0z" clip-rule="evenodd" />
                  </svg>
                {/if}
                {item.change}
              </span>
            </div>
            <span class="ml-2 text-gray-500">from last month</span>
          </dd>
        </div>
      {/each}
    </div>
  </div>
  
  <!-- Product Upload Form -->
  <div class="mt-8">
    <h2 class="text-lg font-medium text-gray-900">Add New Product</h2>
    <div class="mt-4 bg-white shadow sm:rounded-lg p-6">
      {#if error}
        <div class="mb-4 rounded-md bg-red-100 p-2 text-red-700">{error}</div>
      {/if}
      {#if success}
        <div class="mb-4 rounded-md bg-green-100 p-2 text-green-700">{success}</div>
      {/if}
      <form on:submit|preventDefault={handleProductSubmit}>
        <div class="grid grid-cols-1 gap-6 sm:grid-cols-2">
          <div>
            <label for="name" class="block text-sm font-medium text-gray-700">Product Name</label>
            <input
              type="text"
              id="name"
              bind:value={newProduct.name}
              required
              class="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm text-black"
            />
          </div>
          <div>
            <label for="price" class="block text-sm font-medium text-gray-700">Price (₱)</label>
            <input
              type="number"
              id="price"
              bind:value={newProduct.price}
              required
              min="0"
              step="0.01"
              class="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm text-black"
            />
          </div>
          <div>
            <label for="category" class="block text-sm font-medium text-gray-700">Category</label>
            <select
              id="category"
              bind:value={newProduct.category}
              required
              class="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm text-black"
            >
              <option value="" disabled>Select a category</option>
              {#each categories as category}
                <option value={category}>{category}</option>
              {/each}
            </select>
          </div>
          <div class="sm:col-span-2">
            <label for="description" class="block text-sm font-medium text-gray-700">Description</label>
            <textarea
              id="description"
              bind:value={newProduct.description}
              required
              rows="3"
              class="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm text-black"
            />
          </div>
          <div class="sm:col-span-2">
            <label for="image" class="block text-sm font-medium text-gray-700">Image URL</label>
            <input
              type="url"
              id="image"
              bind:value={newProduct.image}
              required
              class="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm text-black"
            />
          </div>
        </div>
        <div class="mt-6">
          <button
            type="submit"
            disabled={isLoading}
            class="inline-flex items-center rounded-md border border-transparent bg-indigo-600 px-4 py-2 text-sm font-medium text-white shadow-sm hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 disabled:opacity-50"
          >
            {isLoading ? 'Adding...' : 'Add Product'}
          </button>
        </div>
      </form>
    </div>
  </div>
  
  <!-- Display Existing Products -->
  <div class="mt-8">
    <h2 class="text-lg font-medium text-gray-900">Existing Products</h2>
    <div class="mt-4 grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
      {#each products as product}
        <div class="bg-white shadow sm:rounded-lg p-4">
          <img src={product.image} alt={product.name} class="h-48 w-full object-cover rounded-md" />
          <h3 class="mt-2 text-lg font-medium text-gray-900">{product.name}</h3>
          <p class="mt-1 text-sm text-gray-500">{product.description}</p>
          <p class="mt-1 text-sm font-medium text-gray-900">${product.price.toFixed(2)}</p>
          <p class="mt-1 text-sm text-gray-500">Category: {product.category}</p>
        </div>
      {/each}
    </div>
  </div>
  
  <!-- Recent Orders -->
  <div class="mt-8">
    <h2 class="text-lg font-medium text-gray-900">Recent Orders</h2>
    <div class="mt-4 flex flex-col">
      <div class="-my-2 -mx-4 overflow-x-auto sm:-mx-6 lg:-mx-8">
        <div class="inline-block min-w-full py-2 align-middle md:px-6 lg:px-8">
          <div class="overflow-hidden shadow ring-1 ring-black ring-opacity-5 md:rounded-lg">
            <table class="min-w-full divide-y divide-gray-300">
              <thead class="bg-gray-50">
                <tr>
                  <th scope="col" class="py-3.5 pl-4 pr-3 text-left text-sm font-semibold text-gray-900 sm:pl-6">Order ID</th>
                  <th scope="col" class="px-3 py-3.5 text-left text-sm font-semibold text-gray-900">Customer</th>
                  <th scope="col" class="px-3 py-3.5 text-left text-sm font-semibold text-gray-900">Date</th>
                  <th scope="col" class="px-3 py-3.5 text-left text-sm font-semibold text-gray-900">Amount</th>
                  <th scope="col" class="px-3 py-3.5 text-left text-sm font-semibold text-gray-900">Status</th>
                  <th scope="col" class="relative py-3.5 pl-3 pr-4 sm:pr-6">
                    <span class="sr-only">View</span>
                  </th>
                </tr>
              </thead>
              <tbody class="divide-y divide-gray-200 bg-white">
                {#each recentOrders as order}
                  <tr>
                    <td class="whitespace-nowrap py-4 pl-4 pr-3 text-sm font-medium text-indigo-600 sm:pl-6">{order.id}</td>
                    <td class="whitespace-nowrap px-3 py-4 text-sm text-gray-500">{order.customerName}</td>
                    <td class="whitespace-nowrap px-3 py-4 text-sm text-gray-500">{order.date}</td>
                    <td class="whitespace-nowrap px-3 py-4 text-sm text-gray-500">{order.amount}</td>
                    <td class="whitespace-nowrap px-3 py-4 text-sm">
                      <span class={`inline-flex rounded-full px-2 text-xs font-semibold leading-5 ${getStatusColor(order.status)}`}>
                        {order.status}
                      </span>
                    </td>
                    <td class="relative whitespace-nowrap py-4 pl-3 pr-4 text-right text-sm font-medium sm:pr-6">
                      <a href={`/admin/orders/${order.id}`} class="text-indigo-600 hover:text-indigo-900">View</a>
                    </td>
                  </tr>
                {/each}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  </div>
</div>