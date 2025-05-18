import type { RequestHandler } from '@sveltejs/kit';


let products: { id: string; name: string; price: number; description: string; image: string; category: string }[] = [];

export const GET: RequestHandler = async () => {
  return new Response(JSON.stringify(products), {
    status: 200,
    headers: { 'Content-Type': 'application/json' }
  });
};

export const POST: RequestHandler = async ({ request }) => {
  const newProduct = await request.json();
  newProduct.id = Date.now().toString();
  products = [...products, newProduct];
  return new Response(JSON.stringify(newProduct), {
    status: 201,
    headers: { 'Content-Type': 'application/json' }
  });
};