'use client'

import React, { useState } from 'react'
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Label } from "@/components/ui/label"
import { User, Phone, Mail } from 'lucide-react'
import Navbar from '@/components/Navbar'
import { Footer } from '@/components/Footer'
import emailjs from '@emailjs/browser'
import { toast, Toaster } from 'react-hot-toast'

const ContactPage: React.FC = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    cellphone: '',
    message: ''
  })
  const [isSubmitting, setIsSubmitting] = useState(false)

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target
    setFormData(prevState => ({
      ...prevState,
      [name]: value
    }))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsSubmitting(true)

    try {
      await emailjs.send(
        process.env.NEXT_PUBLIC_EMAILJS_SERVICE_ID!,
        process.env.NEXT_PUBLIC_EMAILJS_TEMPLATE_ID!,
        {
          from_name: formData.name,
          from_email: formData.email,
          cellphone: formData.cellphone,
          message: formData.message,
          to_email: 'swimbyamare@gmail.com'
        },
        process.env.NEXT_PUBLIC_EMAILJS_PUBLIC_KEY
      )

      toast.success('Message sent successfully!')
      setFormData({ name: '', email: '', cellphone: '', message: '' })
    } catch (error) {
      console.error('Error sending email:', error)
      toast.error('Failed to send message. Please try again.')
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <div className="flex flex-col min-h-screen bg-[#fafaff]">
      <Navbar />
      <main className="flex-1 container mx-auto px-4 py-8 mt-24 md:mt-16 flex justify-center items-center">
        <div className="w-full max-w-4xl">
          <h1 className="text-3xl font-bold mb-8 text-[#1c1c1c] text-center">Contact Us</h1>
          <div className="grid md:grid-cols-2 gap-8">
            <div>
              <h2 className="text-2xl font-semibold mb-4 text-[#1c1c1c]">Get in Touch</h2>
              <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                  <Label htmlFor="name" className="text-[#1c1c1c]">Name</Label>
                  <Input
                    type="text"
                    id="name"
                    name="name"
                    value={formData.name}
                    onChange={handleInputChange}
                    required
                    className="bg-[#fafaff] text-[#1c1c1c] border-[#1c1c1c]"
                  />
                </div>
                <div>
                  <Label htmlFor="email" className="text-[#1c1c1c]">Email</Label>
                  <Input
                    type="email"
                    id="email"
                    name="email"
                    value={formData.email}
                    onChange={handleInputChange}
                    required
                    className="bg-[#fafaff] text-[#1c1c1c] border-[#1c1c1c]"
                  />
                </div>
                <div>
                  <Label htmlFor="cellphone" className="text-[#1c1c1c]">Cellphone</Label>
                  <Input
                    type="tel"
                    id="cellphone"
                    name="cellphone"
                    value={formData.cellphone}
                    onChange={handleInputChange}
                    required
                    className="bg-[#fafaff] text-[#1c1c1c] border-[#1c1c1c]"
                  />
                </div>
                <div>
                  <Label htmlFor="message" className="text-[#1c1c1c]">Message</Label>
                  <Textarea
                    id="message"
                    name="message"
                    value={formData.message}
                    onChange={handleInputChange}
                    required
                    className="bg-[#fafaff] text-[#1c1c1c] border-[#1c1c1c]"
                  />
                </div>
                <Button 
                  type="submit" 
                  className="w-full bg-[#1c1c1c] text-[#fafaff] hover:bg-[#daddd8] hover:text-[#1c1c1c]"
                  disabled={isSubmitting}
                >
                  {isSubmitting ? 'Sending...' : 'Send Message'}
                </Button>
              </form>
            </div>
            <div>
              <h2 className="text-2xl font-semibold mb-4 text-[#1c1c1c]">Contact Information</h2>
              <div className="space-y-4">
                <div className="flex items-center space-x-2">
                  <User className="text-[#1c1c1c]" />
                  <p className="text-[#1c1c1c]">Zanele Kibido</p>
                </div>
                <div className="flex items-center space-x-2">
                  <Phone className="text-[#1c1c1c]" />
                  <p className="text-[#1c1c1c]">+27 12 345 6789</p>
                </div>
                <div className="flex items-center space-x-2">
                  <Mail className="text-[#1c1c1c]" />
                  <p className="text-[#1c1c1c]">amareresortwear@gmail.com</p>
                </div>
              </div>
              <div className="mt-8">
                <h3 className="text-xl font-semibold mb-2 text-[#1c1c1c]">Business Hours</h3>
                <p className="text-[#1c1c1c]">Monday - Friday: 9am - 5pm</p>
                <p className="text-[#1c1c1c]">Saturday: 10am - 4pm</p>
                <p className="text-[#1c1c1c]">Sunday: Closed</p>
              </div>
            </div>
          </div>
        </div>
      </main>
      <Footer />
      <Toaster position="top-center" reverseOrder={false} />
    </div>
  )
}

export default ContactPage