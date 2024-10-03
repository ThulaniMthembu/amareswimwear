'use client'

import React from 'react'
import Navbar from '@/components/Navbar'
import { Footer } from '@/components/Footer'
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"

export default function ReturnsPage() {
  return (
    <div className="flex flex-col min-h-screen bg-[#fafaff]">
      <Navbar />
      <main className="flex-grow container mx-auto px-4 py-8 md:py-16 text-black">
        <h1 className="text-3xl md:text-4xl font-bold mb-8 text-center">Returns and Exchanges Policy</h1>
        <p className="mb-8 text-center max-w-2xl mx-auto">
          At AMERE, we prioritize hygiene and customer satisfaction. Please review our policy below to understand how returns and exchanges are handled.
        </p>

        <div className="grid gap-8 md:grid-cols-2">
          <Card>
            <CardHeader>
              <CardTitle className="text-black">1. Eligibility for Returns</CardTitle>
            </CardHeader>
            <CardContent className="text-black">
              <ul className="list-disc pl-5 space-y-2">
                <li><strong>Timeframe:</strong> Customers have 14 days from the date of delivery to return a damaged or defective item.</li>
                <li><strong>Condition:</strong> For returns to be accepted, the item must be unworn, unwashed, and in its original condition with tags and packaging intact.</li>
                <li><strong>No Exchanges:</strong> Due to hygienic reasons, we do not accept exchanges. Please ensure you review the size guide carefully before placing an order.</li>
              </ul>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="text-black">2. Damaged or Defective Items</CardTitle>
            </CardHeader>
            <CardContent className="text-black">
              <p>If you receive a damaged or defective item, please notify us immediately at amareresortwear@gmail.com. We will arrange for a replacement or refund at no additional cost to you. Please include:</p>
              <ul className="list-disc pl-5 mt-2">
                <li>Your order number</li>
                <li>A description of the issue</li>
                <li>Photos of the damage or defect</li>
              </ul>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="text-black">3. How to Initiate a Return for Damaged or Defective Items</CardTitle>
            </CardHeader>
            <CardContent className="text-black">
              <p>To initiate a return for damaged or defective items, please contact our customer support team at amareresortwear@gmail.com within 14 days of receiving your order. We will provide return instructions and cover the return shipping cost.</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="text-black">4. Refunds</CardTitle>
            </CardHeader>
            <CardContent className="text-black">
              <ul className="list-disc pl-5 space-y-2">
                <li>Once your return is received and inspected, we will notify you of the approval or rejection of your refund.</li>
                <li>If approved, your refund will be processed, and a credit will be applied to your original method of payment within 7-10 business days.</li>
              </ul>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="text-black">5. Return Shipping</CardTitle>
            </CardHeader>
            <CardContent className="text-black">
              <p>If the return is due to a defect or damage, AMERE Swim Wear will cover the return shipping costs.</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="text-black">6. Non-Returnable Items</CardTitle>
            </CardHeader>
            <CardContent className="text-black">
              <p>For hygienic reasons, we cannot accept returns or exchanges for any swimwear that has been worn, washed, or has had the hygiene liner removed.</p>
            </CardContent>
          </Card>
        </div>

        <Card className="mt-8">
          <CardHeader>
            <CardTitle className="text-black">Contact Us</CardTitle>
          </CardHeader>
          <CardContent className="text-black">
            <p>If you have any questions or need further assistance with your return or refund, please contact our support team at:</p>
            <p className="mt-2"><strong>Email:</strong> amareresortwear@gmail.com</p>
          </CardContent>
        </Card>
      </main>
      <Footer />
    </div>
  )
}