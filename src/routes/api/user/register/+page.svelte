<script lang="ts">
  import { goto } from '$app/navigation';

  const returnToLogin = async () => {
    await goto('login/');
  };
  let error = '';
  let success = '';
  let isLoading = false;

  async function handleRegister(event) {
    isLoading = true;
    error = '';
    success = '';

    const formData = new FormData(event.target);
    const username = formData.get('user');
    const email = formData.get('email');
    const password = formData.get('pass');
    const confirmPassword = formData.get('confirmPass');

    if (password !== confirmPassword) {
      error = 'Passwords do not match';
      isLoading = false;
      return;
    }

    if (password.length < 6) {
      error = 'Password must be at least 6 characters';
      isLoading = false;
      return;
    }

    const payload = { username, email, password };
    console.log('Sending registration request:', payload);

    try {
      const response = await fetch('/api/user/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      });

      console.log('Fetch response status:', response.status);
      console.log('Fetch response ok:', response.ok);

      const data = await response.json();
      console.log('Fetch response data:', data);

      if (!response.ok) {
        error = data.message || 'Registration failed';
        console.log('Registration error from server:', error);
        throw new Error(error);
      }

      success = 'Registration successful! Please check your email.';
      isLoading = false;

      setTimeout(() => goto('login/'), 2000);
    } catch (err) {
      console.error('Fetch error details:', err);
      error = err.message || 'Network error. Please try again.';
      isLoading = false;
    }
  }
</script>

<section class="m-0 flex h-screen w-screen items-center justify-center p-0">
  <form on:submit|preventDefault={handleRegister} class="w-[500px] border-1 border-black p-10 flex flex-col gap-2 shadow-xl rounded-3xl">
  <h1 class="text-center text-[35px] font-bold">Registration</h1>
  <hr class="mt-[15px] border-[1px] border-black mb-[]" />
  {#if error}<div class="text-red-500 mb-2">{error}</div>{/if}
  {#if success}<div class="text-green-500 mb-2">{success}</div>{/if}
  <div class="mb-2">
    <label class="text-center font-bold font-sans text-[20px]" for="user">Username</label>
    <input  class="w-[100%] rounded-[6px] hover:bg-amber-100" type="text" id="user" name="user" required>
  </div>
  <div class="mb-2">
    <label class="text-center font-bold font-sans text-[20px]" for="email">Email</label>
    <input class="w-[100%] rounded-[6px] hover:bg-amber-100" type="email" id="email" name="email"  required>
  </div>
  <div class="mb-2">
    <label class="text-center font-bold font-sans text-[20px]" for="pass">Password</label>
    <input  class=" w-[100%] rounded-[6px] hover:bg-amber-100" type="password" id="pass" name="pass"  required>
  </div>
  <div class="mb-2">
    <label class="text-center font-bold font-sans text-[20px]" for="confirmPass">Confirm Password</label>
    <input  class=" w-[100%] rounded-[6px] hover:bg-amber-100" type="password" id="confirmPass" name="confirmPass"  required>
  </div>
 <div>
   <button type="submit" disabled={isLoading} class="w-full p-2 bg-blue-500 text-white rounded hover:bg-blue-700">
    {isLoading ? 'Creating...' : 'Create'}
  </button>
  <button type="button" class="w-full p-2 bg-gray-500 text-white mt-2 rounded hover:bg-gray-700" on:click={returnToLogin}>
    Back
 </div>
</form>
</section>
