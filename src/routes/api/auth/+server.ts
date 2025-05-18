import { createClient } from '@supabase/supabase-js';
import type { RequestHandler } from '@sveltejs/kit';
import jwt from 'jsonwebtoken';
import dotenv from 'dotenv';

dotenv.config();

console.log('Supabase URL loaded:', process.env.VITE_SUPABASE_URL ? 'Yes' : 'No');
console.log('Supabase Anon Key loaded:', process.env.VITE_SUPABASE_ANON_KEY ? 'Yes' : 'No');
console.log('JWT Secret loaded:', process.env.JWT_SECRET ? 'Yes' : 'No');

const supabase = createClient(
  process.env.VITE_SUPABASE_URL || 'https://fupdftjxvjckscfwpnms.supabase.co',
  process.env.VITE_SUPABASE_ANON_KEY || 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImZ1cGRmdGp4dmpja3NjZndwbm1zIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDczNzYyMjAsImV4cCI6MjA2Mjk1MjIyMH0.M4y0Ri_bhxmFSnoQmrQ77mE_kBowksYGD1_uRExoRsM'
);

const JWT_SECRET = process.env.JWT_SECRET || 'a1b2c3d4e5f6g7h8i9j0k1l2m3n4o5p6q7r8s9t0u1v2w3';

export const POST: RequestHandler = async ({ request, url }) => {
  console.log('Incoming request to:', url.pathname);

  let body;
  try {
    body = await request.json();
    console.log('Received request body:', body);
  } catch (err) {
    console.error('Error parsing request body:', err);
    return new Response(JSON.stringify({ message: 'Invalid request body' }), { status: 400 });
  }

  if (url.pathname.endsWith('/login')) {
    const { username, password } = body;

    if (!username || !password) {
      console.error('Missing required fields for login:', { username, password });
      return new Response(JSON.stringify({ message: 'Missing username or password' }), { status: 400 });
    }

    try {
      const { data, error } = await supabase.auth.signInWithPassword({
        email: username,
        password
      });

      if (error) {
        console.error('Supabase login error:', error.message, error.status);
        return new Response(JSON.stringify({ message: error.message }), { status: 400 });
      }

      const user = data.user;
      console.log('User logged in:', user.id, user.email);

      const { data: userData, error: fetchError } = await supabase
        .from('users')
        .select('role')
        .eq('id', user.id)
        .single();

      if (fetchError) {
        console.error('Error fetching user role:', fetchError.message);
        return new Response(JSON.stringify({ message: 'Error fetching user data' }), { status: 500 });
      }

      const role = userData.role || 'user';
      console.log('User role:', role);

      const token = jwt.sign({ id: user.id, role }, JWT_SECRET, { expiresIn: '1h' });
      console.log('Login successful, token generated:', token);

      return new Response(JSON.stringify({ token, role }), { status: 200 });
    } catch (err) {
      console.error('Login server error:', err);
      return new Response(JSON.stringify({ message: 'Server error' }), { status: 500 });
    }
  }

  if (url.pathname.endsWith('/register')) {
    const { username, email, password } = body;

    if (!username || !email || !password) {
      console.error('Missing required fields for register:', { username, email, password });
      return new Response(JSON.stringify({ message: 'Missing username, email, or password' }), { status: 400 });
    }

    try {
      const { data, error } = await supabase.auth.signUp({
        email,
        password,
        options: { data: { username } }
      });

      if (error) {
        console.error('Supabase signup error:', error.message, error.status);
        return new Response(JSON.stringify({ message: error.message }), { status: 400 });
      }

      console.log('User registered in auth.users:', data.user);
      return new Response(JSON.stringify({ id: data.user?.id, username }), { status: 201 });
    } catch (err) {
      console.error('Registration server error:', err);
      return new Response(JSON.stringify({ message: 'Server error' }), { status: 500 });
    }
  }

  console.log('Invalid endpoint accessed:', url.pathname);
  return new Response('Invalid endpoint', { status: 400 });
};