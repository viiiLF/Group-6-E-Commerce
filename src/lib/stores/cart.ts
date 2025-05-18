import { writable } from 'svelte/store';
import type { Product } from '../../routes/shop/+page.svelte';

interface CartItem {
  product: Product;
  quantity: number;
}

export const cart = writable<CartItem[]>([]);