import type { RequestHandler } from '@sveltejs/kit';

const analyticsData: { totalSales: number; totalOrders: number; topProducts: { id: number; name: string; sales: number }[] } = {
  totalSales: 24598.75,
  totalOrders: 43,
  topProducts: [
    { id: 1, name: "T-Shirt", sales: 5000.00 },
    { id: 2, name: "Jeans", sales: 4500.50 },
    { id: 3, name: "Sneakers", sales: 3500.25 }
  ]
};

export const GET: RequestHandler = async () => {
  return new Response(JSON.stringify(analyticsData), {
    status: 200,
    headers: { 'Content-Type': 'application/json' }
  });
};