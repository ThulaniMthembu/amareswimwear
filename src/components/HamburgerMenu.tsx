import React, { useState } from 'react'
import Link from 'next/link'
import { Menu, X } from 'lucide-react'

interface NavLink {
  href: string
  label: string
}

interface HamburgerMenuProps {
  navLinks: NavLink[]
}

const HamburgerMenu: React.FC<HamburgerMenuProps> = ({ navLinks }) => {
  const [isOpen, setIsOpen] = useState(false)

  return (
    <>
      <button onClick={() => setIsOpen(!isOpen)} className="md:hidden text-[#1c1c1c] hover:text-[#e87167]">
        <Menu className="h-6 w-6" />
      </button>
      {isOpen && (
        <div className="fixed inset-0 z-50 bg-[#fafaff] p-4">
          <div className="flex justify-between items-center mb-4">
            <Link href="/" className="text-2xl font-bold text-[#1c1c1c]">
              AMARE
            </Link>
            <button onClick={() => setIsOpen(false)} className="text-[#1c1c1c]">
              <X className="h-6 w-6" />
            </button>
          </div>
          <nav className="space-y-4">
            {navLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className="block text-[#1c1c1c] hover:text-[#daddd8]"
                onClick={() => setIsOpen(false)}
              >
                {link.label}
              </Link>
            ))}
          </nav>
        </div>
      )}
    </>
  )
}

export default HamburgerMenu
