<script lang="ts">
  import { onMount } from 'svelte';
  import { writable } from 'svelte/store';
  
  interface Product {
    id: number;
    name: string;
    price: number;
    category: string;
    image: string;
    description?: string;
  }

  interface CartItem {
    product: Product;
    quantity: number;
  }
  
  // Cart store
  const cart = writable<CartItem[]>([]);
  let cartItems: CartItem[] = [];
  let isCartOpen = false;
  let isCheckoutOpen = false; // New state for checkout form
  
  // Subscribe to cart changes
  cart.subscribe(items => {
    cartItems = items;
  });

  let products: Product[] = [];
  let categories: string[] = ['All'];
  let isLoading = true;
  let error = '';
  let selectedCategory: string = 'All';
  let filteredProducts: Product[] = [];

  $: {
    filteredProducts = selectedCategory === 'All' 
      ? products 
      : products.filter(product => product.category === selectedCategory);
  }

  onMount(async () => {
    try {
      const catResponse = await fetch('/admin/settings');
      if (catResponse.ok) {
        const data = await catResponse.json();
        categories = ['All', ...data.categories];
      } else {
        error = 'Failed to fetch categories';
      }
      const prodResponse = await fetch('/api/products');
      if (prodResponse.ok) {
        products = await prodResponse.json();
      } else {
        error = 'Failed to load products';
      }
    } catch (err) {
      error = 'Network error loading products';
      console.error('Fetch error:', err);
    } finally {
      isLoading = false;
    }
  });

  function selectCategory(category: string) {
    selectedCategory = category;
  }

  function addToCart(productId: number) {
    const product = products.find(p => p.id === productId);
    if (product) {
      cart.update(items => {
        const existingItem = items.find(item => item.product.id === productId);
        if (existingItem) {
          return items.map(item =>
            item.product.id === productId
              ? { ...item, quantity: item.quantity + 1 }
              : item
          );
        }
        return [...items, { product, quantity: 1 }];
      });
      alert(`Added ${product.name} to cart!`);
    }
  }

  function removeFromCart(productId: number) {
    cart.update(items => items.filter(item => item.product.id !== productId));
  }

  function updateQuantity(productId: number, quantity: number) {
    if (quantity < 1) {
      removeFromCart(productId);
      return;
    }
    cart.update(items =>
      items.map(item =>
        item.product.id === productId ? { ...item, quantity } : item
      )
    );
  }

  function toggleCart() {
    isCartOpen = !isCartOpen;
    if (isCheckoutOpen) isCheckoutOpen = false; // Close checkout when toggling cart
  }

  function toggleCheckout() {
    isCheckoutOpen = !isCheckoutOpen;
  }

  function getCartTotal() {
    return cartItems
      .reduce((total, item) => total + item.product.price * item.quantity, 0)
      .toFixed(2);
  }

  // Checkout form data
  let name = '';
  let address = '';
  let paymentMethod: 'maya' | 'gcash' | 'paypal' = 'maya';
  let checkoutError = '';
  let checkoutSuccess = '';

  async function processPayment() {
    checkoutError = '';
    checkoutSuccess = '';
    if (!name.trim() || !address.trim()) {
      checkoutError = 'Name and address are required';
      return;
    }

    try {
      // Simulate payment processing (replace with real API calls in production)
      await new Promise(resolve => setTimeout(resolve, 1000)); // Simulate API delay
      cart.set([]); // Clear cart after successful payment
      isCheckoutOpen = false;
      isCartOpen = false;
      checkoutSuccess = `Payment of ₱${getCartTotal()} processed successfully with ${paymentMethod}!`;
      setTimeout(() => (checkoutSuccess = ''), 5000); // Clear success message after 5 seconds
    } catch (err) {
      checkoutError = 'Payment processing failed. Please try again.';
      console.error('Payment error:', err);
    }
  }
</script>

<svelte:head>
  <title>Shop - Fashion Store</title>
</svelte:head>

