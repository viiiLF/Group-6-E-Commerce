import { describe, it, expect } from 'vitest';
import { supabase } from '../../src/lib/supabaseClient';

describe('Auth API', () => {
  it('should login successfully', async () => {
    const { data, error } = await supabase.auth.signInWithPassword({
      email: 'test@example.com',
      password: 'password123'
    });
    expect(error).toBeNull();
    expect(data.user).toBeDefined();
  });
});