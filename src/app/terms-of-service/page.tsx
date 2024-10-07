'use client'

import React from 'react'
import Navbar from '@/components/Navbar'
import { Footer } from '@/components/Footer'
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"

export default function TermsOfServicePage() {
  return (
    <div className="flex flex-col min-h-screen bg-[#fafaff]">
      <Navbar />
      <main className="flex-grow container mx-auto px-4 py-8 md:py-16 text-black">
        <h1 className="text-3xl md:text-4xl font-bold mb-8 text-center">Terms of Service</h1>
        <p className="mb-8 text-center max-w-2xl mx-auto">
          Welcome to Amare Swim Resort! By using our website, you agree to comply with and be bound by the following terms and conditions. Please read these Terms of Service carefully before accessing or using our services. If you do not agree with any part of these terms, you may not use our website or services.
        </p>

        <div className="space-y-8">
          <Card>
            <CardHeader>
              <CardTitle className="text-black">1. General Conditions</CardTitle>
            </CardHeader>
            <CardContent className="text-black">
              <ul className="list-disc pl-5 space-y-2">
                <li>By accessing or using any part of this site, you agree to be bound by these Terms of Service.</li>
                <li>We reserve the right to update, change, or replace any part of these terms at any time. It is your responsibility to check this page periodically for updates. Continued use of the site following any changes constitutes acceptance of those changes.</li>
                <li>You agree that you are at least 18 years of age or the age of majority in your country of residence.</li>
              </ul>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="text-black">2. Products and Services</CardTitle>
            </CardHeader>
            <CardContent className="text-black">
              <ul className="list-disc pl-5 space-y-2">
                <li><strong>Product Availability:</strong> All products are subject to availability. We reserve the right to discontinue or modify any products without notice.</li>
                <li><strong>Product Accuracy:</strong> We strive to display colors and images of our products accurately. However, we cannot guarantee that your device&apos;s display will represent the true color.</li>
                <li><strong>Price Changes:</strong> Prices for our products are subject to change without notice. We reserve the right to modify or discontinue products or services at any time.</li>
                <li><strong>Errors and Inaccuracies:</strong> Occasionally, there may be information on our site that contains typographical errors, inaccuracies, or omissions related to product descriptions, pricing, promotions, or availability. We reserve the right to correct such errors and update information without prior notice.</li>
              </ul>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="text-black">3. Orders and Payments</CardTitle>
            </CardHeader>
            <CardContent className="text-black">
              <ul className="list-disc pl-5 space-y-2">
                <li><strong>Order Acceptance:</strong> By placing an order, you agree that all the information you provide is accurate. We reserve the right to refuse any order for reasons such as stock limitations or errors in product information.</li>
                <li><strong>Payment:</strong> Payments are processed securely through PayFast. We accept major payment methods, including credit cards and EFT. By submitting your payment information, you authorize us to charge the total amount to your chosen payment method.</li>
                <li><strong>Cancellations:</strong> Once an order is placed, it cannot be canceled unless it is due to an error on our part.</li>
              </ul>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="text-black">4. Shipping and Delivery</CardTitle>
            </CardHeader>
            <CardContent className="text-black">
              <ul className="list-disc pl-5 space-y-2">
                <li><strong>Shipping:</strong> We currently only ship within South Africa. Delivery times may vary depending on location and external factors. Please refer to our Shipping Policy for detailed information on delivery times and shipping rates.</li>
                <li><strong>Ownership of Products:</strong> Once the product has been delivered to your specified address, ownership transfers to you. We are not responsible for any loss or damage that occurs after the product has been delivered.</li>
                <li><strong>Delays:</strong> Amare Swim Resort is not responsible for shipping delays caused by external factors such as weather, carrier issues, or customs clearance.</li>
              </ul>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="text-black">5. Returns and Refunds</CardTitle>
            </CardHeader>
            <CardContent className="text-black">
              <p>Please refer to our Returns and Exchanges Policy for detailed information on returns, refunds, and exchanges. Due to the hygienic nature of our products, exchanges are not permitted. Refunds or replacements will be provided only for defective or damaged items.</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="text-black">6. Intellectual Property</CardTitle>
            </CardHeader>
            <CardContent className="text-black">
              <ul className="list-disc pl-5 space-y-2">
                <li>All content on this website, including images, text, logos, graphics, and designs, is the property of Amare Swim Resort and is protected by copyright, trademark, and other intellectual property laws.</li>
                <li>You may not reproduce, distribute, or use any content from our website without prior written permission from Amare Swim Resort.</li>
              </ul>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="text-black">7. User Comments and Feedback</CardTitle>
            </CardHeader>
            <CardContent className="text-black">
              <p>If you submit any comments, reviews, or suggestions, you agree that we may use these for marketing purposes without restriction. You also agree that your comments do not violate any third-party rights or contain unlawful, offensive, or harmful material.</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="text-black">8. Prohibited Uses</CardTitle>
            </CardHeader>
            <CardContent className="text-black">
              <p>You agree not to use our website or services for:</p>
              <ul className="list-disc pl-5 space-y-2">
                <li>Any unlawful purpose.</li>
                <li>Violating any laws or regulations.</li>
                <li>Infringing upon or violating our intellectual property rights or the intellectual property rights of others.</li>
                <li>Uploading or transmitting malicious code that will affect the functionality of our website.</li>
              </ul>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="text-black">9. Limitation of Liability</CardTitle>
            </CardHeader>
            <CardContent className="text-black">
              <ul className="list-disc pl-5 space-y-2">
                <li>Amare Swim Resort will not be liable for any direct, indirect, incidental, punitive, or consequential damages arising from your use of our site or products.</li>
                <li>Our liability is limited to the amount paid for the product in dispute. We do not guarantee that our services will be uninterrupted, secure, or error-free.</li>
              </ul>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="text-black">10. Indemnification</CardTitle>
            </CardHeader>
            <CardContent className="text-black">
              <p>You agree to indemnify and hold harmless Amare Swim Resort and its affiliates, employees, and service providers from any claim or demand arising from your breach of these Terms of Service or your violation of any law or rights of a third party.</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="text-black">11. Governing Law</CardTitle>
            </CardHeader>
            <CardContent className="text-black">
              <p>These Terms of Service and any agreements under which we provide you services shall be governed by and construed in accordance with the laws of South Africa.</p>
            </CardContent>
          </Card>
        </div>
      </main>
      <Footer />
    </div>
  )
}