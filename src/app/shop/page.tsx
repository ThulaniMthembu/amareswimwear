'use client';

import React, {
	useState,
	useEffect,
	lazy,
	Suspense,
	useCallback,
	useMemo,
} from 'react';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import {
	Select,
	SelectContent,
	SelectItem,
	SelectTrigger,
	SelectValue,
} from '@/components/ui/select';
import { ShoppingBag, Info, X, Star } from 'lucide-react';
import Image from 'next/image';
import { useSearchParams } from 'next/navigation';
import { useCart } from '@/contexts/CartContext';
import { useAuth } from '@/contexts/AuthContext';
import Navbar from '@/components/Navbar';
import { Footer } from '@/components/Footer';
import SizeGuideModal from '@/components/SizeGuideModal';
import { SearchBar } from '@/components/SearchBar';
import { Product, Review, User } from '@/types';

const LazyReviewList = lazy(() =>
	import('@/components/ReviewList').then((mod) => ({ default: mod.ReviewList }))
);
const LazyReviewForm = lazy(() =>
	import('@/components/ReviewForm').then((mod) => ({ default: mod.ReviewForm }))
);

const initialProducts: Product[] = [
	{
		id: 1,
		name: 'Pink Sapphire Swimsuit',
		price: 650.0,
		image: '/products/ruby-swimsuit.jpg',
		hoverImage: '/products/ruby-swimsuit-hover.jpg',
		sizes: ['XS', 'S', 'M', 'L', 'XL'],
		description:
			'Our Pink Sapphire swimsuit is a symphony of pink hues that orchestrates confidence and poise. Our swimsuits are the perfect harmony of style and sophistication.',
		reviews: [],
		averageRating: 0,
		category: 'Swimsuit',
		tags: ['Pink', 'Sapphire', 'One-piece'],
		stock: 100,
	},
	{
		id: 2,
		name: 'Pink Sapphire Bikini',
		price: 600.0,
		image: '/products/ruby-bikini.jpg',
		hoverImage: '/products/ruby-bikini-hover.jpg',
		sizes: ['XS', 'S', 'M', 'L', 'XL'],
		description:
			'Wrap yourself in the soft, warm embrace of Pink Sapphire bikini. Our pink swimsuits are like a gentle sunset on your skin, radiating comfort and serenity.',
		reviews: [],
		averageRating: 0,
		category: 'Bikini',
		tags: ['Pink', 'Sapphire', 'Two-piece'],
		stock: 80,
	},
	{
		id: 3,
		name: 'Maddison Swimsuit',
		price: 650.0,
		image: '/products/maddison-swimsuit.jpg',
		hoverImage: '/products/maddison-swimsuit-hover.jpg',
		sizes: ['XS', 'S', 'M', 'L', 'XL'],
		description:
			"This design is sultry and sophisticated made for the goddess who isn't afraid to shine. Whether you're lounging by the pool or soaking up the sun's rays on the beach. Embrace your inner goddess and slay the summer in our Maddison swimsuit.",
		reviews: [],
		averageRating: 0,
		category: 'Swimsuit',
		tags: ['Maddison', 'One-piece'],
		stock: 75,
	},
	{
		id: 4,
		name: 'Maddison Bikini',
		price: 600.0,
		image: '/products/maddison-bikini.jpg',
		hoverImage: '/products/maddison-bikini-hover.jpg',
		sizes: ['XS', 'S', 'M', 'L', 'XL'],
		description:
			'Our Maddison Bikini is a sustainable and stylish swimwear made for the conscious beach lover who wants to make a statement. Inspired by the beauty of the ocean and very versatile.',
		reviews: [],
		averageRating: 0,
		category: 'Bikini',
		tags: ['Maddison', 'Two-piece'],
		stock: 90,
	},
];

