import type { RequestHandler } from '@sveltejs/kit';

let categories = ['Clothing', 'Footwear', 'Accessories'];

export const GET: RequestHandler = async () => {
  return new Response(JSON.stringify({ categories }), { status: 200 });
};

export const POST: RequestHandler = async ({ request }) => {
  const { category } = await request.json();
  if (!categories.includes(category)) {
    categories.push(category);
    return new Response(JSON.stringify({ category }), { status: 201 });
  }
  return new Response('Category already exists', { status: 400 });
};

export const DELETE: RequestHandler = async ({ params }) => {
  categories = categories.filter(c => c !== params.category);
  return new Response(null, { status: 204 });
};