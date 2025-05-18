<script lang="ts">
  import { onMount } from 'svelte';
  
  interface ProductData {
    name: string;
    description: string;
    category: string;
    price: string;
    stock: string;
    status: 'Active' | 'Draft';
    images: string[];
  }
  
  let productData: ProductData = {
    name: '',
    description: '',
    category: '',
    price: '',
    stock: '',
    status: 'Draft',
    images: []
  };
  
  let categories = ['Electronics', 'Apparel', 'Home Goods', 'Fitness', 'Stationery', 'Footwear'];
  let isSubmitting = false;
  let formErrors: Record<string, string> = {};
  
  function validate(): boolean {
    const errors: Record<string, string> = {};
    
    if (!productData.name) {
      errors.name = 'Product name is required';
    }
    
    if (!productData.category) {
      errors.category = 'Category is required';
    }
    
    if (!productData.price) {
      errors.price = 'Price is required';
    } else if (isNaN(parseFloat(productData.price))) {
      errors.price = 'Price must be a valid number';
    }
    
    if (!productData.stock) {
      errors.stock = 'Stock is required';
    } else if (isNaN(parseInt(productData.stock))) {
      errors.stock = 'Stock must be a valid number';
    }
    
    formErrors = errors;
    return Object.keys(errors).length === 0;
  }
  
  async function handleSubmit() {
    if (!validate()) {
      return;
    }
    
    isSubmitting = true;
    
    try {
      // This is where you would send the data to your API
      // For demonstration purposes, we'll just simulate a successful submission
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      alert('Product created successfully!');
      window.location.href = '/admin/products';
    } catch (error) {
      console.error('Failed to create product:', error);
      alert('Failed to create product. Please try again.');
    } finally {
      isSubmitting = false;
    }
  }
  
  function handleImageUpload(event: Event) {
    const target = event.target as HTMLInputElement;
    if (!target.files || target.files.length === 0) return;
    
    const file = target.files[0];
    const reader = new FileReader();
    
    reader.onload = (e: ProgressEvent<FileReader>) => {
      if (e.target?.result) {
        productData.images = [...productData.images, e.target.result as string];
      }
    };
    
    reader.readAsDataURL(file);
    
    // Reset the input so the same file can be selected again
    target.value = '';
  }
  
  function removeImage(index: number) {
    productData.images = productData.images.filter((_, i) => i !== index);
  }
</script>

