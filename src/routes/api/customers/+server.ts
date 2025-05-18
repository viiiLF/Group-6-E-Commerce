import type { RequestHandler } from '@sveltejs/kit';

const customers = [
  { id: 1, name: 'Lazaro, Sherlita', email: 'sherlita@example.com', totalOrders: 5, totalSpent: 789.45 },
  { id: 2, name: 'Owen, Genon', email: 'OwenGenon@example.com', totalOrders: 3, totalSpent: 456.20 }
];

export const GET: RequestHandler = async () => {
  return new Response(JSON.stringify(customers), { status: 200 });
};