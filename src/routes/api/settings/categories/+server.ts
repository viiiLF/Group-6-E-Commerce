import type { RequestHandler } from '@sveltejs/kit';

// Simulated in-memory store (replace with database in production)
let categories: string[] = ['Clothing', 'Footwear', 'Accessories'];

export const POST: RequestHandler = async ({ request }) => {
  const { category } = await request.json();
  if (!category || typeof category !== 'string' || !category.trim()) {
    return new Response(JSON.stringify({ error: 'Category name is required' }), {
      status: 400,
      headers: { 'Content-Type': 'application/json' }
    });
  }
  if (categories.includes(category)) {
    return new Response(JSON.stringify({ error: 'Category already exists' }), {
      status: 409,
      headers: { 'Content-Type': 'application/json' }
    });
  }
  categories = [...categories, category];
  return new Response(JSON.stringify({ category }), {
    status: 201,
    headers: { 'Content-Type': 'application/json' }
  });
};

export const DELETE: RequestHandler = async ({ url }) => {
  const category = url.searchParams.get('category');
  if (!category || typeof category !== 'string') {
    return new Response(JSON.stringify({ error: 'Category name is required' }), {
      status: 400,
      headers: { 'Content-Type': 'application/json' }
    });
  }
  if (!categories.includes(category)) {
    return new Response(JSON.stringify({ error: 'Category not found' }), {
      status: 404,
      headers: { 'Content-Type': 'application/json' }
    });
  }
  categories = categories.filter(c => c !== category);
  return new Response(JSON.stringify({ message: 'Category deleted' }), {
    status: 200,
    headers: { 'Content-Type': 'application/json' }
  });
};