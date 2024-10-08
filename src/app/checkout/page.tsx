'use client'

import React, { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { useAuth } from '@/contexts/AuthContext'
import { useCart } from '@/contexts/CartContext'
import { doc, getDoc } from 'firebase/firestore'
import { db } from '@/config/firebase'
import Image from 'next/image'
import Link from 'next/link'
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { Checkbox } from "@/components/ui/checkbox"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Separator } from "@/components/ui/separator"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { AlertCircle, Lock } from 'lucide-react'
import Navbar from '@/components/Navbar'
import { Footer } from '@/components/Footer'

interface UserProfile {
  firstName: string
  lastName: string
  email: string
  phone: string
  address: string
  city: string
  postalCode: string
  province: string
}

export default function CheckoutPage() {
  const { user } = useAuth()
  const { cart, calculateTotal } = useCart()
  const router = useRouter()
  const [profile, setProfile] = useState<UserProfile | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [shippingMethod, setShippingMethod] = useState('standard')
  const [discountCode, setDiscountCode] = useState('')
  const [discount, setDiscount] = useState(0)
  const [differentBilling, setDifferentBilling] = useState(false)
  const [agreeToTerms, setAgreeToTerms] = useState(false)
  const [cardNumber, setCardNumber] = useState('')
  const [cardExpiry, setCardExpiry] = useState('')
  const [cardCVC, setCardCVC] = useState('')
  const [cardHolder, setCardHolder] = useState('')

  useEffect(() => {
    const fetchUserProfile = async () => {
      if (user) {
        try {
          const userDoc = await getDoc(doc(db, 'users', user.uid))
          if (userDoc.exists()) {
            setProfile(userDoc.data() as UserProfile)
          } else {
            setError("User profile not found. Please update your profile before checkout.")
          }
        } catch (error) {
          console.error('Error fetching user profile:', error)
          setError("Failed to load user profile. Please try again later.")
        }
      } else {
        router.push('/auth?redirect=checkout')
      }
      setIsLoading(false)
    }

    fetchUserProfile()
  }, [user, router])

  const handleApplyDiscount = () => {
    console.log('Applying discount code:', discountCode)
    if (discountCode === 'SUMMER10') {
      setDiscount(100) // 100 ZAR discount
      console.log('Discount applied: R100')
    } else {
      setError("Invalid discount code.")
      console.log('Invalid discount code')
    }
  }

  const shippingCost = shippingMethod === 'express' ? 150 : 50 // 150 ZAR for express, 50 ZAR for standard
  const subtotal = calculateTotal()
  const totalAmount = subtotal + shippingCost - discount

  const handleSubmitOrder = async () => {
    if (cart.length === 0) {
      setError("Your cart is empty. Please add items before proceeding to checkout.")
      return
    }

    if (!agreeToTerms) {
      setError("Please agree to the terms and conditions before proceeding.")
      return
    }

    if (!cardNumber || !cardExpiry || !cardCVC || !cardHolder) {
      setError("Please fill in all card details before proceeding.")
      return
    }

    setIsSubmitting(true)
    setError(null)

    // Here you would implement your own payment processing logic
    // For now, we'll just simulate a successful order submission
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 2000))
      
      // If successful, redirect to a success page
      router.push('/order-success')
    } catch (error) {
      console.error('Error submitting order:', error)
      setError('Failed to process payment. Please try again.')
    } finally {
      setIsSubmitting(false)
    }
  }

  const capitalizeFirstLetter = (string: string) => {
    return string.charAt(0).toUpperCase() + string.slice(1)
  }

  if (isLoading) {
    return <div className="flex justify-center items-center h-screen">Loading...</div>
  }

  if (!user) {
    return null
  }

  return (
    <div className="flex flex-col min-h-screen bg-[#fafaff] text-black">
      <Navbar />
      <main className="flex-grow container mx-auto px-4 py-8">
        <h1 className="text-3xl font-bold mb-8 text-center">Checkout</h1>
        
        {error && (
          <Alert variant="destructive" className="mb-6">
            <AlertCircle className="h-4 w-4" />
            <AlertTitle>Error</AlertTitle>
            <AlertDescription>{error}</AlertDescription>
          </Alert>
        )}
        
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Left Column: Order Summary */}
          <div>
            <Card className="mb-8">
              <CardHeader>
                <CardTitle className="text-2xl">Order Summary</CardTitle>
              </CardHeader>
              <CardContent>
                {cart.length === 0 ? (
                  <p className="text-center text-gray-500">Your cart is empty.</p>
                ) : (
                  cart.map((item) => (
                    <div key={`${item.id}-${item.size}`} className="flex items-center mb-4 pb-4 border-b last:border-b-0">
                      <Image src={item.image} alt={item.name} width={60} height={60} className="rounded-md mr-4 object-cover" />
                      <div className="flex-grow">
                        <h3 className="font-semibold text-lg">{item.name}</h3>
                        <p className="text-sm text-gray-600">
                          Size: {item.size}, Qty: {item.quantity}
                        </p>
                      </div>
                      <p className="font-semibold text-lg">R{(item.price * item.quantity).toFixed(2)}</p>
                    </div>
                  ))
                )}
                <Separator className="my-4" />
                <div className="space-y-2 text-lg">
                  <div className="flex justify-between">
                    <span>Subtotal</span>
                    <span>R{subtotal.toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Shipping</span>
                    <span>R{shippingCost.toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Tax</span>
                    <span>R0.00</span>
                  </div>
                  {discount > 0 && (
                    <div className="flex justify-between text-green-600">
                      <span>Discount</span>
                      <span>-R{discount.toFixed(2)}</span>
                    </div>
                  )}
                  <Separator className="my-2" />
                  <div className="flex justify-between font-bold text-xl">
                    <span>Total</span>
                    <span>R{totalAmount.toFixed(2)}</span>
                  </div>
                </div>
                <div className="mt-6">
                  <Label htmlFor="discountCode" className="text-lg mb-2 block">Discount Code</Label>
                  <div className="flex mt-1">
                    <Input
                      id="discountCode"
                      value={discountCode}
                      onChange={(e) => setDiscountCode(e.target.value)}
                      className="mr-2 text-lg bg-white text-black"
                      placeholder="Enter code"
                      aria-label="Discount code"
                    />
                    <Button onClick={handleApplyDiscount} className="bg-[#1c1c1c] text-white hover:bg-[#e87167]">Apply</Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Right Column: Shipping, Billing, and Payment */}
          <div className="space-y-8">
            {/* Shipping Information */}
            <Card>
              <CardHeader>
                <CardTitle className="text-2xl">Shipping Information</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="firstName" className="text-lg">First Name</Label>
                      <Input
                        id="firstName"
                        defaultValue={profile?.firstName || ''}
                        onChange={(e) => e.target.value = capitalizeFirstLetter(e.target.value)}
                        className="mt-1 text-lg bg-white text-black"
                        aria-label="First name"
                        required
                      />
                    </div>
                    <div>
                      <Label htmlFor="lastName" className="text-lg">Last Name</Label>
                      <Input
                        id="lastName"
                        defaultValue={profile?.lastName || ''}
                        onChange={(e) => e.target.value = capitalizeFirstLetter(e.target.value)}
                        className="mt-1 text-lg bg-white text-black"
                        aria-label="Last name"
                        required
                      />
                    </div>
                  </div>
                  <div>
                    <Label htmlFor="address" className="text-lg">Address</Label>
                    <Input id="address" defaultValue={profile?.address || ''} className="mt-1 text-lg bg-white text-black" aria-label="Address" required />
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="city" className="text-lg">City</Label>
                      <Input id="city" defaultValue={profile?.city || ''} className="mt-1 text-lg bg-white text-black" aria-label="City" required />
                    </div>
                    <div>
                      <Label htmlFor="postalCode" className="text-lg">Postal Code</Label>
                      <Input id="postalCode" defaultValue={profile?.postalCode || ''} className="mt-1 text-lg bg-white text-black" aria-label="Postal code" required />
                    </div>
                  </div>
                  <div>
                    <Label htmlFor="province" className="text-lg">Province</Label>
                    <Select defaultValue={profile?.province || ''}>
                      <SelectTrigger id="province" className="mt-1 text-lg bg-white text-black">
                        <SelectValue placeholder="Select a province" />
                      </SelectTrigger>
                      <SelectContent className="bg-white">
                        <SelectItem value="eastern-cape" className="text-black">Eastern Cape</SelectItem>
                        <SelectItem value="free-state" className="text-black">Free State</SelectItem>
                        <SelectItem value="gauteng" className="text-black">Gauteng</SelectItem>
                        <SelectItem value="kwazulu-natal" className="text-black">KwaZulu-Natal</SelectItem>
                        <SelectItem value="limpopo" className="text-black">Limpopo</SelectItem>
                        <SelectItem value="mpumalanga" className="text-black">Mpumalanga</SelectItem>
                        <SelectItem value="northern-cape" className="text-black">Northern Cape</SelectItem>
                        <SelectItem value="north-west" className="text-black">North West</SelectItem>
                        <SelectItem value="western-cape" className="text-black">Western Cape</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div>
                    <Label htmlFor="phone" className="text-lg">Phone Number</Label>
                    <Input id="phone" defaultValue={profile?.phone || ''} className="mt-1 text-lg bg-white text-black" aria-label="Phone number" required />
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Shipping Method */}
            <Card>
              <CardHeader>
                <CardTitle className="text-2xl">Shipping Method</CardTitle>
              </CardHeader>
              <CardContent>
                <RadioGroup defaultValue="standard" onValueChange={setShippingMethod}>
                  <div className="flex items-center space-x-2 mb-2">
                    <RadioGroupItem value="standard" id="standard" className="border-2 border-gray-300" />
                    <Label htmlFor="standard" className="text-lg">Standard Shipping (3-5 business days) - R50</Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="express" id="express" className="border-2 border-gray-300" />
                    <Label htmlFor="express" className="text-lg">Express Shipping (1-2 business days) - R150</Label>
                  </div>
                </RadioGroup>
              </CardContent>
            </Card>

            {/* Billing Information */}
            <Card>
              <CardHeader>
                <CardTitle className="text-2xl">Billing Information</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex items-center space-x-2 mb-4">
                  <Checkbox
                    id="differentBilling"
                    checked={differentBilling}
                    onCheckedChange={(checked: boolean) => setDifferentBilling(checked)}
                    className="border-2 border-gray-300 rounded-sm"
                  />
                  <Label htmlFor="differentBilling" className="text-lg">Use a different billing address</Label>
                </div>
                {differentBilling && (
                  <div className="mt-4 space-y-4">
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <Label htmlFor="billingFirstName" className="text-lg">First Name</Label>
                        <Input
                          id="billingFirstName"
                          className="mt-1 text-lg bg-white text-black"
                          aria-label="Billing  first name"
                          onChange={(e) => e.target.value = capitalizeFirstLetter(e.target.value)}
                          required
                        />
                      </div>
                      <div>
                        <Label htmlFor="billingLastName" className="text-lg">Last Name</Label>
                        <Input
                          id="billingLastName"
                          className="mt-1 text-lg bg-white text-black"
                          aria-label="Billing last name"
                          onChange={(e) => e.target.value = capitalizeFirstLetter(e.target.value)}
                          required
                        />
                      </div>
                    </div>
                    <div>
                      <Label htmlFor="billingAddress" className="text-lg">Address</Label>
                      <Input id="billingAddress" className="mt-1 text-lg bg-white text-black" aria-label="Billing address" required />
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <Label htmlFor="billingCity" className="text-lg">City</Label>
                        <Input id="billingCity" className="mt-1 text-lg bg-white text-black" aria-label="Billing city" required />
                      </div>
                      <div>
                        <Label htmlFor="billingPostalCode" className="text-lg">Postal Code</Label>
                        <Input id="billingPostalCode" className="mt-1 text-lg bg-white text-black" aria-label="Billing postal code" required  />
                      </div>
                    </div>
                    <div>
                      <Label htmlFor="billingProvince" className="text-lg">Province</Label>
                      <Select>
                        <SelectTrigger id="billingProvince" className="mt-1 text-lg bg-white text-black">
                          <SelectValue placeholder="Select a province" />
                        </SelectTrigger>
                        <SelectContent className="bg-white">
                          <SelectItem value="eastern-cape" className="text-black">Eastern Cape</SelectItem>
                          <SelectItem value="free-state" className="text-black">Free State</SelectItem>
                          <SelectItem value="gauteng" className="text-black">Gauteng</SelectItem>
                          <SelectItem value="kwazulu-natal" className="text-black">KwaZulu-Natal</SelectItem>
                          <SelectItem value="limpopo" className="text-black">Limpopo</SelectItem>
                          <SelectItem value="mpumalanga" className="text-black">Mpumalanga</SelectItem>
                          <SelectItem value="northern-cape" className="text-black">Northern Cape</SelectItem>
                          <SelectItem value="north-west" className="text-black">North West</SelectItem>
                          <SelectItem value="western-cape" className="text-black">Western Cape</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>

            {/* Payment Information */}
            <Card>
              <CardHeader>
                <CardTitle className="text-2xl">Payment Information</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div>
                    <Label htmlFor="cardHolder" className="text-lg">Card Holder Name</Label>
                    <Input
                      id="cardHolder"
                      value={cardHolder}
                      onChange={(e) => setCardHolder(e.target.value)}
                      className="mt-1 text-lg bg-white text-black"
                      placeholder="John Doe"
                      required
                    />
                  </div>
                  <div>
                    <Label htmlFor="cardNumber" className="text-lg">Card Number</Label>
                    <Input
                      id="cardNumber"
                      value={cardNumber}
                      onChange={(e) => setCardNumber(e.target.value)}
                      className="mt-1 text-lg bg-white text-black"
                      placeholder="1234 5678 9012 3456"
                      required
                    />
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="cardExpiry" className="text-lg">Expiry Date</Label>
                      <Input
                        id="cardExpiry"
                        value={cardExpiry}
                        onChange={(e) => setCardExpiry(e.target.value)}
                        className="mt-1 text-lg bg-white text-black"
                        placeholder="MM/YY"
                        required
                      />
                    </div>
                    <div>
                      <Label htmlFor="cardCVC" className="text-lg">CVC</Label>
                      <Input
                        id="cardCVC"
                        value={cardCVC}
                        onChange={(e) => setCardCVC(e.target.value)}
                        className="mt-1 text-lg bg-white text-black"
                        placeholder="123"
                        required
                      />
                    </div>
                  </div>
                </div>
                <div className="mt-4 flex items-center justify-between bg-gray-100 p-4 rounded-lg">
                  <div className="flex items-center space-x-4">
                    <Lock className="text-green-600 h-6 w-6" />
                    <span className="text-lg font-semibold">Secure payment</span>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Terms and Conditions */}
            <div className="flex items-center space-x-2 mb-6">
              <Checkbox
                id="terms"
                checked={agreeToTerms}
                onCheckedChange={(checked: boolean) => setAgreeToTerms(checked)}
                className="border-2 border-gray-300 rounded-sm"
              />
              <Label htmlFor="terms" className="text-lg">
                I agree to the <Link href="/terms" className="text-blue-600 hover:underline">Terms and Conditions</Link>
              </Label>
            </div>

            {/* Submit Order Button */}
            <Button
              onClick={handleSubmitOrder}
              disabled={!agreeToTerms || cart.length === 0 || isSubmitting}
              className="w-full bg-[#1c1c1c] text-white hover:bg-[#e87167] text-xl py-6"
            >
              {isSubmitting ? 'Processing...' : `Pay R${totalAmount.toFixed(2)}`}
            </Button>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  )
}