<main>
  <nav class="fixed z-30 flex h-12 w-full items-center justify-end bg-green-400 px-5">
    <ul class="flex list-none items-center gap-5 text-lg font-bold">
      <li class="cursor-pointer rounded-md px-3 py-2 transition-colors hover:bg-purple-100 active:scale-95 active:bg-red-200">
        <a href="/">Home</a>
      </li>
      <li class="cursor-pointer rounded-md px-3 py-2 transition-colors hover:bg-purple-100 active:scale-95 active:bg-red-200">
        <a href="/about">About</a>
      </li>
      <li class="cursor-pointer rounded-md px-3 py-2 transition-colors hover:bg-purple-100 active:scale-95 active:bg-red-200">
        <a href="/help">Help</a>
      </li>
      <li class="cursor-pointer rounded-md px-3 py-2 transition-colors hover:bg-purple-100 active:scale-95 active:bg-red-200">
        <a href="/api/user/login">Log out</a>
      </li>
      <li class="relative">
        <button
          on:click={toggleCart}
          class="flex items-center rounded-md px-3 py-2 transition-colors hover:bg-purple-100 active:scale-95 active:bg-red-200"
          aria-label="Toggle cart"
        >
          <svg class="h-6 w-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z"></path>
          </svg>
          {#if cartItems.length > 0}
            <span class="absolute -right-2 -top-2 flex h-5 w-5 items-center justify-center rounded-full bg-red-500 text-xs font-semibold text-white">
              {cartItems.reduce((sum, item) => sum + item.quantity, 0)}
            </span>
          {/if}
        </button>
        {#if isCartOpen}
          <div class="absolute right-0 top-12 z-50 w-80 rounded-lg bg-white shadow-2xl">
            <div class="p-4">
              <div class="mb-3 flex items-center justify-between">
                <h3 class="text-lg font-bold text-gray-800">Your Cart</h3>
                <button
                  on:click={toggleCart}
                  class="text-gray-500 hover:text-gray-700"
                  aria-label="Close cart"
                >
                  <svg class="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"></path>
                  </svg>
                </button>
              </div>
              {#if cartItems.length === 0}
                <p class="text-gray-600">Your cart is empty.</p>
              {:else}
                {#each cartItems as item}
                  <div class="mb-3 flex items-center justify-between border-b border-gray-200 pb-3">
                    <div class="flex items-center">
                      <img
                        src={item.product.image || 'https://via.placeholder.com/50x50'}
                        alt={item.product.name}
                        class="mr-3 h-12 w-12 rounded-md object-cover"
                      />
                      <div>
                        <p class="font-semibold text-gray-800">{item.product.name}</p>
                        <p class="text-sm text-gray-600">₱{item.product.price.toFixed(2)} x {item.quantity}</p>
                      </div>
                    </div>
                    <div class="flex items-center">
                      <input
                        type="number"
                        min="0"
                        value={item.quantity}
                        on:input={(e) => updateQuantity(item.product.id, parseInt(e.currentTarget.value))}
                        class="w-12 rounded-md border border-gray-300 p-1 text-center text-sm focus:outline-none focus:ring-2 focus:ring-green-400"
                      />
                      <button
                        on:click={() => removeFromCart(item.product.id)}
                        class="ml-2 text-red-500 hover:text-red-700"
                        aria-label={`Remove ${item.product.name} from cart`}
                      >
                        <svg class="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"></path>
                        </svg>
                      </button>
                    </div>
                  </div>
                {/each}
                <div class="mt-4 flex justify-between">
                  <span class="font-bold text-gray-800">Total:</span>
                  <span class="font-bold text-gray-800">₱{getCartTotal()}</span>
                </div>
                <button
                  on:click={toggleCheckout}
                  class="mt-4 w-full rounded-md bg-green-500 px-4 py-2 text-white transition-colors hover:bg-green-600 focus:outline-none focus:ring-2 focus:ring-green-400"
                >
                  Proceed to Checkout
                </button>
              {/if}
            </div>
            {#if isCheckoutOpen && cartItems.length > 0}
              <div class="p-4 border-t border-gray-200">
                <h3 class="text-lg font-bold text-gray-800 mb-4">Checkout</h3>
                {#if checkoutError}
                  <div class="mb-4 rounded-md bg-red-100 p-2 text-red-700">{checkoutError}</div>
                {/if}
                {#if checkoutSuccess}
                  <div class="mb-4 rounded-md bg-green-100 p-2 text-green-700">{checkoutSuccess}</div>
                {/if}
                <form on:submit|preventDefault={processPayment}>
                  <div class="mb-4">
                    <label for="name" class="block text-sm font-medium text-gray-700">Full Name</label>
                    <input
                      type="text"
                      id="name"
                      bind:value={name}
                      required
                      class="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                    />
                  </div>
                  <div class="mb-4">
                    <label for="address" class="block text-sm font-medium text-gray-700">Address</label>
                    <textarea
                      id="address"
                      bind:value={address}
                      required
                      rows="3"
                      class="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                    />
                  </div>
                  <div class="mb-4">
                    <label for="paymentMethod" class="block text-sm font-medium text-gray-700">Payment Method</label>
                    <select
                      id="paymentMethod"
                      bind:value={paymentMethod}
                      required
                      class="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                    >
                      <option value="maya">Maya</option>
                      <option value="gcash">GCash</option>
                      <option value="paypal">PayPal</option>
                    </select>
                  </div>
                  <button
                    type="submit"
                    class="w-full rounded-md bg-green-500 px-4 py-2 text-white transition-colors hover:bg-green-600 focus:outline-none focus:ring-2 focus:ring-green-400"
                  >
                    Complete Payment
                  </button>
                </form>
              </div>
            {/if}
          </div>
        {/if}
      </li>
    </ul>
  </nav>

  <div class="min-h-screen bg-gradient-to-r from-green-400 to-green-500 pt-16">
    <div class="p-8">
      <h2 class="mb-6 text-3xl font-bold text-black">Shop Our Collection</h2>
      
      {#if isLoading}
        <div class="flex justify-center py-12">
          <div class="h-12 w-12 animate-spin rounded-full border-4 border-green-500 border-t-transparent"></div>
        </div>
      {:else if error}
        <div class="rounded-md bg-red-100 p-4 text-red-700">
          {error} - Please try again later
        </div>
      {:else}
        <div class="mb-8">
          <h3 class="mb-3 text-xl font-semibold text-gray-800">Filter by Category:</h3>
          <div class="flex flex-wrap gap-2">
            {#each categories as category}
              <button 
                on:click={() => selectCategory(category)}
                class={`rounded-full px-4 py-2 transition-colors ${
                  selectedCategory === category 
                    ? 'bg-black text-white' 
                    : 'bg-white text-black hover:bg-gray-100'
                }`}
              >
                {category}
              </button>
            {/each}
          </div>
        </div>
        
        {#if filteredProducts.length === 0}
          <div class="rounded-md bg-yellow-100 p-4 text-yellow-800">
            No products found in this category.
          </div>
        {:else}
          <div class="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
            {#each filteredProducts as product}
              <div class="overflow-hidden rounded-lg bg-white shadow-lg transition-shadow hover:shadow-xl">
                <div class="flex h-48 items-center justify-center bg-gray-200">
                  <img 
                    src={product.image || 'https://via.placeholder.com/300x200'} 
                    alt={product.name}
                    class="h-full w-full object-cover"
                  />
                </div>
                <div class="p-4">
                  <h3 class="mb-1 text-lg font-bold text-gray-800">{product.name}</h3>
                  {#if product.description}
                    <p class="mb-2 text-sm text-gray-600">{product.description}</p>
                  {/if}
                  <div class="flex items-center justify-between">
                    <span class="font-bold text-green-600">₱{product.price.toFixed(2)}</span>
                    <button 
                      class="rounded-md bg-green-500 px-3 py-1 text-white transition-colors hover:bg-green-600 focus:outline-none focus:ring-2 focus:ring-green-400"
                      on:click={() => addToCart(product.id)}
                    >
                      Add to Cart
                    </button>
                  </div>
                </div>
              </div>
            {/each}
          </div>
        {/if}
      {/if}
    </div>
  </div>
</main>