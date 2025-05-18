import type { RequestHandler } from '@sveltejs/kit';

let orders = [
  { id: 'ORD-001', customerName: 'John Brown', date: '2025-05-10', amount: '$149.99', status: 'Delivered' }
];

export const GET: RequestHandler = async () => {
  return new Response(JSON.stringify(orders), { status: 200 });
};

export const POST: RequestHandler = async ({ request }) => {
  const order = await request.json();
  order.id = `ORD-${orders.length + 1}`;
  orders.push(order);
  return new Response(JSON.stringify(order), { status: 201 });
};