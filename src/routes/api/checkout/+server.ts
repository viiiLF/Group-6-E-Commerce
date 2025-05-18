import type { RequestHandler } from '@sveltejs/kit';

export const POST: RequestHandler = async ({ request }) => {
  const { name, address, paymentMethod, total } = await request.json();
  if (!name || !address || !paymentMethod || !total) {
    return new Response(JSON.stringify({ error: 'Missing required fields' }), {
      status: 400,
      headers: { 'Content-Type': 'application/json' }
    });
  }

  await new Promise(resolve => setTimeout(resolve, 1000)); 
  return new Response(JSON.stringify({ success: true, message: `Payment of ₱${total} processed with ${paymentMethod}` }), {
    status: 200,
    headers: { 'Content-Type': 'application/json' }
  });
};