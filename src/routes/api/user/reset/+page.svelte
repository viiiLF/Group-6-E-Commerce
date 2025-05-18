<script lang="ts">
  import { goto } from '$app/navigation';
  import { enhance } from '$app/forms';
  let error = '';
  let success = '';
  let isLoading = false;

  const loginPage = async () => {
    await goto('login/');
  };

  const handleForgotPassword = async ({ formData }) => {
    isLoading = true;
    error = '';
    success = '';

    const email = formData.get('email');

    try {
      const response = await fetch('/api/auth/forgot-password', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email })
      });

      const data = await response.json();

      if (!response.ok) {
        error = data.message || 'Failed to send reset email';
        isLoading = false;
        return { error };
      }

      success = 'Password reset email sent! Check your inbox.';
      isLoading = false;
    } catch (err) {
      error = 'Network error. Please try again.';
      isLoading = false;
      return { error };
    }
  };
</script>

<section class="h-screen w-screen flex items-center justify-center">
  <form
    class="w-[500px] border-1 border-black p-10 flex flex-col gap-2 shadow-xl rounded-3xl"
    method="POST"
    use:enhance={handleForgotPassword}
  >
    <h1 class="text-center font-bold font-sans text-[20px]">Forgot Password</h1>
    {#if error}
      <div class="mt-4 rounded bg-red-100 p-2 text-red-700">{error}</div>
    {/if}
    {#if success}
      <div class="mt-4 rounded bg-green-100 p-2 text-green-700">{success}</div>
    {/if}
    <label for="email" class="font-sans font-semibold">Email</label>
    <input
      class="rounded-[6px] hover:bg-amber-100"
      type="email"
      name="email"
      required
    />
    <div class="self-center flex gap-2">
      <button
        type="submit"
        disabled={isLoading}
        class="rounded-[8px] text-[15px] font-sans p-2 border-1 border-black w-[110px] cursor-pointer hover:bg-green-100 active:scale-[0.9] disabled:opacity-50"
      >
        {isLoading ? 'Sending...' : 'Send Reset Link'}
      </button>
      <button
        type="button"
        on:click={loginPage}
        class="rounded-[8px] text-[15px] font-sans p-2 border-1 border-black w-[110px] cursor-pointer hover:bg-green-100 active:scale-[0.9]"
      >
        Back
      </button>
    </div>
  </form>
</section>
