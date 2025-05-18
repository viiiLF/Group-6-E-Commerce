import { json } from '@sveltejs/kit';
import type { RequestHandler } from './$types';
import { createClient } from '@supabase/supabase-js';

const supabaseUrl = 'https://fupdftjxvjckscfwpnms.supabase.co';
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImZ1cGRmdGp4dmpja3NjZndwbm1zIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDczNzYyMjAsImV4cCI6MjA2Mjk1MjIyMH0.M4y0Ri_bhxmFSnoQmrQ77mE_kBowksYGD1_uRExoRsM';
const supabase = createClient(supabaseUrl, supabaseKey);

export const POST: RequestHandler = async ({ request, cookies }) => {
  try {
    const data = await request.json();
    const { username, password } = data;
    
    console.log('Login attempt for user:', username);
    
    const { data: user, error } = await supabase
      .from('users')
      .select('*')
      .eq('username', username)
      .single();
    
    if (error || !user) {
      console.error('User lookup error:', error);
      return json({
        success: false,
        message: 'Invalid username or password'
      }, { status: 401 });
    }
    
    console.log('User found:', user.username, 'Role:', user.role);
    
    // Create simpler token for now (in production, use proper JWT)
    const token = `${user.id}-${Date.now()}`;
    
    // Set cookies that will be accessible on the server side
    cookies.set('userToken', token, {
      path: '/',
      httpOnly: true,
      sameSite: 'strict',
      secure: process.env.NODE_ENV === 'production',
      maxAge: 60 * 60 * 24 // 1 day
    });
    
    cookies.set('userRole', user.role || 'user', {
      path: '/',
      httpOnly: true,
      sameSite: 'strict',
      secure: process.env.NODE_ENV === 'production',
      maxAge: 60 * 60 * 24 // 1 day
    });
    
    // Determine redirect based on role
    const redirectUrl = user.role === 'admin' ? '/admin' : '/shop';
    
    return json({
      success: true,
      message: 'Login successful',
      token: token, // Also return as JSON for frontend storage if needed
      role: user.role || 'user',
      redirectUrl
    });
    
  } catch (error) {
    console.error('Login error:', error);
    return json({
      success: false,
      message: 'Server error during login'
    }, { status: 500 });
  }
};