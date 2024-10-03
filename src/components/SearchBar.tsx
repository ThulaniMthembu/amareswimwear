'use client'

import React, { useState, useEffect, useRef } from 'react'
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Search } from 'lucide-react'
import { Product } from '@/types'
import Fuse from 'fuse.js'
import Image from 'next/image'

type SearchBarProps = {
  products: Product[]
  onSearch: (results: Product[]) => void
  className?: string
}

export const SearchBar: React.FC<SearchBarProps> = ({ products, onSearch, className }) => {
  const [query, setQuery] = useState('')
  const [suggestions, setSuggestions] = useState<Product[]>([])
  const searchRef = useRef<HTMLDivElement>(null)
  const fuseRef = useRef<Fuse<Product> | null>(null)

  useEffect(() => {
    fuseRef.current = new Fuse(products, {
      keys: ['name', 'description'],
      threshold: 0.3,
    })

    const handleClickOutside = (event: MouseEvent) => {
      if (searchRef.current && !searchRef.current.contains(event.target as Node)) {
        setSuggestions([])
      }
    }

    document.addEventListener('mousedown', handleClickOutside)
    return () => {
      document.removeEventListener('mousedown', handleClickOutside)
    }
  }, [products])

  const handleSearch = () => {
    if (fuseRef.current && query) {
      const results = fuseRef.current.search(query).map(result => result.item)
      onSearch(results)
    } else {
      onSearch(products)
    }
    setSuggestions([])
  }

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value
    setQuery(value)

    if (value.length > 1 && fuseRef.current) {
      const newSuggestions = fuseRef.current.search(value).map(result => result.item).slice(0, 5)
      setSuggestions(newSuggestions)
    } else {
      setSuggestions([])
    }
  }

  const handleSuggestionClick = (suggestion: Product) => {
    setQuery(suggestion.name)
    onSearch([suggestion])
    setSuggestions([])
  }

  const handleKeyPress = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      handleSearch()
    }
  }

  return (
    <div ref={searchRef} className={`relative w-full max-w-md ${className}`}>
      <div className="flex">
        <Input
          type="text"
          placeholder="Search products..."
          value={query}
          onChange={handleInputChange}
          onKeyPress={handleKeyPress}
          className="rounded-r-none w-full bg-white text-black border-black"
        />
        <Button onClick={handleSearch} className="rounded-l-none bg-[#1c1c1c] text-white hover:bg-[#e87167]">
          <Search className="h-4 w-4" />
        </Button>
      </div>
      {suggestions.length > 0 && (
        <ul className="absolute z-10 w-full bg-white border border-gray-300 mt-1 rounded-md shadow-lg max-h-60 overflow-y-auto">
          {suggestions.map((suggestion) => (
            <li
              key={suggestion.id}
              className="px-4 py-2 hover:bg-gray-100 cursor-pointer flex items-center"
              onClick={() => handleSuggestionClick(suggestion)}
            >
              <Image src={suggestion.image} alt={suggestion.name} width={40} height={40} className="object-cover mr-2 rounded" />
              <div>
                <div className="font-semibold text-black">{suggestion.name}</div>
                <div className="text-sm text-gray-600">R {suggestion.price.toFixed(2)}</div>
              </div>
            </li>
          ))}
        </ul>
      )}
    </div>
  )
}

export default SearchBar