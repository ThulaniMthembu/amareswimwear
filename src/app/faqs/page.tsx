'use client'

import React from 'react'
import Navbar from '@/components/Navbar'
import { Footer } from '@/components/Footer'
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion"

const faqs = [
  {
    question: "What sizes do you offer?",
    answer: "We offer a wide range of sizes, from XS to XL, to cater to all body types. You can refer to our detailed size guide on each product page for measurements to find your perfect fit."
  },
  {
    question: "Do you ship internationally?",
    answer: "We currently do not offer international shipping. However, we are working on expanding our delivery services in the future. Stay tuned for updates!"
  },
  {
    question: "How long will it take for my order to arrive?",
    answer: "Orders within South Africa typically take 3-7 business days. You'll receive a tracking number via email once your order is shipped."
  },
  {
    question: "Can I return or exchange items?",
    answer: "Yes, we accept returns and exchanges within 30 days of purchase, as long as the items are unworn and in their original condition. Please visit our Returns & Exchanges page for more details."
  },
  {
    question: "What materials are your swimsuits made from?",
    answer: "Our swimwear is crafted from high-quality, eco-friendly fabrics, including recycled nylon and polyester, offering comfort, durability, and sustainability."
  },
  {
    question: "Do you offer custom designs?",
    answer: "Currently, we do not offer custom designs, but we regularly update our collection with fresh styles that suit different tastes. Be sure to check out our latest arrivals!"
  },
  {
    question: "How do I care for my swimwear?",
    answer: "To keep your swimwear in top condition, hand wash it in cold water with mild detergent and air dry it. Avoid using bleach or tumble drying."
  },
  {
    question: "What payment methods do you accept?",
    answer: "We accept major payment methods, including credit cards, PayFast, and EFT. All transactions are secure to ensure your privacy."
  },
  {
    question: "How do I track my order?",
    answer: "Once your order is shipped, you'll receive a tracking number via email. You can use this to track your package on our website or the courier's tracking platform."
  },
  {
    question: "Can I make changes to my order after placing it?",
    answer: "We aim to process orders quickly, but if you need to make changes, please contact us within 24 hours of placing your order, and we'll do our best to assist you."
  }
]

export default function FAQsPage() {
  return (
    <div className="flex flex-col min-h-screen">
      <Navbar />
      <main className="flex-grow bg-[#fafaff] text-[#1c1c1c]">
        <div className="container mx-auto px-4 py-8 md:py-16">
          <h1 className="text-3xl md:text-4xl font-bold mb-8 text-center">Frequently Asked Questions</h1>
          <Accordion type="single" collapsible className="w-full max-w-3xl mx-auto">
            {faqs.map((faq, index) => (
              <AccordionItem key={index} value={`item-${index}`}>
                <AccordionTrigger className="text-left">{faq.question}</AccordionTrigger>
                <AccordionContent>{faq.answer}</AccordionContent>
              </AccordionItem>
            ))}
          </Accordion>
        </div>
      </main>
      <Footer />
    </div>
  )
}