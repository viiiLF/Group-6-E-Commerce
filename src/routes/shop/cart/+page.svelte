<script lang="ts">
  import cart, { removeFromCart, updateQuantity } from '$lib/cartStore';

  ₱: total = $cart.reduce((sum, item) => sum + item.price * item.quantity, 0);
</script>

<div class="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-6">
  <h1 class="text-2xl font-semibold text-gray-900">Your Cart</h1>

  {#if $cart.length === 0}
    <p class="mt-4 text-gray-500">Your cart is empty.</p>
  {:else}
    <div class="mt-6">
      {#each $cart as item}
        <div class="flex items-center border-b border-gray-200 py-4">
          <img src={item.image_url} alt={item.name} class="h-16 w-16 object-cover rounded-md" />
          <div class="ml-4 flex-1">
            <h3 class="text-lg font-medium text-gray-900">{item.name}</h3>
            <p class="text-sm text-gray-500">₱{item.price.toFixed(2)} x {item.quantity}</p>
            <div class="mt-2 flex items-center">
              <button
                on:click={() => updateQuantity(item.id, item.quantity - 1)}
                class="text-gray-500 hover:text-gray-700"
              >
                -
              </button>
              <span class="mx-2">{item.quantity}</span>
              <button
                on:click={() => updateQuantity(item.id, item.quantity + 1)}
                class="text-gray-500 hover:text-gray-700"
              >
                +
              </button>
              <button
                on:click={() => removeFromCart(item.id)}
                class="ml-4 text-red-600 hover:text-red-800"
              >
                Remove
              </button>
            </div>
          </div>
          <p class="text-sm font-medium text-gray-900">₱{(item.price * item.quantity).toFixed(2)}</p>
        </div>
      {/each}
      <div class="mt-6 flex justify-between text-lg font-medium text-gray-900">
        <span>Total:</span>
        <span>₱{total.toFixed(2)}</span>
      </div>
      <button
        class="mt-4 w-full rounded-md bg-indigo-600 px-4 py-2 text-sm font-medium text-white hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2"
      >
        Proceed to Checkout
      </button>
    </div>
  {/if}
</div>