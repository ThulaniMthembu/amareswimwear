'use client'

import React from 'react'
import Navbar from '@/components/Navbar'
import { Footer } from '@/components/Footer'
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"

export default function PrivacyPolicyPage() {
  return (
    <div className="flex flex-col min-h-screen bg-[#fafaff]">
      <Navbar />
      <main className="flex-grow container mx-auto px-4 py-8 md:py-16 text-black">
        <h1 className="text-3xl md:text-4xl font-bold mb-8 text-center">Privacy Policy</h1>
        <p className="mb-8 text-center max-w-2xl mx-auto">
          At AMERE Swim Wear, your privacy is important to us. This Privacy Policy explains how we collect, use, and protect your personal information when you interact with our website or services.
        </p>

        <div className="space-y-8">
          <Card>
            <CardHeader>
              <CardTitle className="text-black">1. Information We Collect</CardTitle>
            </CardHeader>
            <CardContent className="text-black">
              <p>We may collect the following types of information:</p>
              <ul className="list-disc pl-5 space-y-2 mt-2">
                <li><strong>Personal Information:</strong> This includes your name, email address, phone number, shipping and billing address, and payment details when you place an order.</li>
                <li><strong>Account Information:</strong> If you create an account, we collect your login credentials (email and password).</li>
                <li><strong>Payment Information:</strong> Payments made on our website are processed securely through PayFast. We do not store any credit card information.</li>
                <li><strong>Automatically Collected Information:</strong> We collect certain information automatically when you visit our website, such as your IP address, browser type, and usage data through cookies and analytics tools.</li>
              </ul>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="text-black">2. How We Use Your Information</CardTitle>
            </CardHeader>
            <CardContent className="text-black">
              <p>We use the information we collect to:</p>
              <ul className="list-disc pl-5 space-y-2 mt-2">
                <li><strong>Process Orders:</strong> To fulfill and ship your orders, provide tracking information, and communicate with you about your order.</li>
                <li><strong>Improve Our Services:</strong> We analyze customer behavior on our website to enhance user experience, improve our product offerings, and optimize our services.</li>
                <li><strong>Marketing:</strong> With your consent, we may send you promotional emails or newsletters about new products, special offers, and updates. You can unsubscribe from these communications at any time.</li>
                <li><strong>Customer Support:</strong> To provide assistance and respond to any inquiries or issues you may have.</li>
                <li><strong>Fraud Prevention:</strong> To protect against fraudulent transactions and ensure the security of our website.</li>
              </ul>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="text-black">3. How We Protect Your Information</CardTitle>
            </CardHeader>
            <CardContent className="text-black">
              <p>We take your privacy and data security seriously. Our website uses industry-standard security measures, such as SSL encryption, to ensure that your personal information is safe when transmitted. Payments are processed securely via PayFast, and we do not store sensitive payment information on our servers.</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="text-black">4. Sharing Your Information</CardTitle>
            </CardHeader>
            <CardContent className="text-black">
              <p>We do not sell, rent, or trade your personal information. However, we may share your data with third parties in the following circumstances:</p>
              <ul className="list-disc pl-5 space-y-2 mt-2">
                <li><strong>Service Providers:</strong> We may share your information with trusted service providers who assist us with operations such as shipping, payment processing, or website hosting.</li>
                <li><strong>Legal Requirements:</strong> We may disclose your personal information if required by law or in response to valid requests from government authorities.</li>
              </ul>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="text-black">5. Cookies and Tracking Technologies</CardTitle>
            </CardHeader>
            <CardContent className="text-black">
              <p>We use cookies and similar technologies to improve your browsing experience and provide personalized content. Cookies help us understand how you interact with our website and remember your preferences. You can control cookie settings in your browser to accept or decline cookies.</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="text-black">6. Your Rights</CardTitle>
            </CardHeader>
            <CardContent className="text-black">
              <p>You have the following rights regarding your personal information:</p>
              <ul className="list-disc pl-5 space-y-2 mt-2">
                <li><strong>Access:</strong> You can request access to the personal data we hold about you.</li>
                <li><strong>Correction:</strong> You can update or correct any inaccurate personal information.</li>
                <li><strong>Deletion:</strong> You can request that we delete your personal information, subject to legal obligations or legitimate business needs.</li>
                <li><strong>Withdrawal of Consent:</strong> You can withdraw consent for marketing communications at any time by using the &quot;unsubscribe&quot; link in emails.</li>
              </ul>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="text-black">7. Third-Party Links</CardTitle>
            </CardHeader>
            <CardContent className="text-black">
              <p>Our website may contain links to external websites. Please note that we are not responsible for the privacy practices of third-party sites. We encourage you to read the privacy policies of any site you visit.</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="text-black">8. Children&apos;s Privacy</CardTitle>
            </CardHeader>
            <CardContent className="text-black">
              <p>Our website is not intended for children under the age of 13. We do not knowingly collect or store personal information from children.</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="text-black">9. Changes to This Policy</CardTitle>
            </CardHeader>
            <CardContent className="text-black">
              <p>We may update this Privacy Policy from time to time. Any changes will be posted on this page, and we encourage you to review the policy periodically to stay informed about how we protect your personal information.</p>
            </CardContent>
          </Card>
        </div>
      </main>
      <Footer />
    </div>
  )
}