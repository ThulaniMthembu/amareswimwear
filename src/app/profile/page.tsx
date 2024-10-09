'use client'

import React, { useState, useEffect, useCallback, useRef } from 'react'
import { useRouter } from 'next/navigation'
import { useAuth } from '@/contexts/AuthContext'
import { doc, getDoc, setDoc, collection, getDocs, addDoc } from 'firebase/firestore'
import { updateProfile, sendPasswordResetEmail } from 'firebase/auth'
import { db, storage, auth } from '@/config/firebase'
import { ref, uploadBytes, getDownloadURL } from 'firebase/storage'
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Separator } from "@/components/ui/separator"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import Navbar from '@/components/Navbar'
import { Footer } from '@/components/Footer'
import { Edit, Upload } from 'lucide-react'
import { toast } from "@/components/ui/use-toast"

interface UserProfile {
  firstName: string
  lastName: string
  email: string
  phone: string
  address: string
  city: string
  province: string
  postalCode: string
  photoURL: string
}

interface Order {
  id: string
  date: string
  items: string[]
  total: number
  status: string
}

interface Address {
  id: string
  type: 'shipping' | 'billing'
  street: string
  city: string
  state: string
  postalCode: string
}

export default function ProfilePage() {
  const { user, loading } = useAuth()
  const router = useRouter()
  const [profile, setProfile] = useState<UserProfile | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState('')
  const [isEditing, setIsEditing] = useState(false)
  const [orders, setOrders] = useState<Order[]>([])
  const [addresses, setAddresses] = useState<Address[]>([])
  const fileInputRef = useRef<HTMLInputElement>(null)
  const [isAddingAddress, setIsAddingAddress] = useState(false)
  const [newAddress, setNewAddress] = useState<Omit<Address, 'id'>>({
    type: 'shipping',
    street: '',
    city: '',
    state: '',
    postalCode: ''
  })

  const fetchUserProfile = useCallback(async () => {
    if (!user) return
    setIsLoading(true)
    try {
      const userDoc = await getDoc(doc(db, 'users', user.uid))
      if (userDoc.exists()) {
        const userData = userDoc.data() as UserProfile
        setProfile({
          ...userData,
          firstName: userData.firstName || '',
          lastName: userData.lastName || '',
          email: user.email || '',
          phone: userData.phone || '',
          address: userData.address || '',
          city: userData.city || '',
          province: userData.province || '',
          postalCode: userData.postalCode || '',
          photoURL: userData.photoURL || user.photoURL || '',
        })
      } else {
        const [firstName, lastName] = (user.displayName || '').split(' ')
        setProfile({
          firstName: firstName || '',
          lastName: lastName || '',
          email: user.email || '',
          phone: user.phoneNumber || '',
          address: '',
          city: '',
          province: '',
          postalCode: '',
          photoURL: user.photoURL || '',
        })
      }
      
      // Fetch orders
      const ordersSnapshot = await getDocs(collection(db, 'users', user.uid, 'orders'))
      const ordersData = ordersSnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as Order))
      setOrders(ordersData)

      // Fetch addresses
      const addressesSnapshot = await getDocs(collection(db, 'users', user.uid, 'addresses'))
      const addressesData = addressesSnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as Address))
      setAddresses(addressesData)

    } catch (error) {
      console.error('Error fetching user profile:', error)
      setError('Failed to load user profile. Please try again later.')
      toast({
        title: "Error",
        description: "Failed to load user profile. Please try again later.",
        variant: "destructive",
      })
    } finally {
      setIsLoading(false)
    }
  }, [user])

  useEffect(() => {
    if (loading) return
    if (!user) {
      router.push('/auth')
    } else if (!user.emailVerified) {
      router.push('/verify-email')
    } else {
      fetchUserProfile()
    }
  }, [user, loading, router, fetchUserProfile])

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target
    setProfile(prev => prev ? { ...prev, [name]: value } : null)
  }

  const handleProvinceChange = (value: string) => {
    setProfile(prev => prev ? { ...prev, province: value } : null)
  }

  const capitalizeFirstLetter = (string: string) => {
    return string.charAt(0).toUpperCase() + string.slice(1)
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!user || !profile) return

    setIsLoading(true)
    try {
      await setDoc(doc(db, 'users', user.uid), profile)
      await updateProfile(user, {
        displayName: `${profile.firstName} ${profile.lastName}`,
        photoURL: profile.photoURL,
      })
      toast({
        title: "Success",
        description: "Profile updated successfully!",
      })
      setIsEditing(false)
    } catch (error) {
      console.error('Error updating profile:', error)
      toast({
        title: "Error",
        description: "Failed to update profile. Please try again.",
        variant: "destructive",
      })
    } finally {
      setIsLoading(false)
    }
  }

  const handleEditClick = () => {
    setIsEditing(true)
  }

  const handleUploadClick = () => {
    fileInputRef.current?.click()
  }

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file || !user) return

    setIsLoading(true)
    try {
      const storageRef = ref(storage, `profile_pictures/${user.uid}`)
      await uploadBytes(storageRef, file)
      const downloadURL = await getDownloadURL(storageRef)
      setProfile(prev => prev ? { ...prev, photoURL: downloadURL } : null)
      await updateProfile(user, { photoURL: downloadURL })
      toast({
        title: "Success",
        description: "Profile picture updated successfully!",
      })
    } catch (error) {
      console.error('Error uploading profile picture:', error)
      toast({
        title: "Error",
        description: "Failed to upload profile picture. Please try again.",
        variant: "destructive",
      })
    } finally {
      setIsLoading(false)
    }
  }

  const handlePasswordReset = async () => {
    if (!user?.email) return
    try {
      await sendPasswordResetEmail(auth, user.email)
      toast({
        title: "Success",
        description: "Password reset email sent. Check your inbox.",
      })
    } catch (error) {
      console.error('Error sending password reset email:', error)
      toast({
        title: "Error",
        description: "Failed to send password reset email. Please try again.",
        variant: "destructive",
      })
    }
  }

  const handleAddAddress = async () => {
    if (!user) return
    try {
      const docRef = await addDoc(collection(db, 'users', user.uid, 'addresses'), newAddress)
      setAddresses([...addresses, { id: docRef.id, ...newAddress }])
      setIsAddingAddress(false)
      setNewAddress({ type: 'shipping', street: '', city: '', state: '', postalCode: '' })
      toast({
        title: "Success",
        description: "Address added successfully!",
      })
    } catch (error) {
      console.error('Error adding address:', error)
      toast({
        title: "Error",
        description: "Failed to add address. Please try again.",
        variant: "destructive",
      })
    }
  }

  if (loading || isLoading) {
    return (
      <div className="flex flex-col min-h-screen bg-[#fafaff]">
        <Navbar />
        <main className="flex-grow container mx-auto px-4 py-8 flex items-center justify-center">
          <p className="text-xl text-[#1c1c1c]">Loading...</p>
        </main>
        <Footer />
      </div>
    )
  }

  if (!user || !profile) {
    return (
      <div className="flex flex-col min-h-screen bg-[#fafaff]">
        <Navbar />
        <main className="flex-grow container mx-auto px-4 py-8 flex items-center justify-center">
          <p className="text-xl text-[#1c1c1c]">Error loading profile. Please try again later.</p>
        </main>
        <Footer />
      </div>
    )
  }

  return (
    <div className="flex flex-col min-h-screen bg-[#fafaff]">
      <Navbar />
      <main className="flex-grow container mx-auto px-4 py-8">
        <Card className="w-full max-w-4xl mx-auto">
          <CardHeader className="flex flex-col sm:flex-row items-center justify-between">
            <div className="flex items-center mb-4 sm:mb-0">
              <Avatar className="h-24 w-24">
                <AvatarImage src={profile.photoURL} alt={`${profile.firstName} ${profile.lastName}`} />
                <AvatarFallback>{profile.firstName ? profile.firstName.charAt(0) : 'U'}</AvatarFallback>
              </Avatar>
              <div className="ml-4">
                <CardTitle className="text-2xl font-bold text-[#1c1c1c]">{`${profile.firstName} ${profile.lastName}`}</CardTitle>
                <CardDescription className="text-[#4a4a4a]">{profile.email}</CardDescription>
                <CardDescription className="text-[#4a4a4a]">{profile.phone || 'No phone number'}</CardDescription>
              </div>
            </div>
            <div className="flex space-x-2">
              <Input
                ref={fileInputRef}
                type="file"
                className="hidden"
                onChange={handleFileUpload}
                accept="image/*"
              />
              <Button
                onClick={handleUploadClick}
                variant="outline"
                size="icon"
                disabled={isLoading}
              >
                <Upload className="h-4 w-4" />
                <span className="sr-only">Upload profile picture</span>
              </Button>
              <Button
                onClick={handleEditClick}
                variant="outline"
                size="icon"
                disabled={isLoading}
              >
                <Edit className="h-4 w-4" />
                <span className="sr-only">Edit profile</span>
              </Button>
            </div>
          </CardHeader>
          <CardContent>
            <Tabs defaultValue="account" className="w-full">
              <TabsList className="grid w-full grid-cols-4">
                <TabsTrigger 
                  value="account"
                  className="data-[state=active]:bg-[#1c1c1c] data-[state=active]:text-white data-[state=inactive]:bg-[#e0e0e0] data-[state=inactive]:text-[#1c1c1c] data-[state=inactive]:hover:bg-[#e87167] data-[state=inactive]:hover:text-white"
                >
                  Account
                </TabsTrigger>
                <TabsTrigger 
                  value="orders"
                  className="data-[state=active]:bg-[#1c1c1c] data-[state=active]:text-white data-[state=inactive]:bg-[#e0e0e0] data-[state=inactive]:text-[#1c1c1c] data-[state=inactive]:hover:bg-[#e87167] data-[state=inactive]:hover:text-white"
                >
                  Orders
                </TabsTrigger>
                <TabsTrigger 
                  value="addresses"
                  className="data-[state=active]:bg-[#1c1c1c] data-[state=active]:text-white data-[state=inactive]:bg-[#e0e0e0] data-[state=inactive]:text-[#1c1c1c] data-[state=inactive]:hover:bg-[#e87167] data-[state=inactive]:hover:text-white"
                >
                  Addresses
                </TabsTrigger>
                <TabsTrigger 
                  value="security"
                  className="data-[state=active]:bg-[#1c1c1c] data-[state=active]:text-white data-[state=inactive]:bg-[#e0e0e0] data-[state=inactive]:text-[#1c1c1c] data-[state=inactive]:hover:bg-[#e87167] data-[state=inactive]:hover:text-white"
                >
                  Security
                </TabsTrigger>
              </TabsList>
              <TabsContent value="account">
                <form onSubmit={handleSubmit} className="space-y-4">
                  <div>
                    <Label htmlFor="firstName" className="text-[#1c1c1c]">First Name</Label>
                    <Input
                      id="firstName"
                      name="firstName"
                      value={profile.firstName}
                      onChange={(e) => {
                        e.target.value = capitalizeFirstLetter(e.target.value)
                        handleInputChange(e)
                      }}
                      className="bg-white border-[#1c1c1c] text-[#1c1c1c]"
                      disabled={!isEditing}
                      aria-label="First Name"
                    />
                  </div>
                  <div>
                    <Label htmlFor="lastName" className="text-[#1c1c1c]">Last Name</Label>
                    <Input
                      id="lastName"
                      name="lastName"
                      value={profile.lastName}
                      onChange={(e) => {
                        e.target.value = capitalizeFirstLetter(e.target.value)
                        handleInputChange(e)
                      }}
                      className="bg-white border-[#1c1c1c] text-[#1c1c1c]"
                      disabled={!isEditing}
                      aria-label="Last Name"
                    />
                  </div>
                  <div>
                    <Label htmlFor="email" className="text-[#1c1c1c]">Email</Label>
                    <Input
                      id="email"
                      name="email"
                      value={profile.email}
                      onChange={handleInputChange}
                      className="bg-white border-[#1c1c1c] text-[#1c1c1c]"
                      disabled
                      aria-label="Email"
                    />
                  </div>
                  <div>
                    <Label htmlFor="phone" className="text-[#1c1c1c]">Phone Number</Label>
                    <Input
                      id="phone"
                      name="phone"
                      value={profile.phone}
                      onChange={handleInputChange}
                      className="bg-white border-[#1c1c1c] text-[#1c1c1c]"
                      disabled={!isEditing}
                      aria-label="Phone Number"
                    />
                  </div>
                  <div>
                    <Label htmlFor="address" className="text-[#1c1c1c]">Address</Label>
                    <Input
                      id="address"
                      name="address"
                      value={profile.address}
                      onChange={handleInputChange}
                      className="bg-white border-[#1c1c1c] text-[#1c1c1c]"
                      disabled={!isEditing}
                      aria-label="Address"
                    />
                  </div>
                  <div>
                    <Label htmlFor="city" className="text-[#1c1c1c]">City</Label>
                    <Input
                      id="city"
                      name="city"
                      value={profile.city}
                      onChange={handleInputChange}
                      className="bg-white border-[#1c1c1c] text-[#1c1c1c]"
                      disabled={!isEditing}
                      aria-label="City"
                    />
                  </div>
                  <div>
                    <Label htmlFor="province" className="text-[#1c1c1c]">Province</Label>
                    <Select 
                      defaultValue={profile.province}
                      onValueChange={handleProvinceChange}
                      disabled={!isEditing}
                    >
                      <SelectTrigger id="province" className="bg-white border-[#1c1c1c] text-[#1c1c1c]">
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
                    <Label htmlFor="postalCode" className="text-[#1c1c1c]">Postal Code</Label>
                    <Input
                      id="postalCode"
                      name="postalCode"
                      value={profile.postalCode}
                      onChange={handleInputChange}
                      className="bg-white border-[#1c1c1c] text-[#1c1c1c]"
                      disabled={!isEditing}
                      aria-label="Postal Code"
                    />
                  </div>
                  {isEditing && (
                    <Button type="submit" className="w-full bg-[#1c1c1c] text-white hover:bg-[#e87167]">
                      Save Changes
                    </Button>
                  )}
                </form>
              </TabsContent>
              <TabsContent value="orders">
                <div className="space-y-4">
                  {orders.length > 0 ? (
                    orders.map((order) => (
                      <Card key={order.id}>
                        <CardHeader>
                          <CardTitle>Order #{order.id}</CardTitle>
                          <CardDescription>Date: {order.date}</CardDescription>
                        </CardHeader>
                        <CardContent>
                          <p>Items: {order.items.join(', ')}</p>
                          <p>Total: ${order.total.toFixed(2)}</p>
                          <p>Status: {order.status}</p>
                        </CardContent>
                      </Card>
                    ))
                  ) : (
                    <p>No orders found.</p>
                  )}
                </div>
              </TabsContent>
              <TabsContent value="addresses">
                <div className="space-y-4">
                  {addresses.map((address) => (
                    <Card key={address.id}>
                      <CardHeader>
                        <CardTitle>{address.type === 'shipping' ? 'Shipping' : 'Billing'} Address</CardTitle>
                      </CardHeader>
                      <CardContent>
                        <p>{address.street}</p>
                        <p>{address.city}, {address.state} {address.postalCode}</p>
                      </CardContent>
                    </Card>
                  ))}
                  {isAddingAddress ? (
                    <Card>
                      <CardHeader>
                        <CardTitle>Add New Address</CardTitle>
                      </CardHeader>
                      <CardContent>
                        <form onSubmit={(e) => { e.preventDefault(); handleAddAddress(); }} className="space-y-4">
                          <div>
                            <Label htmlFor="addressType">Address Type</Label>
                            <Select
                              onValueChange={(value) => setNewAddress({ ...newAddress, type: value as 'shipping' | 'billing' })}
                            >
                              <SelectTrigger>
                                <SelectValue placeholder="Select address type" />
                              </SelectTrigger>
                              <SelectContent>
                                <SelectItem value="shipping">Shipping</SelectItem>
                                <SelectItem value="billing">Billing</SelectItem>
                              </SelectContent>
                            </Select>
                          </div>
                          <div>
                            <Label htmlFor="street">Street</Label>
                            <Input
                              id="street"
                              value={newAddress.street}
                              onChange={(e) => setNewAddress({ ...newAddress, street: e.target.value })}
                              required
                            />
                          </div>
                          <div>
                            <Label htmlFor="city">City</Label>
                            <Input
                              id="city"
                              value={newAddress.city}
                              onChange={(e) => setNewAddress({ ...newAddress, city: e.target.value })}
                              required
                            />
                          </div>
                          <div>
                            <Label htmlFor="state">State</Label>
                            <Input
                              id="state"
                              value={newAddress.state}
                              onChange={(e) => setNewAddress({ ...newAddress, state: e.target.value })}
                              required
                            />
                          </div>
                          <div>
                            <Label htmlFor="postalCode">Postal Code</Label>
                            <Input
                              id="postalCode"
                              value={newAddress.postalCode}
                              onChange={(e) => setNewAddress({ ...newAddress, postalCode: e.target.value })}
                              required
                            />
                          </div>
                          <Button type="submit">Add Address</Button>
                        </form>
                      </CardContent>
                    </Card>
                  ) : (
                    <Button onClick={() => setIsAddingAddress(true)}>Add New Address</Button>
                  )}
                </div>
              </TabsContent>
              <TabsContent value="security">
                <div className="space-y-4">
                  <h3 className="text-lg font-semibold">Password</h3>
                  <p>For your security, we don&apos;t display your password. You can reset it if needed.</p>
                  <Button onClick={handlePasswordReset}>Reset Password</Button>
                  <Separator />
                  <h3 className="text-lg font-semibold">Two-Factor Authentication</h3>
                  <p>Enhance your account security by enabling two-factor authentication.</p>
                  <Button>Enable 2FA</Button>
                </div>
              </TabsContent>
            </Tabs>
          </CardContent>
          <CardFooter>
            {error && <p className="text-center text-red-500" role="alert">{error}</p>}
          </CardFooter>
        </Card>
      </main>
      <Footer />
    </div>
  )
}