'use client';

import React, { useState, useEffect, useRef } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { ShoppingBag, ChevronLeft, ChevronRight } from 'lucide-react';
import Link from 'next/link';
import {
	Dialog,
	DialogContent,
	DialogHeader,
	DialogTitle,
} from '@/components/ui/dialog';
import { motion, AnimatePresence } from 'framer-motion';
import Image from 'next/image';
import { Footer } from '@/components/Footer';
import Navbar from '@/components/Navbar';
import { useToast } from '@/components/ui/use-toast';

type HeroContent = {
	title: string;
	text: string;
	image: string;
};

type CustomerReview = {
	name: string;
	review: string;
	product: string;
	platform: string;
};

const heroContent: HeroContent[] = [
	{
		title: 'Embrace Your Beauty',
		text: 'Our swimwear celebrates every curve, empowering you to feel confident and radiant on the beach and beyond.',
		image: '/images/model1.jpg',
	},
	{
		title: 'Confidence in Every Stitch',
		text: "Amare designs are crafted with care, ensuring you look and feel amazing in swimwear that's as unique as you are.",
		image: '/images/model2.jpg',
	},
	{
		title: 'Celebrate YOU',
		text: 'From bold prints to classic styles, find the perfect swimwear to express your individuality and shine.',
		image: '/images/model3.jpg',
	},
];

const customerReviews: CustomerReview[] = [
	{
		name: '@Ayanda_M',
		review:
			"Absolutely in love with this swimsuit! The color pops beautifully on my skin and the fit is perfect for my curves. Can't wait to hit the beach!",
		product: 'Pink Sapphire Swimsuit',
		platform: 'Instagram',
	},
	{
		name: '@Lebo_Luxe',
		review:
			'This bikini is fire! The design is sleek, and I feel so confident in it. Perfect for those hot Cape Town summer days!',
		product: 'Pink Sapphire Bikini',
		platform: 'TikTok',
	},
	{
		name: '@Zama_Stylez',
		review:
			'The Maddison swimsuit gives me life! The quality is top-tier, and it hugs my body in all the right places. Got so many compliments at Clifton Beach!',
		product: 'Maddison Swimsuit',
		platform: 'Instagram',
	},
	{
		name: '@Thandi_Bae',
		review:
			"Obsessed with the Maddison Bikini! It's super comfortable and makes me feel like a goddess. Definitely my new go-to swimwear.",
		product: 'Maddison Bikini',
		platform: 'TikTok',
	},
	{
		name: '@Nonhle_G',
		review:
			'This bikini is so flattering and stylish! I love how the color pops in all my photos. Summer must-have for sure!',
		product: 'Pink Sapphire Bikini',
		platform: 'Instagram',
	},
];

const featuredProducts = [
	{
		name: 'Pink Sapphire Swimsuit',
		price: 650.0,
		image: '/products/ruby-swimsuit.jpg',
	},
	{
		name: 'Pink Sapphire Bikini',
		price: 600.0,
		image: '/products/ruby-bikini.jpg',
	},
	{
		name: 'Maddison Swimsuit',
		price: 650.0,
		image: '/products/maddison-swimsuit.jpg',
	},
	{
		name: 'Maddison Bikini',
		price: 600.0,
		image: '/products/maddison-bikini.jpg',
	},
];

