'use client'

import React from 'react'
import Navbar from '@/components/Navbar'
import { Footer } from '@/components/Footer'
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"

export default function ShippingPage() {
  return (
    <div className="flex flex-col min-h-screen bg-[#fafaff]">
      <Navbar />
      <main className="flex-grow container mx-auto px-4 py-8 md:py-16 text-black">
        <h1 className="text-3xl md:text-4xl font-bold mb-8 text-center">Shipping Information</h1>
        <p className="mb-8 text-center max-w-2xl mx-auto">
          At Amare Swim Resort, we aim to deliver your orders as quickly and securely as possible. Here&apos;s everything you need to know about our shipping process:
        </p>

        <div className="grid gap-8 md:grid-cols-2">
          <Card>
            <CardHeader>
              <CardTitle className="text-black">1. Shipping Options and Rates</CardTitle>
            </CardHeader>
            <CardContent className="text-black">
              <ul className="list-disc pl-5 space-y-2">
                <li><strong>Domestic Shipping:</strong> We currently ship within South Africa only.</li>
                <li><strong>Delivery Times:</strong> Orders typically take 3-7 business days for delivery, depending on your location.</li>
                <li><strong>Shipping Costs:</strong>
                  <ul className="list-disc pl-5 mt-2">
                    <li>Standard Shipping: A flat rate of R50 for all domestic orders.</li>
                    <li>Free Shipping: Available on orders above R1000.</li>
                    <li>Express Shipping: Option for expedited delivery at a rate of R150, ensuring your order arrives within 1-3 business days.</li>
                  </ul>
                </li>
                <li><strong>Future International Shipping:</strong> We are working on expanding our services to include international shipping in the future. Stay tuned for updates!</li>
              </ul>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="text-black">2. Delivery Times</CardTitle>
            </CardHeader>
            <CardContent className="text-black">
              <p>Estimated delivery times may vary depending on your location within South Africa.</p>
              <p className="mt-2">Please note that delivery times may be affected by public holidays, weekends, and external factors such as courier delays. We recommend placing your orders in advance, especially during peak seasons.</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="text-black">3. Tracking Information</CardTitle>
            </CardHeader>
            <CardContent className="text-black">
              <p>Once your order is shipped, you will receive a tracking number via email. This allows you to track your package and stay updated on its delivery status.</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="text-black">4. Shipping Carriers</CardTitle>
            </CardHeader>
            <CardContent className="text-black">
              <p>We partner with reliable shipping carriers to ensure timely delivery, including:</p>
              <ul className="list-disc pl-5 mt-2">
                <li>The Courier Guy</li>
                <li>Aramex</li>
              </ul>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="text-black">5. Shipping Restrictions</CardTitle>
            </CardHeader>
            <CardContent className="text-black">
              <p>Currently, we do not ship internationally. We also do not ship to rural areas or PO Boxes at this time. We are continually reviewing our shipping options to expand service areas in the future.</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="text-black">6. Order Processing Time</CardTitle>
            </CardHeader>
            <CardContent className="text-black">
              <p>Please allow 1-2 business days for us to process your order before it is dispatched. You will be notified once your order is shipped.</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="text-black">7. Shipping Costs</CardTitle>
            </CardHeader>
            <CardContent className="text-black">
              <ul className="list-disc pl-5 space-y-2">
                <li>Standard Shipping: R60 flat rate for all domestic orders.</li>
                <li>Free Shipping: On orders exceeding R800.</li>
                <li>Express Shipping: R120 for quicker delivery within 1-3 business days.</li>
              </ul>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="text-black">8. Delivery Issues</CardTitle>
            </CardHeader>
            <CardContent className="text-black">
              <p>If your package is delayed, lost, or arrives damaged, please reach out to our customer service team at amareresortwear@gmail.com. We will work to resolve the issue promptly. You may need to provide your order number and tracking information to assist us in helping you quickly.</p>
            </CardContent>
          </Card>
        </div>
      </main>
      <Footer />
    </div>
  )
}