import type { RequestHandler } from '@sveltejs/kit';

// Simulated in-memory store (replace with database in production)
let categories: string[] = ['Clothing', 'Footwear', 'Accessories'];

export const GET: RequestHandler = async () => {
  return new Response(JSON.stringify({ categories }), {
    status: 200,
    headers: { 'Content-Type': 'application/json' }
  });
};