<div class="mx-auto max-w-5xl px-4 sm:px-6 lg:px-8">
  <div class="md:flex md:items-center md:justify-between">
    <div class="min-w-0 flex-1">
      <h2 class="text-2xl font-bold leading-7 text-gray-900 sm:truncate sm:text-3xl sm:tracking-tight">Add New Product</h2>
    </div>
    <div class="mt-4 flex md:mt-0 md:ml-4">
      <a
        href="/admin/products"
        class="inline-flex items-center rounded-md border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-700 shadow-sm hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2"
      >
        Cancel
      </a>
    </div>
  </div>
  
  <form on:submit|preventDefault={handleSubmit} class="mt-6 space-y-8 divide-y divide-gray-200">
    <div class="space-y-8 divide-y divide-gray-200">
      <div>
        <div class="mt-6 grid grid-cols-1 gap-y-6 gap-x-4 sm:grid-cols-6">
          <div class="sm:col-span-4">
            <label for="name" class="block text-sm font-medium text-gray-700">
              Product Name
            </label>
            <div class="mt-1">
              <input
                type="text"
                name="name"
                id="name"
                bind:value={productData.name}
                class="block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
              />
              {#if formErrors.name}
                <p class="mt-2 text-sm text-red-600">{formErrors.name}</p>
              {/if}
            </div>
          </div>
          
          <div class="sm:col-span-3">
            <label for="category" class="block text-sm font-medium text-gray-700">
              Category
            </label>
            <div class="mt-1">
              <select
                id="category"
                name="category"
                bind:value={productData.category}
                class="block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
              >
                <option value="">Select a category</option>
                {#each categories as category}
                  <option value={category}>{category}</option>
                {/each}
              </select>
              {#if formErrors.category}
                <p class="mt-2 text-sm text-red-600">{formErrors.category}</p>
              {/if}
            </div>
          </div>
          
          <div class="sm:col-span-3">
            <label for="status" class="block text-sm font-medium text-gray-700">
              Status
            </label>
            <div class="mt-1">
              <select
                id="status"
                name="status"
                bind:value={productData.status}
                class="block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
              >
                <option value="Draft">Draft</option>
                <option value="Active">Active</option>
              </select>
            </div>
          </div>
          
          <div class="sm:col-span-3">
            <label for="price" class="block text-sm font-medium text-gray-700">
              Price
            </label>
            <div class="mt-1 relative rounded-md shadow-sm">
              <div class="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3">
                <span class="text-gray-500 sm:text-sm">$</span>
              </div>
              <input
                type="text"
                name="price"
                id="price"
                bind:value={productData.price}
                class="block w-full rounded-md border-gray-300 pl-7 pr-12 focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                placeholder="0.00"
              />
              {#if formErrors.price}
                <p class="mt-2 text-sm text-red-600">{formErrors.price}</p>
              {/if}
            </div>
          </div>
          
          <div class="sm:col-span-3">
            <label for="stock" class="block text-sm font-medium text-gray-700">
              Stock
            </label>
            <div class="mt-1">
              <input
                type="text"
                name="stock"
                id="stock"
                bind:value={productData.stock}
                class="block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                placeholder="0"
              />
              {#if formErrors.stock}
                <p class="mt-2 text-sm text-red-600">{formErrors.stock}</p>
              {/if}
            </div>
          </div>
          
          <div class="sm:col-span-6">
            <label for="description" class="block text-sm font-medium text-gray-700">
              Description
            </label>
            <div class="mt-1">
              <textarea
                id="description"
                name="description"
                rows="4"
                bind:value={productData.description}
                class="block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
              ></textarea>
            </div>
          </div>
          
          <div class="sm:col-span-6">
            <label class="block text-sm font-medium text-gray-700">
              Product Images
            </label>
            <div class="mt-1 flex justify-center px-6 pt-5 pb-6 border-2 border-gray-300 border-dashed rounded-md">
              <div class="space-y-1 text-center">
                <svg class="mx-auto h-12 w-12 text-gray-400" stroke="currentColor" fill="none" viewBox="0 0 48 48" aria-hidden="true">
                  <path d="M28 8H12a4 4 0 00-4 4v20m32-12v8m0 0v8a4 4 0 01-4 4H12a4 4 0 01-4-4v-4m32-4l-3.172-3.172a4 4 0 00-5.656 0L28 28M8 32l9.172-9.172a4 4 0 015.656 0L28 28m0 0l4 4m4-24h8m-4-4v8m-12 4h.02" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" />
                </svg>
                <div class="flex text-sm text-gray-600">
                  <label for="file-upload" class="relative cursor-pointer bg-white rounded-md font-medium text-indigo-600 hover:text-indigo-500 focus-within:outline-none focus-within:ring-2 focus-within:ring-offset-2 focus-within:ring-indigo-500">
                    <span>Upload a file</span>
                    <input 
                      id="file-upload" 
                      name="file-upload" 
                      type="file" 
                      accept="image/*"
                      on:change={handleImageUpload}
                      class="sr-only" 
                    />
                  </label>
                  <p class="pl-1">or drag and drop</p>
                </div>
                <p class="text-xs text-gray-500">
                  PNG, JPG, GIF up to 10MB
                </p>
              </div>
            </div>
            
            {#if productData.images.length > 0}
              <div class="mt-4 grid grid-cols-3 gap-4">
                {#each productData.images as image, index}
                  <div class="relative">
                    <img src={image} alt="Product" class="h-24 w-24 object-cover rounded-md" />
                    <button
                      type="button"
                      on:click={() => removeImage(index)}
                      class="absolute top-0 right-0 -mt-2 -mr-2 bg-red-500 text-white rounded-full p-1 hover:bg-red-600 focus:outline-none"
                    >
                      <svg class="h-4 w-4" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
                      </svg>
                    </button>
                  </div>
                {/each}
              </div>
            {/if}
          </div>
        </div>
      </div>
    </div>
    
    <div class="pt-5">
      <div class="flex justify-end">
        <a
          href="/admin/products"
          class="rounded-md border border-gray-300 bg-white py-2 px-4 text-sm font-medium text-gray-700 shadow-sm hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2"
        >
          Cancel
        </a>
        <button
          type="submit"
          disabled={isSubmitting}
          class="ml-3 inline-flex justify-center rounded-md border border-transparent bg-indigo-600 py-2 px-4 text-sm font-medium text-white shadow-sm hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 disabled:opacity-75"
        >
          {isSubmitting ? 'Saving...' : 'Save Product'}
        </button>
      </div>
    </div>
  </form>
</div>