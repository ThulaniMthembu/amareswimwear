'use client'

import React, { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { useAuth } from '@/contexts/AuthContext'
import { useCart, CartItem } from '@/contexts/CartContext'
import { doc, getDoc } from 'firebase/firestore'
import { db } from '@/config/firebase'
import Image from 'next/image'
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { Checkbox } from "@/components/ui/checkbox"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Separator } from "@/components/ui/separator"
import Navbar from '@/components/Navbar'
import { Footer } from '@/components/Footer'
import { Lock } from 'lucide-react'

interface UserProfile {
  name: string
  email: string
  phone: string
  address: string
  city: string
  postalCode: string
  province: string
}

const CheckoutPage: React.FC = () => {
  const { user } = useAuth()
  const { cart } = useCart()
  const router = useRouter()
  const [profile, setProfile] = useState<UserProfile | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [shippingMethod, setShippingMethod] = useState('standard')
  const [discountCode, setDiscountCode] = useState('')
  const [discount, setDiscount] = useState(0)
  const [differentBilling, setDifferentBilling] = useState(false)
  const [agreeToTerms, setAgreeToTerms] = useState(false)

  useEffect(() => {
    const fetchUserProfile = async () => {
      if (user) {
        try {
          const userDoc = await getDoc(doc(db, 'users', user.uid))
          if (userDoc.exists()) {
            setProfile(userDoc.data() as UserProfile)
          }
        } catch (error) {
          console.error('Error fetching user profile:', error)
        }
      } else {
        router.push('/auth?redirect=checkout')
      }
      setIsLoading(false)
    }

    fetchUserProfile()
  }, [user, router])

  const handleApplyDiscount = () => {
    if (discountCode === 'SUMMER10') {
      setDiscount(100) // 100 ZAR discount
    }
  }

  const shippingCost = shippingMethod === 'express' ? 150 : 50 // 150 ZAR for express, 50 ZAR for standard
  const subtotal = cart.reduce((acc, item) => acc + item.price * item.quantity, 0)
  const totalAmount = subtotal + shippingCost - discount

  const handleProceedToPayFast = () => {
    if (cart.length === 0) {
      alert("Your cart is empty. Please add items before proceeding to checkout.")
      return
    }
    console.log('Proceeding to PayFast')
    // Here you would typically integrate with PayFast's API
    // For now, we'll just redirect to a confirmation page
    router.push('/order-confirmation')
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
                  cart.map((item: CartItem) => (
                    <div key={item.id} className="flex items-center mb-4 pb-4 border-b last:border-b-0">
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
                  <div>
                    <Label htmlFor="fullName" className="text-lg">Full Name</Label>
                    <Input id="fullName" defaultValue={profile?.name || ''} className="mt-1 text-lg bg-white text-black" />
                  </div>
                  <div>
                    <Label htmlFor="address" className="text-lg">Address</Label>
                    <Input id="address" defaultValue={profile?.address || ''} className="mt-1 text-lg bg-white text-black" />
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="city" className="text-lg">City</Label>
                      <Input id="city" defaultValue={profile?.city || ''} className="mt-1 text-lg bg-white text-black" />
                    </div>
                    <div>
                      <Label htmlFor="postalCode" className="text-lg">Postal Code</Label>
                      <Input id="postalCode" defaultValue={profile?.postalCode || ''} className="mt-1 text-lg bg-white text-black" />
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
                    <Input id="phone" defaultValue={profile?.phone || ''} className="mt-1 text-lg bg-white text-black" />
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
                    <div>
                      <Label htmlFor="billingFullName" className="text-lg">Full Name</Label>
                      <Input id="billingFullName" className="mt-1 text-lg bg-white text-black" />
                    </div>
                    <div>
                      <Label htmlFor="billingAddress" className="text-lg">Address</Label>
                      <Input id="billingAddress" className="mt-1 text-lg bg-white text-black" />
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <Label htmlFor="billingCity" className="text-lg">City</Label>
                        <Input id="billingCity" className="mt-1 text-lg bg-white text-black" />
                      </div>
                      <div>
                        <Label htmlFor="billingPostalCode" className="text-lg">Postal Code</Label>
                        <Input id="billingPostalCode" className="mt-1 text-lg bg-white text-black" />
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

            {/* Payment Method */}
            <Card>
              <CardHeader>
                <CardTitle className="text-2xl">Payment Method</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex items-center justify-between bg-gray-100 p-4 rounded-lg">
                  <div className="flex items-center space-x-4">
                    <Image src="/images/payfast-logo.png" alt="PayFast" width={100} height={30} />
                    <span className="text-lg font-semibold">Secure payment via PayFast</span>
                  </div>
                  <Lock className="text-green-600 h-6 w-6" />
                </div>
                <p className="mt-4 text-gray-600">
                  You will be redirected to PayFast&apos;s secure checkout page to complete your payment.
                </p>
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
                I agree to the <a href="/terms" className="text-blue-600 hover:underline">Terms and Conditions</a>
              </Label>
            </div>

            {/* Proceed to PayFast Button */}
            <Button
              onClick={handleProceedToPayFast}
              disabled={!agreeToTerms || cart.length === 0}
              className="w-full bg-[#1c1c1c] text-white hover:bg-[#e87167] text-xl py-6"
            >
              Proceed to PayFast
            </Button>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  )
}

export default CheckoutPage