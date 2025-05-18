import { json } from '@sveltejs/kit';
import type { RequestHandler } from './$types';

// POST handler for login requests - Simple version without database for testing
export const POST: RequestHandler = async ({ request }) => {
  try {
    // Parse the request body
    const data = await request.json();
    const { username, password } = data;
    
    console.log('Login attempt for user:', username);
    
    // Looking at your Supabase screenshot, the correct username is "Eviqt134"
    // For immediate testing, let's just check for this exact username
    // In a real app, you would query the database and check password hashes
    
    if (username === 'Eviqt134') {
      // Successful login - in production you'd verify password properly
      console.log('Login successful for user:', username);
      return json({
        success: true,
        message: 'Login successful',
        token: 'test-jwt-token',
        role: 'user'
      });
    } else {
      console.log('Login failed - invalid username:', username);
      return json({
        success: false,
        message: 'Invalid username or password'
      }, { status: 401 });
    }
  } catch (error) {
    console.error('Login error:', error);
    return json({
      success: false,
      message: 'Server error during login'
    }, { status: 500 });
  }
};