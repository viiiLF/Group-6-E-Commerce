<script lang="ts">
	import { goto } from '$app/navigation';
	import { onMount, onDestroy } from 'svelte';

	const userLogin = async () => {
		await goto('api/user/login/');
	};

	const models = ['src/img/model1.jpg', 'src/img/model2.jpg', 'src/img/model3.jpg'];
	const images = ['src/img/item1.jpg', 'src/img/item2.jpg', 'src/img/item3.png'];

	let currentIndex = 0;
	let autoSlideInterval: number;

	const slideTo = (index: number) => {
		currentIndex = index;
		resetAutoSlide();
	};

	const nextSlide = () => {
		currentIndex = (currentIndex + 1) % images.length;
	};

	const startAutoSlide = () => {
		autoSlideInterval = setInterval(nextSlide, 5000);
	};

	const resetAutoSlide = () => {
		clearInterval(autoSlideInterval);
		startAutoSlide();
	};

	const scrollToSection = (id: string) => {
		const element = document.getElementById(id);
		if (element) {
			element.scrollIntoView({ behavior: 'smooth' });
		}
	};

	onMount(() => {
		startAutoSlide();
	});

	onDestroy(() => {
		clearInterval(autoSlideInterval);
	});
</script>

<main>
	<nav
		class="fixed z-30 flex h-[50px] w-[100%] items-center justify-end justify-items-center rounded-sm bg-green-400 p-[20px]"
	>
		<ul class="flex list-none flex-row gap-[20px] text-[20px] font-bold">
			<li
				class="cursor-pointer rounded-[6px] p-[10px] hover:bg-purple-100 active:scale-[0.9] active:bg-red-200"
			>
				<a on:click|preventDefault={() => scrollToSection('home')} href="/Home">Home</a>
			</li>
			<li
				class="cursor-pointer rounded-[6px] p-[10px] hover:bg-purple-100 active:scale-[0.9] active:bg-red-200"
			>
				<a on:click|preventDefault={() => scrollToSection('about')} href="#about">About</a>
			</li>
			<li
				class="cursor-pointer rounded-[6px] p-[10px] hover:bg-purple-100 active:scale-[0.9] active:bg-red-200"
			>
				<a on:click|preventDefault={() => scrollToSection('help')} href="#help">Help</a>
			</li>
			
		</ul>
	</nav>

	<section
		id="home"
		class="m-[0] flex-wrap bg-[url('src/img/background.jpg')] bg-cover bg-fixed p-[0] pt-[50px]"
	>
		<h2 class="text-stroke font-leckerli absolute mt-[120px] ml-[200px] text-[35px]">
			Discover Your Style, <br /> Shop the Latest Trends Effortlessly.
		</h2>
		<h2 class="text-stroke font-lemon absolute mt-[740px] ml-[1250px] text-[25px] font-bold">
			Upgrade Your Wardrobe with<br /> Just One Click!
		</h2>
		<h2 class="text-stroke font-lemon absolute mt-[370px] ml-[820px] text-[25px]">
			Find the Perfect Look
		</h2>
		<h2 class="text-stroke font-lemon absolute mt-[550px] ml-[820px] text-[25px]">
			for Every Occasion.
		</h2>

		<div class="grid h-[100vh] flex-wrap items-center justify-center">
			<div class="justify-space-evenly flex gap-[20px]">
				<div
					class="relative h-[500px] w-[500px] items-center justify-center rounded-[24px] bg-white/30 p-10 backdrop-invert backdrop-opacity-10"
				>
					<div class="absolute h-[415px] w-[415px] overflow-hidden rounded-[8px]">
						<div
							class="flex transition duration-2000 ease-in-out"
							style={`transform: translateX(-${currentIndex * 100}%);`}
						>
							{#each models as image, index}
								<div class="min-w-full">
									<img
										src={image}
										class="h-[415px] w-full rounded-[8px] object-cover"
										alt={`model${index + 1}`}
									/>
								</div>
							{/each}
						</div>
					</div>

					<div class="absolute bottom-4 left-1/2 z-10 flex -translate-x-1/2 transform gap-[20px]">
						{#each models as _, index}
							<input
								type="radio"
								name="carousel-radio-models"
								class="h-4 w-4 border-[1px] border-black bg-white hover:bg-amber-200"
								checked={currentIndex === index}
								on:click={() => slideTo(index)}
							/>
						{/each}
					</div>
				</div>

				<div class="relative flex h-[500px] w-[500px] items-center justify-center rounded-[8px]">
					<button
						class="w-[200px] cursor-pointer rounded-[30px] border-[1px] bg-green-200 p-[10px] text-[25px] hover:bg-amber-50 active:scale-[0.9] active:bg-red-200"
						on:click={userLogin}
					>
						GET STARTED
					</button>
				</div>

				<div
					class="relative h-[500px] w-[500px] items-center justify-center rounded-[24px] bg-white/30 p-10 backdrop-invert backdrop-opacity-10"
				>
					<div class="absolute h-[415px] w-[415px] overflow-hidden rounded-[8px]">
						<div
							class="flex transition duration-1000 ease-in-out"
							style={`transform: translateX(-${currentIndex * 100}%);`}
						>
							{#each images as image, index}
								<div class="min-w-full">
									<img
										src={image}
										class="h-[415px] w-full rounded-[8px] object-cover"
										alt={`item${index + 1}`}
									/>
								</div>
							{/each}
						</div>
					</div>

					<div class="absolute bottom-4 left-1/2 z-10 flex -translate-x-1/2 transform gap-[20px]">
						{#each images as _, index}
							<input
								type="radio"
								name="carousel-radio-items"
								class="h-4 w-4 border-[1px] border-black bg-white hover:bg-amber-200"
								checked={currentIndex === index}
								on:click={() => slideTo(index)}
							/>
						{/each}
					</div>
				</div>
			</div>
		</div>
	</section>

	<section id="about" class="m-0 flex h-[100vh] w-auto flex-col gap-[20px] p-[50px]">
		<div class="w-auto rounded-3xl bg-white/30 p-10 backdrop-invert backdrop-opacity-10">
			<h1 class="text-center font-sans text-[40px] font-bold">Introduction</h1>
			<p class="text-center font-sans text-[30px]">
				My E-Commerce offers a comprehensive store that provides premium products at remarkable
				prices.<br />
			</p>
			<br />
			<p class="mt-[-20px] text-justify font-sans text-[30px]">
				The website offers consumers a smooth online shopping platform through its diverse product
				selection in addition to its secure payment options as well as its quick shipping. Our shop
				provides every item you need including fashion products and electronics as well as essential
				needs. Experience seamless shopping through double assurance together with convenient
				service right now.
			</p>
		</div>
		<div class="w-auto rounded-3xl bg-white/30 p-10 backdrop-invert backdrop-opacity-10">
			<h1 class="text-center font-sans text-[40px] font-bold">About</h1>
			<p class="mt-[10px] text-center font-sans text-[30px]">
				My E-Commerce operates with a deep commitment to provide superior shopping services to our
				customers.<br />
			</p>
			<p class="mt-[10px] text-justify font-sans text-[30px]">
				Our system provides a link between purchasers and reliable suppliers who offer premium
				products. The fundamental values of our business include accessible prices with superior
				products and exceptional service for our customers. Our solution integrates user-friendly
				functionality and customer satisfaction focus to develop safe and convenient online shopping
				for all people.
			</p>
		</div>
	</section>

	<section id="help" class="h-[100vh] w-auto p-[50px]">
		<div class="flex flex-col gap-[30px]">
			<div class="w-auto rounded-3xl bg-white/30 p-10 backdrop-invert backdrop-opacity-10">
				<h1 class="text-center font-sans text-[40px] font-bold">Help & Support</h1>
				<p class="mt-[10px] text-justify font-sans text-[30px]">
					Need assistance? We're here to help! Whether you have questions about your order, payment
					options, or product availability, our support team is ready to assist you.
				</p>
			</div>
			<div class="flex flex-row gap-10">
				<div class="w-fit rounded-3xl bg-white/30 p-10 backdrop-invert backdrop-opacity-10">
					<h1 class="text-center font-sans text-[40px] font-bold">How to Reach Us:</h1>
				</div>
				<div class="w-fit rounded-3xl bg-white/30 p-10 backdrop-invert backdrop-opacity-10">
					<h1 class="text-center font-sans text-[35px] font-bold">
						For frequently asked questions, check out our <a
							href="/Home/faq"
							class="underline hover:text-blue-500">FAQ</a
						>
					</h1>
				</div> 
			</div>
			<div class="flex flex-row flex-wrap gap-15">
				<div
					class="h-[400px] w-[400px] flex-wrap rounded-3xl bg-white/30 p-10 backdrop-invert backdrop-opacity-10 hover:bg-blue-200"
				>
					<i class="fa-brands fa-facebook ml-[130px] text-[70px]"></i>
					<hr class="mt-[10px] rounded-[12px] border-[2px] border-black" />

					<ul class="mt-[20px] flex flex-col gap-5 no-underline decoration-0">
						<ol class="font-sans text-[20px] hover:text-blue-600">
							<a href="https://www.facebook.com/jayjay.eviota">Jayjay Eviota</a>
						</ol>
						<ol class="font-sans text-[20px] hover:text-blue-600">
							<a href="https://www.facebook.com/profile.php?id=100093636786944">Owen Genon</a>
						</ol>
						<ol class="font-sans text-[20px] hover:text-blue-600">
							<a href="https://www.facebook.com/Symooonnn">Rommel Christian</a>
						</ol>
						
					</ul>
				</div>
				<div
					class="h-[400px] w-[400px] rounded-3xl bg-white/30 p-10 backdrop-invert backdrop-opacity-10 hover:bg-blue-200"
				>
					<i class="fa-brands fa-instagram ml-[130px] text-[70px]"></i>
					<hr class="mt-[10px] rounded-[12px] border-[2px] border-black" />

					<ul class="mt-[20px] flex flex-col gap-5 no-underline decoration-0">
						<ol class="font-sans text-[20px] hover:text-blue-600">
							<a href="https://www.facebook.com/jayjay.eviota">Jayjay Eviota</a>
						</ol>
						<ol class="font-sans text-[20px] hover:text-blue-600">
							<a href="https://www.facebook.com/profile.php?id=100093636786944">Owen Genon</a>
						</ol>
						<ol class="font-sans text-[20px] hover:text-blue-600">
							<a href="https://www.facebook.com/Symooonnn">Rommel Christian</a>
						</ol>
						
					</ul>
				</div>
				<div
					class="h-[400px] w-[400px] rounded-3xl bg-white/30 p-10 backdrop-invert backdrop-opacity-10 hover:bg-blue-200"
				>
					<i class="fa-brands fa-telegram ml-[130px] text-[70px]"></i>
					<hr class="mt-[10px] rounded-[12px] border-[2px] border-black" />

					<ul class="mt-[20px] flex flex-col gap-5 no-underline decoration-0">
						<ol class="font-sans text-[20px] hover:text-blue-600">
							<a href="https://www.facebook.com/jayjay.eviota">Jayjay Eviota</a>
						</ol>
						<ol class="font-sans text-[20px] hover:text-blue-600">
							<a href="https://www.facebook.com/profile.php?id=100093636786944">Owen Genon</a>
						</ol>
						<ol class="font-sans text-[20px] hover:text-blue-600">
							<a href="https://www.facebook.com/Symooonnn">Rommel Christian</a>
						</ol>
					
					</ul>
				</div>
				<div
					class="h-[400px] w-[400px] rounded-3xl bg-white/30 p-10 backdrop-invert backdrop-opacity-10 hover:bg-blue-200"
				>
					<i class="fa-brands fa-github ml-[130px] text-[70px]"></i>
					<hr class="mt-[10px] rounded-[12px] border-[2px] border-black" />

					<ul class="mt-[20px] flex flex-col gap-5 no-underline decoration-0">
						<ol class="font-sans text-[20px] hover:text-blue-600">
							<a href="https://www.facebook.com/jayjay.eviota">Jayjay Eviota</a>
						</ol>
						<ol class="font-sans text-[20px] hover:text-blue-600">
							<a href="https://www.facebook.com/profile.php?id=100093636786944">Owen Genon</a>
						</ol>
						<ol class="font-sans text-[20px] hover:text-blue-600">
							<a href="https://www.facebook.com/Symooonnn">Rommel Christian</a>
						</ol>
						
					</ul>
				</div>
			</div>
		</div>
	</section>
	<footer class="bg-green-400 p-6 text-center">
		<div class="container mx-auto">
			<h3 class="font-sans text-[18px] font-bold">My E-Commerce - GROUP 6</h3>
			<p class="mt-2 font-sans text-[14px]">© 2025 All Rights Reserved</p>
		</div>
	</footer>
</main>

<style>
	:global(html) {
		scroll-behavior: smooth;
	}

	.text-stroke {
		text-shadow:
			-1px -1px 0 #fff,
			1px -1px 0 #fff,
			-1px 1px 0 #fff,
			1px 1px 0 #fff;
	}

	section {
		scroll-margin-top: 50px;
	}
</style>
