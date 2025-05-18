<script lang="ts">
  import { goto } from '$app/navigation';
  import { enhance } from '$app/forms';
  let error = '';
  let isLoading = false;
  let success = '';
  let username = '';
  let password = '';

  const registerUser = async () => {
    await goto('register/');
  };

  async function handleLogin(event) {
    event.preventDefault();
    
    isLoading = true;
    error = '';
    success = '';

    const payload = { username, password };
    console.log('Sending login request:', payload);

    try {
      // Updated API endpoint to match the server configuration
      const loginUrl = '/api/user/login';
      console.log('Fetching from URL:', loginUrl);
      
      const response = await fetch(loginUrl, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      });

      console.log('Fetch response status:', response.status);
      console.log('Fetch response ok:', response.ok);
      
      const contentType = response.headers.get('content-type');
      console.log('Response content type:', contentType);
      
      let data;
      
      if (contentType && contentType.includes('application/json')) {
        data = await response.json();
        console.log('Fetch response data:', data);
      } else {
        const text = await response.text();
        console.error('Non-JSON response:', text.substring(0, 200));
        throw new Error('Server returned an invalid response format');
      }

      if (!response.ok) {
        error = data.message || 'Login failed';
        console.log('Login error from server:', error);
        throw new Error(error);
      }

      // Save role information client-side for UI purposes
      if (data.role) localStorage.setItem('role', data.role);
      
      // Set success message with role-specific text
      const destination = data.role === 'admin' ? 'admin dashboard' : 'shop';
      success = `Login successful! Redirecting to ${destination}...`;
      
      isLoading = false;

      // The server has already set the auth cookies
      console.log('Login successful, received redirect URL:', data.redirectUrl);
      
      // Use the redirectUrl from the server
      const redirectTo = data.redirectUrl;
      
      // Hard redirect to the new location
      setTimeout(() => {
        window.location.href = redirectTo;
      }, 1000);
      
    } catch (err) {
      console.error('Fetch error details:', err);
      error = err.message || 'Network error. Please try again.';
      isLoading = false;
    }
  }
</script>

<section class="m-0 flex h-screen w-screen items-center justify-center p-0">
  <form
    class="w-[450px] rounded-[5px] border-[1px] border-black p-5 font-sans shadow-2xl"
    on:submit={handleLogin}
  >
    <h1 class="text-center text-[35px] font-bold">Login</h1>
    <hr class="mt-[15px] border-[1px] border-black" />
    {#if error}
      <div class="mt-4 rounded bg-red-100 p-2 text-red-700">{error}</div>
    {/if}
    {#if success}
      <div class="mt-4 rounded bg-green-100 p-2 text-green-700">{success}</div>
    {/if}
    <div class="mt-[10px] flex flex-col gap-1 font-sans">
      <label for="userName" class="text-[15px] font-semibold">Username</label>
      <input
        class="rounded-[6px] hover:bg-amber-100"
        type="text"
        id="userName"
        name="userName"
        placeholder="Username"
        required
        bind:value={username} 
      />
      <label for="passWord" class="text-[15px] font-semibold">Password</label>
      <input
        class="rounded-[6px] hover:bg-amber-100"
        type="password"
        id="passWord"
        name="passWord"
        placeholder="Password"
        required
        bind:value={password} 
      />
    </div>
    <a href="reset" class="font-semibold hover:text-blue-700 hover:underline">
      Forgot Password?
    </a>
    <div class="mt-[10px] flex flex-col gap-2">
      <button
        type="submit"
        disabled={isLoading}
        class="cursor-pointer rounded-[5px] border-[1px] border-black font-semibold hover:bg-amber-100 disabled:opacity-50"
      >
        {isLoading ? 'Logging in...' : 'Login'}
      </button>
      <span class="text-center text-[15px] font-bold">OR</span>
      <button
        type="button"
        on:click={registerUser}
        class="cursor-pointer rounded-[5px] border-[1px] border-black font-semibold hover:bg-amber-100"
      >
        Register
      </button>
    </div>
  </form>
</section>