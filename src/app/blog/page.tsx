import Link from 'next/link'
import { Button } from "@/components/ui/button"
import Navbar from '@/components/Navbar'
import { Footer } from '@/components/Footer'

export default function BlogPage() {
  return (
    <div className="flex flex-col min-h-screen bg-white text-black">
      <Navbar />
      <main className="flex-grow">
        <div className="container mx-auto px-4 py-8">
          <article className="prose lg:prose-xl mx-auto">
            <h1 className="text-3xl font-bold mb-4 text-black">Discover Your Perfect Fit: The Amare Swim Resort Collection</h1>
            <p className="text-gray-600 mb-8">Published on October 3, 2024</p>

            <p>At Amare Swim Resort, we believe that every woman deserves to feel confident, beautiful, and empowered in her own skin&mdash;whether lounging by the pool or diving into the waves. That&apos;s why we&apos;ve curated a collection of bikinis and swimwear that celebrate every body shape, from sleek and sporty to bold and glamorous.</p>

            <h2 className="text-2xl font-bold mt-8 mb-4 text-black">Why Amare?</h2>
            <p>Our mission is simple: to create swimwear that not only looks great but fits like a dream. Each piece in our collection is carefully crafted with premium fabrics that provide the perfect blend of comfort, durability, and style. Whether you&apos;re looking for a timeless classic or a trendsetting piece, we&apos;ve got you covered.</p>

            <h2 className="text-2xl font-bold mt-8 mb-4 text-black">Finding the Right Fit</h2>
            <p>Shopping for swimwear online can be daunting, but with Amare, it&apos;s easy to find the right fit. Our size guide helps you choose based on your exact measurements, and we offer free exchanges to ensure you get a piece that fits perfectly. Here&apos;s a quick breakdown of our fits:</p>
            <ul className="list-disc pl-6 mb-4">
              <li><strong>Classic Cut:</strong> This timeless style provides full coverage while still highlighting your natural curves. Perfect for those looking for a bit more support.</li>
              <li><strong>High-Waist:</strong> This vintage-inspired silhouette is all about high-waisted bottoms that offer extra comfort and a flattering shape.</li>
              <li><strong>Brazilian Cut:</strong> For those who love a bolder, cheekier fit, the Brazilian cut shows off a little more skin while keeping everything secure.</li>
            </ul>

            <h2 className="text-2xl font-bold mt-8 mb-4 text-black">Sustainable Fashion</h2>
            <p>We care about our planet, and that&apos;s why Amare Swim Resort is committed to sustainable practices. Our swimwear is made from eco-friendly materials, ensuring that you can enjoy your time in the sun while protecting the environment. From recycled nylon to biodegradable packaging, we take conscious steps to reduce our environmental footprint.</p>

            <div className="mt-8 p-6 bg-gray-100 rounded-lg">
              <p className="text-lg font-semibold mb-4 text-black">Ready to dive into summer with confidence?</p>
              <Link href="/shop">
                <Button className="bg-[#e87167] text-white hover:bg-[#d35f55]">
                  Shop Our Latest Collection
                </Button>
              </Link>
              <p className="mt-4 text-black">
                Don&apos;t forget to sign up for our newsletter to stay updated on new arrivals and exclusive discounts!
              </p>
            </div>
          </article>
        </div>
      </main>
      <Footer />
    </div>
  )
}