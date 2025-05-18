<script lang="ts">
  import { goto } from '$app/navigation';
  import { enhance } from '$app/forms';
  let error = '';
  let isLoading = false;

  const registerUser = async () => {
    await goto('/user/login/register');
  };

  const handleLogin = async ({ formData }) => {
    isLoading = true;
    error = '';

    try {
      const response = await fetch('/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          username: formData.get('userName'),
          password: formData.get('passWord')
        })
      });

      const data = await response.json();

      if (!response.ok) {
        error = data.message || 'Login failed';
        isLoading = false;
        return { error };
      }

      localStorage.setItem('token', data.token);

      if (data.role === 'admin') {
        await goto('/admin');
      } else {
        await goto('/shop');
      }
    } catch (err) {
      error = 'Network error. Please try again.';
      isLoading = false;
      return { error };
    }
  };
</script>

<section class="m-0 flex h-screen w-screen items-center justify-center p-0">
  <form
    class="w-[450px] rounded-[5px] border-[1px] border-black p-5 font-sans shadow-2xl"
    method="POST"
    use:enhance={handleLogin}
  >
    <h1 class="text-center text-[35px] font-bold">Login</h1>
    <hr class="mt-[15px] border-[1px] border-black" />
    {#if error}
      <div class="mt-4 rounded bg-red-100 p-2 text-red-700">{error}</div>
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
      />
      <label for="passWord" class="text-[15px] font-semibold">Password</label>
      <input
        class="rounded-[6px] hover:bg-amber-100"
        type="password"
        id="passWord"
        name="passWord"
        placeholder="Password"
        required
      />
    </div>
    <a href="/user/login/reset" class="font-semibold hover:text-blue-700 hover:underline">
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
