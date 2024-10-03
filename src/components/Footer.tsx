'use client'

import Link from 'next/link'
import Image from 'next/image'
import { Instagram } from 'lucide-react'

export function Footer() {
  return (
    <footer className="bg-[#eef0f2]">
      <div className="container mx-auto px-4 py-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          <div>
            <h3 className="text-lg font-semibold mb-4 text-[#1c1c1c]">Shop Categories</h3>
            <Image
              src="/images/logo.png"
              alt="Shop Categories: Bikinis, One-Piece, Tankinis, Cover-Ups, Plus Size, Accessories"
              width={150}
              height={100}
              className="rounded-lg"
            />
          </div>
          <div>
            <h3 className="text-lg font-semibold mb-4 text-[#1c1c1c]">Company</h3>
            <ul className="space-y-2">
              <li><Link href="/#about" className="text-[#1c1c1c] hover:text-[#e87167]">About Us</Link></li>
              <li><Link href="/contact" className="text-[#1c1c1c] hover:text-[#e87167]">Contact</Link></li>
              <li><Link href="/blog" className="text-[#1c1c1c] hover:text-[#e87167]">Blog</Link></li>
            </ul>
          </div>
          <div>
            <h3 className="text-lg font-semibold mb-4 text-[#1c1c1c]">Customer Service</h3>
            <ul className="space-y-2">
              <li><Link href="/faqs" className="text-[#1c1c1c] hover:text-[#e87167]">FAQ</Link></li>
              <li><Link href="/shipping" className="text-[#1c1c1c] hover:text-[#e87167]">Shipping</Link></li>
              <li><Link href="/returns" className="text-[#1c1c1c] hover:text-[#e87167]">Returns and Exchange</Link></li>
            </ul>
          </div>
          <div>
            <h3 className="text-lg font-semibold mb-4 text-[#1c1c1c]">Connect With Us</h3>
            <div className="flex flex-col space-y-2">
              <a href="https://www.instagram.com/_loveamare/?hl=en" className="text-[#1c1c1c] hover:text-[#e87167] flex items-center" target="_blank" rel="noopener noreferrer">
                <Instagram className="w-5 h-5 mr-2" />
                <span>Instagram</span>
              </a>
              <a href="https://www.tiktok.com/@amareresortwear" className="text-[#1c1c1c] hover:text-[#e87167] flex items-center" target="_blank" rel="noopener noreferrer">
                <svg className="w-5 h-5 mr-2" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M19.59 6.69a4.83 4.83 0 0 1-3.77-4.25V2h-3.45v13.67a2.89 2.89 0 0 1-5.2 1.74 2.89 2.89 0 0 1 2.31-4.64 2.93 2.93 0 0 1 .88.13V9.4a6.84 6.84 0 0 0-1-.05A6.33 6.33 0 0 0 5 20.1a6.34 6.34 0 0 0 10.86-4.43v-7a8.16 8.16 0 0 0 4.77 1.52v-3.4a4.85 4.85 0 0 1-1-.1z" />
                </svg>
                <span>TikTok</span>
              </a>
            </div>
          </div>
        </div>
        <div className="mt-8 border-t border-[#daddd8] pt-8 flex flex-col md:flex-row justify-between items-center">
          <p className="text-[#1c1c1c]">&copy; {new Date().getFullYear()} Amare Swimwear. All rights reserved.</p>
          <div className="flex space-x-4 mt-4 md:mt-0">
            <Link href="/privacy-policy" className="text-[#1c1c1c] hover:text-[#e87167]">Privacy Policy</Link>
            <Link href="/terms-of-service" className="text-[#1c1c1c] hover:text-[#e87167]">Terms of Service</Link>
          </div>
        </div>
        <div className="mt-4 text-center text-xs text-[#1c1c1c]">
          <p>
            Website by <a href="https://devmajxr.netlify.app/" target="_blank" rel="noopener noreferrer" className="hover:text-[#e87167]">Thulani Mthembu | thulanim457@gmail.com</a>
          </p>
        </div>
      </div>
    </footer>
  )
}