<script lang="ts">
	import { goto } from '$app/navigation';

	const returnPage = async () => {
		await goto('/Home');
	};
</script>

<section
	class="flex items-center justify-center bg-gradient-to-r from-green-500 to-blue-500"
	id="form"
>
	<form
		class="w-[700px] rounded-[8px] border-[1px] border-black bg-gradient-to-r from-cyan-500 to-blue-500 p-10"
	>
		<h1 class="mb-[20px] text-center font-sans font-bold">Frequently Asked Questions (FAQ)</h1>
		<hr class="mb-[30px] rounded-[8px] border-[1px] border-solid border-black" />
		<div class="flex flex-col gap-10">
			<div class="w-fit rounded-[8px] border-[1px] border-black bg-white p-10">
				<span class="font-sans text-[20px]">1. How do I place an order?</span>
			</div>
			<div class="w-fit self-end rounded-[8px] border-[1px] border-black bg-white p-10">
				<span class="text-justify font-sans text-[20px]"
					>To place an order, simply browse our products, add<br /> your desired items to the cart,
					and proceed to checkout. <br />Follow the steps to enter your shipping details and<br /> complete
					the payment.</span
				>
			</div>

			<div class="w-fit rounded-[8px] border-[1px] border-black bg-white p-10">
				<span class="font-sans text-[20px]">2. What payment methods do you accept?</span>
			</div>

			<div class="w-fit self-end rounded-[8px] border-[1px] border-black bg-white p-10">
				<span class="text-justify font-sans text-[20px]"
					>We accept a variety of payment methods, including:<br />
					1. PayPal<br />
					2. G-Cash<br />
					3. Maya</span
				>
			</div>

			<div class="w-fit rounded-[8px] border-[1px] border-black bg-white p-10">
				<span class="font-sans text-[20px]">3. How can I track my order?</span>
			</div>

			<div class="w-fit self-end rounded-[8px] border-[1px] border-black bg-white p-10">
				<span class="text-justify font-sans text-[20px]"
					>Once your order is shipped, you will receive a tracking <br /> number via email. You can
					use this number to track<br /> your order on our website or the courier’s tracking page.</span
				>
			</div>

			<div class="w-fit rounded-[8px] border-[1px] border-black bg-white p-10">
				<span class="font-sans text-[20px]">4. Can I cancel my order?</span>
			</div>

			<div class="w-fit self-end rounded-[8px] border-[1px] border-black bg-white p-10">
				<span class="text-justify font-sans text-[20px]"
					>Yes, you can cancel your order within 24 hours<br /> of purchase before it is shipped.
					Once shipped, <br /> cancellations are not allowed, but you can<br /> request a return after
					receiving the item.</span
				>
			</div>

			<div class="w-fit rounded-[8px] border-[1px] border-black bg-white p-10">
				<span class="font-sans text-[20px]">5. Do you offer discounts or promotions?</span>
			</div>

			<div class="w-fit self-end rounded-[8px] border-[1px] border-black bg-white p-10">
				<span class="text-justify font-sans text-[20px]"
					>Yes! We regularly offer discounts, promotions,<br /> and seasonal sales. Subscribe to our
					newsletter or<br /> follow us on social media to stay updated.</span
				>
			</div>
			<button
				class="w-[20%] cursor-pointer self-center rounded-[5px] border-[1px] border-black bg-green-100 p-[-5px] font-sans text-[20px] hover:bg-amber-100 active:scale-[0.9]"
				on:click={returnPage}>Back</button
			>
			<footer>
				<h3 class="mt-[10px] text-center font-sans text-[15px]">FAQ - GROUP 6</h3>
			</footer>
		</div>
	</form>
</section>
