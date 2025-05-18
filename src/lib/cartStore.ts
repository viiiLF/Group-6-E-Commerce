import { writable } from 'svelte/store';

interface CartItem {
  id: string;
  name: string;
  price: number;
  quantity: number;
  image_url: string;
}

const cart = writable<CartItem[]>([]);

export function addToCart(product: { id: string; name: string; price: number; image_url: string }) {
  cart.update(items => {
    const existingItem = items.find(item => item.id === product.id);
    if (existingItem) {
      return items.map(item =>
        item.id === product.id ? { ...item, quantity: item.quantity + 1 } : item
      );
    }
    return [...items, { ...product, quantity: 1 }];
  });
}

export function removeFromCart(productId: string) {
  cart.update(items => items.filter(item => item.id !== productId));
}

export function updateQuantity(productId: string, quantity: number) {
  if (quantity <= 0) {
    removeFromCart(productId);
  } else {
    cart.update(items =>
      items.map(item => (item.id === productId ? { ...item, quantity } : item))
    );
  }
}

export default cart;