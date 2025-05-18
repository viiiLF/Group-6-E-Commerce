import type { RequestHandler } from '@sveltejs/kit';


let products: Product[] = [
 
  { id: 1, name: 'T-Shirt', price: 19.99, category: 'Clothing', image: 'https://example.com/tshirt.jpg', description: 'Comfortable cotton t-shirt' }
];

export const GET: RequestHandler = async () => {
  return new Response(JSON.stringify(products), { status: 200 });
};

export const POST: RequestHandler = async ({ request }) => {
  const product = await request.json();
  product.id = products.length + 1;
  products.push(product);
  return new Response(JSON.stringify(product), { status: 201 });
};

export const PUT: RequestHandler = async ({ request, params }) => {
  const product = await request.json();
  const index = products.findIndex(p => p.id === Number(params.id));
  if (index !== -1) {
    products[index] = { ...product, id: Number(params.id) };
    return new Response(JSON.stringify(products[index]), { status: 200 });
  }
  return new Response('Product not found', { status: 404 });
};

export const DELETE: RequestHandler = async ({ params }) => {
  products = products.filter(p => p.id !== Number(params.id));
  return new Response(null, { status: 204 });
};