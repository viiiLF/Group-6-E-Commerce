import { redirect } from '@sveltejs/kit';
import type { LayoutServerLoad } from './$types';

export const load: LayoutServerLoad = async ({ cookies, url }) => {
 
  const role = cookies.get('userRole');
  const token = cookies.get('userToken');
  
  console.log('Admin layout server checking access. Role:', role, 'Token exists:', !!token);
  
 
  if (!token || role !== 'admin') {
    console.log('Access denied to admin. Redirecting to login.');
    
    throw redirect(302, '/');
  }
  
  console.log('Admin access granted.');
  
  return {
    user: {
      role: role
    }
  };
};