export default function ShopPage() {
	const [products, setProducts] = useState<Product[]>(initialProducts);
	const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
	const [selectedSize, setSelectedSize] = useState<string>('');
	const [quantity, setQuantity] = useState<number>(1);
	const [isFullScreen, setIsFullScreen] = useState<boolean>(false);
	const [sortBy, setSortBy] = useState<'rating' | 'price' | 'name'>('rating');
	const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('desc');
	const [searchResults, setSearchResults] = useState<Product[]>([]);
	const [error, setError] = useState<string | null>(null);
	const { addToCart } = useCart();
	const { user: firebaseUser } = useAuth();
	const searchParams = useSearchParams();

	const user: User | null = firebaseUser
		? {
				id: firebaseUser.uid,
				name: firebaseUser.displayName || 'Anonymous User',
				email: firebaseUser.email || '',
				role: 'customer',
				createdAt:
					firebaseUser.metadata.creationTime || new Date().toISOString(),
		  }
		: null;

	const memoizedProducts = useMemo(() => products, [products]);

	const fetchReviews = useCallback(async () => {
		try {
			const updatedProducts = await Promise.all(memoizedProducts.map(async (product) => {
				const response = await fetch(`/api/reviews?productId=${product.id}`)
				if (!response.ok) {
					throw new Error(`HTTP error! status: ${response.status}`)
				}
				const reviews = await response.json()
				return {
					...product,
					reviews: Array.isArray(reviews) ? reviews : [],
					averageRating: reviews.length > 0
						? reviews.reduce((sum: number, review: Review) => sum + review.rating, 0) / reviews.length
						: 0
				}
			}))
			setProducts(updatedProducts)
			setError(null)
		} catch (error) {
			console.error("Failed to fetch reviews:", error)
			setError(`Failed to fetch reviews. Please try again later. Error: ${error instanceof Error ? error.message : 'Unknown error'}`)
		}
	}, [memoizedProducts])

	useEffect(() => {
		fetchReviews();
	}, [fetchReviews]);

	useEffect(() => {
		const itemId = searchParams.get('item');
		if (itemId) {
			const product = products.find((p) => p.id === parseInt(itemId));
			if (product) {
				setSelectedProduct(product);
			}
		}
	}, [searchParams, products]);

	useEffect(() => {
		if (selectedProduct || isFullScreen) {
			document.body.style.overflow = 'hidden';
		} else {
			document.body.style.overflow = 'unset';
		}

		return () => {
			document.body.style.overflow = 'unset';
		};
	}, [selectedProduct, isFullScreen]);

	const handleAddToCart = () => {
		if (selectedProduct && selectedSize) {
			addToCart({
				id: selectedProduct.id.toString(),
				name: selectedProduct.name,
				price: selectedProduct.price,
				size: selectedSize,
				quantity: quantity,
				image: selectedProduct.image,
			});
			setSelectedSize('');
			setQuantity(1);
			setSelectedProduct(null);
		}
	};

	const toggleFullScreen = () => {
		setIsFullScreen(!isFullScreen);
	};

	const handleAddReview = async (
		productId: number,
		newReview: Omit<Review, 'id' | 'userId' | 'userName' | 'createdAt'>
	) => {
		const reviewToAdd = {
			userId: user?.id || 'anonymous',
			userName: user?.name || 'Anonymous User',
			...newReview,
		};

		try {
			const response = await fetch('/api/reviews', {
				method: 'POST',
				headers: {
					'Content-Type': 'application/json',
				},
				body: JSON.stringify({ productId, review: reviewToAdd }),
			});

			if (!response.ok) {
				throw new Error(`HTTP error! status: ${response.status}`);
			}

			const addedReview = await response.json();

			setProducts((prevProducts) => {
				return prevProducts.map((product) => {
					if (product.id === productId) {
						const updatedReviews = Array.isArray(product.reviews)
							? [...product.reviews, addedReview]
							: [addedReview];
						const averageRating =
							updatedReviews.reduce((sum, r) => sum + r.rating, 0) /
							updatedReviews.length;
						return { ...product, reviews: updatedReviews, averageRating };
					}
					return product;
				});
			});

			if (selectedProduct && selectedProduct.id === productId) {
				setSelectedProduct((prevSelected) => {
					if (prevSelected) {
						const updatedReviews = Array.isArray(prevSelected.reviews)
							? [...prevSelected.reviews, addedReview]
							: [addedReview];
						const averageRating =
							updatedReviews.reduce((sum, r) => sum + r.rating, 0) /
							updatedReviews.length;
						return { ...prevSelected, reviews: updatedReviews, averageRating };
					}
					return prevSelected;
				});
			}
			setError(null);
			fetchReviews();
		} catch (error) {
			console.error('Failed to add review:', error);
			setError('Failed to add review. Please try again later.');
		}
	};

	const handleSearch = (results: Product[]) => {
		setSearchResults(results);
	};

	const sortedProducts = [
		...(searchResults.length > 0 ? searchResults : products),
	].sort((a, b) => {
		if (sortBy === 'rating') {
			return sortOrder === 'desc'
				? b.averageRating - a.averageRating
				: a.averageRating - b.averageRating;
		} else if (sortBy === 'price') {
			return sortOrder === 'desc' ? b.price - a.price : a.price - b.price;
		} else {
			return sortOrder === 'desc'
				? b.name.localeCompare(a.name)
				: a.name.localeCompare(b.name);
		}
	});

	return (
		<div className='flex flex-col min-h-screen bg-[#fafaff]'>
			<Navbar />
			<main className='flex-grow container mx-auto px-4 py-8 mt-16'>
				<h1 className='text-4xl font-bold text-center mb-4 text-[#1c1c1c]'>
					Our Collection
				</h1>
				<p className='text-center text-lg mb-8 text-[#1c1c1c] max-w-2xl mx-auto'>
					Discover our exquisite range of swimwear, designed to make you feel
					confident and beautiful. Each piece is crafted with care using
					high-quality, sustainable materials to ensure both style and comfort.
				</p>
				{error && (
					<div
						className='bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative mb-4'
						role='alert'
					>
						<strong className='font-bold'>Error: </strong>
						<span className='block sm:inline'>{error}</span>
					</div>
				)}
				<div className='mb-4 flex flex-col md:flex-row justify-between items-center gap-4'>
					<SearchBar
						products={products}
						onSearch={handleSearch}
						className='w-full md:w-auto'
					/>
					<div className='flex items-center gap-2'>
						<Select
							value={sortBy}
							onValueChange={(value: 'rating' | 'price' | 'name') =>
								setSortBy(value)
							}
						>
							<SelectTrigger className='w-[180px] bg-white border-black text-black'>
								<SelectValue placeholder='Sort by' />
							</SelectTrigger>
							<SelectContent className='bg-white text-black'>
								<SelectItem
									value='rating'
									className='bg-white text-black hover:bg-gray-100'
								>
									Rating
								</SelectItem>
								<SelectItem
									value='price'
									className='bg-white text-black hover:bg-gray-100'
								>
									Price
								</SelectItem>
								<SelectItem
									value='name'
									className='bg-white text-black hover:bg-gray-100'
								>
									Name
								</SelectItem>
							</SelectContent>
						</Select>
						<Button
							variant='outline'
							onClick={() => setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc')}
							className='bg-white border-black text-black hover:bg-gray-100'
						>
							{sortOrder === 'asc' ? 'Ascending' : 'Descending'}
						</Button>
					</div>
				</div>
				<div className='grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8'>
					{sortedProducts.map((product) => (
						<div
							key={product.id}
							className='bg-white rounded-lg shadow-md overflow-hidden'
						>
							<div
								className='relative overflow-hidden group cursor-pointer'
								onClick={() => setSelectedProduct(product)}
							>
								<Image
									src={product.image}
									alt={product.name}
									width={300}
									height={400}
									className='w-full h-[400px] object-cover transition-transform duration-300 group-hover:scale-110'
								/>
								<div className='absolute inset-0 bg-black bg-opacity-50 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center'>
									<Image
										src={product.hoverImage}
										alt={`${product.name} hover`}
										width={300}
										height={400}
										className='w-full h-full object-cover'
									/>
								</div>
							</div>
							<div className='p-4'>
								<h2 className='text-xl font-semibold mb-2 text-[#1c1c1c]'>
									{product.name}
								</h2>
								<p className='text-[#1c1c1c] mb-2'>
									R {product.price.toFixed(2)}
								</p>
								<div className='flex items-center mb-2'>
									{[1, 2, 3, 4, 5].map((star) => (
										<Star
											key={star}
											className={`w-4 h-4 ${
												star <= product.averageRating
													? 'text-yellow-400 fill-current'
													: 'text-gray-300'
											}`}
										/>
									))}
									<span className='ml-2 text-sm text-gray-600'>
										({product.reviews.length})
									</span>
								</div>
								<Button
									onClick={() => setSelectedProduct(product)}
									className='w-full bg-[#1c1c1c] text-[#fafaff] hover:bg-[#e87167]'
								>
									View Details
								</Button>
							</div>
						</div>
					))}
				</div>

				{selectedProduct && (
					<div className='fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50'>
						<div className='bg-white rounded-lg p-8 max-w-2xl w-full max-h-[90vh] overflow-y-auto'>
							<h2 className='text-2xl font-bold mb-4 text-[#1c1c1c]'>
								{selectedProduct.name}
							</h2>
							<div className='flex flex-col md:flex-row gap-8'>
								<div className='flex-1'>
									<Image
										src={selectedProduct.image}
										alt={selectedProduct.name}
										width={400}
										height={500}
										className='w-full h-auto object-cover rounded-lg cursor-pointer'
										onClick={toggleFullScreen}
									/>
								</div>
								<div className='flex-1'>
									<p className='text-xl font-semibold mb-4 text-[#1c1c1c]'>
										R {selectedProduct.price.toFixed(2)}
									</p>
									<div className='flex items-center mb-4'>
										{[1, 2, 3, 4, 5].map((star) => (
											<Star
												key={star}
												className={`w-5 h-5 ${
													star <= selectedProduct.averageRating
														? 'text-yellow-400 fill-current'
														: 'text-gray-300'
												}`}
											/>
										))}
										<span className='ml-2 text-sm text-gray-600'>
											({selectedProduct.reviews.length} reviews)
										</span>
									</div>
									<p className='text-[#1c1c1c] mb-4'>
										{selectedProduct.description}
									</p>
									<div className='mb-4'>
										<Label
											htmlFor='size'
											className='text-[#1c1c1c] flex items-center justify-between'
										>
											Size
											<SizeGuideModal />
										</Label>
										<RadioGroup
											id='size'
											value={selectedSize}
											onValueChange={setSelectedSize}
											className='flex flex-wrap gap-2 mt-2'
										>
											{selectedProduct.sizes.map((size) => (
												<div key={size}>
													<RadioGroupItem
														value={size}
														id={`size-${size}`}
														className='peer sr-only'
													/>
													<Label
														htmlFor={`size-${size}`}
														className={`flex items-center justify-center rounded-md border-2 border-muted bg-popover p-2 hover:bg-accent hover:text-accent-foreground peer-data-[state=checked]:border-primary [&:has([data-state=checked])]:border-primary text-[#1c1c1c] cursor-pointer ${
															selectedSize === size
																? 'bg-[#e87167] text-white'
																: ''
														}`}
													>
														{size}
													</Label>
												</div>
											))}
										</RadioGroup>
									</div>
									<div className='mb-4'>
										<Label htmlFor='quantity' className='text-[#1c1c1c]'>
											Quantity
										</Label>
										<Select
											value={quantity.toString()}
											onValueChange={(value) => setQuantity(parseInt(value))}
										>
											<SelectTrigger
												id='quantity'
												className='w-24 mt-2 bg-white text-[#1c1c1c]'
											>
												<SelectValue placeholder='Qty' />
											</SelectTrigger>
											<SelectContent className='bg-white'>
												{[1, 2, 3, 4, 5].map((num) => (
													<SelectItem
														key={num}
														value={num.toString()}
														className='text-[#1c1c1c]'
													>
														{num}
													</SelectItem>
												))}
											</SelectContent>
										</Select>
									</div>
									{!selectedSize && (
										<p className='text-red-500 text-sm mb-2 flex items-center'>
											<Info className='w-4 h-4 mr-1' />
											Please select a size before adding to cart
										</p>
									)}
									<Button
										onClick={handleAddToCart}
										disabled={!selectedSize}
										className='w-full bg-[#1c1c1c] text-[#fafaff] hover:bg-[#e87167] cursor-pointer transition-colors duration-300'
									>
										<ShoppingBag className='mr-2 h-4 w-4' /> Add to Cart
									</Button>
								</div>
							</div>
							<div className='mt-8'>
								<h3 className='text-xl font-semibold mb-4 text-black'>
									Customer Reviews
								</h3>
								<Suspense fallback={<div>Loading reviews...</div>}>
									<LazyReviewList
										reviews={selectedProduct?.reviews || []}
										currentUser={user}
									/>
								</Suspense>
								<div className='mt-4'>
									<h4 className='text-lg font-semibold mb-2 text-black'>
										Write a Review
									</h4>
									{user ? (
										<Suspense fallback={<div>Loading review form...</div>}>
											<LazyReviewForm
												productId={selectedProduct.id}
												onSubmit={(
													review: Omit<
														Review,
														'id' | 'userId' | 'userName' | 'createdAt'
													>
												) => handleAddReview(selectedProduct.id, review)}
											/>
										</Suspense>
									) : (
										<p className='text-gray-600'>
											Please log in to write a review.
										</p>
									)}
								</div>
							</div>
							<Button
								onClick={() => setSelectedProduct(null)}
								variant='outline'
								className='w-full mt-4 text-[#fafaff] bg-[#1c1c1c] hover:bg-[#e87167] transition-colors duration-300'
							>
								Close
							</Button>
						</div>
					</div>
				)}

				{isFullScreen && selectedProduct && (
					<div className='fixed inset-0 bg-black bg-opacity-90 flex items-center justify-center z-50'>
						<Button
							onClick={toggleFullScreen}
							className='absolute top-4 right-4 bg-transparent hover:bg-white/10 text-white'
						>
							<X className='h-6 w-6' />
						</Button>
						<Image
							src={selectedProduct.image}
							alt={selectedProduct.name}
							width={1200}
							height={1500}
							className='max-w-full max-h-full object-contain'
						/>
					</div>
				)}
			</main>
			<Footer />
		</div>
	);
}