const HomePage: React.FC = () => {
	const [email, setEmail] = useState('');
	const [isSubscribing, setIsSubscribing] = useState(false);
	const [currentHeroIndex, setCurrentHeroIndex] = useState(0);
	const [currentReviewIndex, setCurrentReviewIndex] = useState(0);
	const [isWelcomeModalOpen, setIsWelcomeModalOpen] = useState(false);
	const [imagesLoaded, setImagesLoaded] = useState(false);
	const { toast } = useToast();
	const videoRef = useRef<HTMLVideoElement>(null);

	useEffect(() => {
		const interval = setInterval(() => {
			setCurrentHeroIndex((prevIndex) => (prevIndex + 1) % heroContent.length);
		}, 7000);
		return () => clearInterval(interval);
	}, []);

	useEffect(() => {
		const interval = setInterval(() => {
			setCurrentReviewIndex(
				(prevIndex) => (prevIndex + 1) % customerReviews.length
			);
		}, 5000);
		return () => clearInterval(interval);
	}, []);

	useEffect(() => {
		const hasVisitedBefore = localStorage.getItem('hasVisitedBefore');
		if (!hasVisitedBefore) {
			setIsWelcomeModalOpen(true);
			localStorage.setItem('hasVisitedBefore', 'true');
		}
	}, []);

	useEffect(() => {
		const loadImages = async () => {
			try {
				await Promise.all(
					heroContent.map((content) => {
						return new Promise<void>((resolve, reject) => {
							const img = new window.Image();
							img.src = content.image;
							img.onload = () => resolve();
							img.onerror = reject;
						});
					})
				);
				setImagesLoaded(true);
			} catch (err) {
				console.error('Failed to load images', err);
			}
		};

		loadImages();
	}, []);

	useEffect(() => {
		const videoElement = videoRef.current;
		if (videoElement) {
			videoElement.addEventListener('ended', handleVideoEnd);
		}
		return () => {
			if (videoElement) {
				videoElement.removeEventListener('ended', handleVideoEnd);
			}
		};
	}, []);

	const handleVideoEnd = () => {
		if (videoRef.current) {
			if (videoRef.current.src.endsWith('video.mp4')) {
				videoRef.current.src = '/video/video2.mp4';
			} else {
				videoRef.current.src = '/video/video.mp4';
			}
			videoRef.current.play();
		}
	};

	const handleSubscribe = async (e: React.FormEvent) => {
		e.preventDefault();
		setIsSubscribing(true);

		// Simulate API call
		await new Promise((resolve) => setTimeout(resolve, 1500));

		console.log('Subscribed:', email);
		toast({
			title: 'Thank you for subscribing!',
			description: "You'll receive our latest updates and offers soon.",
		});
		setEmail('');
		setIsSubscribing(false);
	};

	return (
		<div className='flex flex-col min-h-screen bg-[#fafaff]'>
			<Navbar />

			<main className='flex-1'>
				{/* Hero Section */}
				<section className='relative h-screen w-full overflow-hidden'>
					<AnimatePresence initial={false}>
						<motion.div
							key={currentHeroIndex}
							initial={{ opacity: 0 }}
							animate={{ opacity: 1 }}
							exit={{ opacity: 0 }}
							transition={{ duration: 0.5 }}
							className='absolute inset-0'
						>
							{imagesLoaded ? (
								<div className='relative w-full h-full'>
									<Image
										src={heroContent[currentHeroIndex].image}
										alt='Hero image'
										layout='fill'
										objectFit='cover'
										objectPosition='center'
										priority
										className='w-full h-full object-top sm:object-center md:object-[center_30%] lg:object-[center_40%]'
									/>
									<div className='absolute inset-0 bg-black bg-opacity-50' />
								</div>
							) : (
								<div className='absolute inset-0 bg-gray-200 animate-pulse'></div>
							)}
							<div className='absolute inset-0 flex items-center justify-center'>
								<div className='text-center text-[#fafaff] px-4 max-w-4xl mx-auto sm:pb-0 pb-24 mt-[-10vh] flex flex-col h-full justify-center'>
									<motion.h1
										key={heroContent[currentHeroIndex].title}
										initial={{ opacity: 0, y: 20 }}
										animate={{ opacity: 1, y: 0 }}
										exit={{ opacity: 0, y: -20 }}
										transition={{ duration: 0.5 }}
										className='text-3xl md:text-4xl lg:text-5xl xl:text-6xl font-bold mb-4 leading-tight text-[#fff8f0]'
									>
										{heroContent[currentHeroIndex].title}
									</motion.h1>
									<motion.p
										key={heroContent[currentHeroIndex].text}
										initial={{ opacity: 0, y: 20 }}
										animate={{ opacity: 1, y: 0 }}
										exit={{ opacity: 0, y: -20 }}
										transition={{ duration: 0.5, delay: 0.2 }}
										className='text-lg md:text-xl lg:text-2xl mb-8 max-w-2xl mx-auto leading-relaxed text-[#fff8f0]'
									>
										{heroContent[currentHeroIndex].text}
									</motion.p>
									<motion.div
										initial={{ opacity: 0, y: 20 }}
										animate={{ opacity: 1, y: 0 }}
										exit={{ opacity: 0, y: -20 }}
										transition={{ duration: 0.5, delay: 0.4 }}
										className='mt-[100px] md:mt-[50px] lg:mt-[100px]'
									>
										<Button
											asChild
											size='lg'
											className='bg-[#1c1c1c] text-[#fafaff] hover:bg-[#e87167] hover:text-[#1c1c1c] text-lg px-8 py-3'
										>
											<Link href='/shop'>Shop Now</Link>
										</Button>
									</motion.div>
								</div>
							</div>
						</motion.div>
					</AnimatePresence>
					<button
						onClick={() =>
							setCurrentHeroIndex(
								(prevIndex) =>
									(prevIndex - 1 + heroContent.length) % heroContent.length
							)
						}
						className='absolute left-4 top-1/2 transform -translate-y-1/2 text-[#fafaff] z-10 bg-black bg-opacity-30 hover:bg-opacity-50 rounded-full p-2 transition-all duration-300 ease-in-out'
						aria-label='Previous slide'
					>
						<ChevronLeft className='h-6 w-6 md:h-8 md:w-8' />
					</button>
					<button
						onClick={() =>
							setCurrentHeroIndex(
								(prevIndex) => (prevIndex + 1) % heroContent.length
							)
						}
						className='absolute right-4 top-1/2 transform -translate-y-1/2 text-[#fafaff] z-10 bg-black bg-opacity-30 hover:bg-opacity-50 rounded-full p-2 transition-all duration-300 ease-in-out'
						aria-label='Next slide'
					>
						<ChevronRight className='h-6 w-6 md:h-8 md:w-8' />
					</button>
				</section>

				{/* Feature Video Section */}
				<section className='w-full py-12 md:py-24 bg-[#ecebe4]'>
					<div className='container px-4 md:px-6 mx-auto'>
						<div className='w-full md:w-[90%] mx-auto relative'>
							<video
								ref={videoRef}
								width='100%'
								height='auto'
								autoPlay
								muted
								playsInline
								className='rounded-lg shadow-md'
							>
								<source src='/video/video.mp4' type='video/mp4' />
								Your browser does not support the video tag.
							</video>
							<p className='text-xs text-gray-500 mt-2 text-right'>
								Video: pexels.com by RDNE Stock project
							</p>
						</div>
					</div>
				</section>

				{/* Featured Products Section */}
				<section className='w-full py-12 md:py-24 bg-[#fafaff]'>
					<div className='container px-4 md:px-6 mx-auto'>
						<motion.h2
							initial={{ opacity: 0, y: 20 }}
							animate={{ opacity: 1, y: 0 }}
							transition={{ duration: 0.5 }}
							className='text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl text-center mb-8 text-[#1c1c1c]'
						>
							Featured Swimwear
						</motion.h2>
						<div className='grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-6'>
							{featuredProducts.map((product, i) => (
								<motion.div
									key={i}
									className='group relative overflow-hidden rounded-lg shadow-lg bg-[#fafaff]'
									initial={{ opacity: 0, y: 20 }}
									animate={{ opacity: 1, y: 0 }}
									transition={{ duration: 0.5, delay: i * 0.1 }}
								>
									<Image
										src={product.image}
										alt={product.name}
										width={300}
										height={400}
										className='object-cover w-full h-[300px] transition-transform group-hover:scale-105'
									/>
									<div className='absolute inset-0 bg-black bg-opacity-40 transition-opacity opacity-0 group-hover:opacity-100 flex items-center justify-center'>
										<Button
											variant='secondary'
											asChild
											className='bg-[#fafaff] text-[#1c1c1c] hover:bg-[#e87167]'
										>
											<Link href='/shop'>
												<ShoppingBag className='mr-2 h-4 w-4' />
												Shop Now
											</Link>
										</Button>
									</div>
									<div className='p-4'>
										<h3 className='font-semibold text-lg mb-2 text-[#1c1c1c]'>
											{product.name}
										</h3>
										<p className='text-[#1c1c1c] mb-2'>
											R {product.price.toFixed(2)}
										</p>
									</div>
								</motion.div>
							))}
						</div>
					</div>
				</section>

				{/* Customer Reviews Section */}
				<section className='w-full py-12 md:py-24 bg-[#ecebe4]'>
					<div className='container px-4 md:px-6 mx-auto'>
						<motion.h2
							initial={{ opacity: 0, y: 20 }}
							animate={{ opacity: 1, y: 0 }}
							transition={{ duration: 0.5 }}
							className='text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl text-center mb-8 text-[#1c1c1c]'
						>
							What Our Customers Say
						</motion.h2>
						<div className='max-w-3xl mx-auto'>
							<AnimatePresence mode='wait'>
								<motion.div
									key={currentReviewIndex}
									initial={{ opacity: 0, y: 20 }}
									animate={{ opacity: 1, y: 0 }}
									exit={{ opacity: 0, y: -20 }}
									transition={{ duration: 0.5 }}
									className='bg-[#fafaff] p-6 rounded-lg shadow-md text-center'
								>
									<p className='text-lg text-[#1c1c1c] mb-4 italic'>
										&quot;{customerReviews[currentReviewIndex].review}&quot;
									</p>
									<p className='font-semibold text-[#1c1c1c]'>
										{customerReviews[currentReviewIndex].name} on{' '}
										{customerReviews[currentReviewIndex].platform}
									</p>
									<p className='text-sm text-[#1c1c1c] mt-2'>
										Product: {customerReviews[currentReviewIndex].product}
									</p>
								</motion.div>
							</AnimatePresence>
							<div className='flex justify-center mt-4 space-x-2'>
								{customerReviews.map((_, index) => (
									<button
										key={index}
										onClick={() => setCurrentReviewIndex(index)}
										className={`w-2 h-2 rounded-full ${
											index === currentReviewIndex
												? 'bg-[#1c1c1c]'
												: 'bg-[#daddd8]'
										}`}
										aria-label={`Go to review ${index + 1}`}
									/>
								))}
							</div>
						</div>
					</div>
				</section>

				{/* About Section */}
				<section id='about' className='w-full py-12 md:py-24 bg-[#fafaff]'>
					<div className='container px-4 md:px-6 mx-auto'>
						<div className='grid grid-cols-1 md:grid-cols-2 gap-8 items-center'>
							<div>
								<motion.h2
									initial={{ opacity: 0, y: 20 }}
									animate={{ opacity: 1, y: 0 }}
									transition={{ duration: 0.5 }}
									className='text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl mb-4 text-[#1c1c1c]'
								>
									About Amare Swimwear
								</motion.h2>
								<motion.p
									initial={{ opacity: 0, y: 20 }}
									animate={{ opacity: 1, y: 0 }}
									transition={{ duration: 0.5, delay: 0.1 }}
									className='text-[#1c1c1c] mb-4'
								>
									Amare Swimwear was born from a passion to empower women of all
									shapes and sizes. Our journey began with a simple idea: every
									woman deserves to feel confident, beautiful, and comfortable
									in her swimwear.
								</motion.p>
								<motion.p
									initial={{ opacity: 0, y: 20 }}
									animate={{ opacity: 1, y: 0 }}
									transition={{ duration: 0.5, delay: 0.2 }}
									className='text-[#1c1c1c]'
								>
									We design our swimwear with love, care, and attention to
									detail, ensuring that each piece not only looks stunning but
									also provides the perfect fit. Join us in celebrating
									diversity, body positivity, and self-love.
								</motion.p>
							</div>
							<div>
								<Image
									src='/images/CEO.jpg'
									alt='About Amare Swimwear'
									width={600}
									height={400}
									className='rounded-lg shadow-md'
								/>
							</div>
						</div>
						<motion.div
							initial={{ opacity: 0, y: 20 }}
							animate={{ opacity: 1, y: 0 }}
							transition={{ duration: 0.5, delay: 0.4 }}
							className='mt-12 p-6 bg-[#ecebe4] rounded-lg shadow-md'
						>
							<h3 className='text-2xl font-bold mb-4 text-[#1c1c1c]'>
								A Word from Our CEO
							</h3>
							<p className='text-[#1c1c1c] italic'>
								&quot;At Amare, we believe that every woman deserves to feel
								beautiful and confident in her own skin. Our mission is to
								create swimwear that not only looks stunning but also empowers
								women to embrace their unique beauty. We&apos;re committed to
								celebrating diversity and promoting body positivity through our
								designs and our community. Join us in this journey of self-love
								and confidence.&quot;
							</p>
							<p className='mt-4 text-[#1c1c1c] font-semibold'>
								- Zoe Kavinsky, CEO of Amare Swimwear
							</p>
						</motion.div>
					</div>
				</section>

				{/* Newsletter Section */}
				<section className='w-full py-12 md:py-24 bg-[#1c1c1c] text-[#fafaff]'>
					<div className='container px-4 md:px-6 mx-auto'>
						<div className='flex flex-col items-center justify-center text-center max-w-2xl mx-auto'>
							<motion.div
								initial={{ opacity: 0, y: 20 }}
								animate={{ opacity: 1, y: 0 }}
								transition={{ duration: 0.5 }}
								className='space-y-2'
							>
								<h2 className='text-3xl font-bold tracking-tighter sm:text-5xl'>
									Stay Updated
								</h2>
								<p className='text-[#daddd8] md:text-xl/relaxed lg:text-base/relaxed xl:text-xl/relaxed'>
									Subscribe to our newsletter for exclusive offers, new
									arrivals, and swimwear tips.
								</p>
							</motion.div>
							<motion.form
								initial={{ opacity: 0, y: 20 }}
								animate={{ opacity: 1, y: 0 }}
								transition={{ duration: 0.5, delay: 0.2 }}
								onSubmit={handleSubscribe}
								className='w-full max-w-sm space-y-2 mt-6'
							>
								<Input
									type='email'
									placeholder='Enter your email'
									value={email}
									onChange={(e) => setEmail(e.target.value)}
									required
									className='bg-[#fafaff] text-[#1c1c1c]'
								/>
								<Button
									type='submit'
									className='w-full bg-[#fafaff] text-[#1c1c1c] hover:bg-[#daddd8]'
									disabled={isSubscribing}
								>
									{isSubscribing ? 'Subscribing...' : 'Subscribe'}
								</Button>
							</motion.form>
						</div>
					</div>
				</section>
			</main>

			<Footer />

			<Dialog open={isWelcomeModalOpen} onOpenChange={setIsWelcomeModalOpen}>
				<DialogContent className='bg-[#fafaff]'>
					<DialogHeader>
						<DialogTitle className='text-[#1c1c1c]'>
							Welcome to Amare Swimwear!
						</DialogTitle>
					</DialogHeader>
					<p className='text-[#1c1c1c]'>
						Thank you for visiting Amare Swimwear. We&apos;re excited to have
						you here! Discover our collection of beautiful, comfortable swimwear
						designed to make you feel confident and empowered.
					</p>
					<Button
						onClick={() => setIsWelcomeModalOpen(false)}
						className='bg-[#1c1c1c] text-[#fafaff] hover:bg-[#daddd8] hover:text-[#1c1c1c]'
					>
						Start Exploring
					</Button>
				</DialogContent>
			</Dialog>
		</div>
	);
};

export default HomePage;
