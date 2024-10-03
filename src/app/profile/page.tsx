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

interface UserProfile {
  name: string
  email: string
  phone: string
  address: string
  city: string
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

const ProfilePage: React.FC = () => {
  const { user, loading } = useAuth()
  const router = useRouter()
  const [profile, setProfile] = useState<UserProfile | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState('')
  const [successMessage, setSuccessMessage] = useState('')
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
        setProfile(userDoc.data() as UserProfile)
      } else {
        setProfile({
          name: user.displayName || '',
          email: user.email || '',
          phone: '',
          address: '',
          city: '',
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
    } finally {
      setIsLoading(false)
    }
  }, [user])

  useEffect(() => {
    if (loading) return
    if (!user) {
      router.push('/auth')
    } else {
      fetchUserProfile()
    }
  }, [user, loading, router, fetchUserProfile])

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target
    setProfile(prev => prev ? { ...prev, [name]: value } : null)
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')
    setSuccessMessage('')
    if (!user || !profile) return
    try {
      const userDocRef = doc(db, 'users', user.uid)
      await setDoc(userDocRef, profile, { merge: true })
      await updateProfile(user, { displayName: profile.name })
      setSuccessMessage('Profile updated successfully')
      setIsEditing(false)
    } catch (error) {
      console.error('Error updating profile:', error)
      setError('Failed to update profile. Please try again.')
    }
  }

  const handleUploadClick = () => {
    fileInputRef.current?.click()
  }

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file && user) {
      const storageRef = ref(storage, `profile_pictures/${user.uid}`)
      try {
        setIsLoading(true)
        await uploadBytes(storageRef, file)
        const downloadURL = await getDownloadURL(storageRef)
        setProfile(prev => prev ? { ...prev, photoURL: downloadURL } : null)
        await updateProfile(user, { photoURL: downloadURL })
        setSuccessMessage('Profile picture updated successfully')
      } catch (error) {
        console.error('Error uploading file:', error)
        setError('Failed to upload profile picture. Please try again.')
      } finally {
        setIsLoading(false)
      }
    }
  }

  const handleEditClick = () => {
    setIsEditing(!isEditing)
  }

  const handleResetPassword = async () => {
    if (!user || !user.email) return
    try {
      await sendPasswordResetEmail(auth, user.email)
      setSuccessMessage('Password reset email sent. Please check your inbox.')
    } catch (error) {
      console.error('Error sending password reset email:', error)
      setError('Failed to send password reset email. Please try again.')
    }
  }

  const handleAddNewAddress = () => {
    setIsAddingAddress(true)
  }

  const handleNewAddressChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target
    setNewAddress(prev => ({ ...prev, [name]: value }))
  }

  const handleNewAddressTypeChange = (value: 'shipping' | 'billing') => {
    setNewAddress(prev => ({ ...prev, type: value }))
  }

  const handleSubmitNewAddress = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!user) return
    try {
      const addressesRef = collection(db, 'users', user.uid, 'addresses')
      const docRef = await addDoc(addressesRef, newAddress)
      const newAddressWithId = { id: docRef.id, ...newAddress }
      setAddresses(prev => [...prev, newAddressWithId])
      setIsAddingAddress(false)
      setNewAddress({
        type: 'shipping',
        street: '',
        city: '',
        state: '',
        postalCode: ''
      })
      setSuccessMessage('New address added successfully')
    } catch (error) {
      console.error('Error adding new address:', error)
      setError('Failed to add new address. Please try again.')
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
                <AvatarImage src={profile.photoURL} alt={profile.name} />
                <AvatarFallback>{profile.name ? profile.name.charAt(0) : 'U'}</AvatarFallback>
              </Avatar>
              <div className="ml-4">
                <CardTitle className="text-2xl font-bold text-[#1c1c1c]">{profile.name || 'User'}</CardTitle>
                <CardDescription className="text-[#4a4a4a]">{profile.email}</CardDescription>
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
                    <Label htmlFor="name" className="text-[#1c1c1c]">Full Name</Label>
                    <Input
                      id="name"
                      name="name"
                      value={profile.name}
                      onChange={handleInputChange}
                      className="bg-white border-[#1c1c1c] text-[#1c1c1c]"
                      disabled={!isEditing}
                      aria-label="Full Name"
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
                          <CardDescription>{order.date}</CardDescription>
                        </CardHeader>
                        <CardContent>
                          <p>Items: {order.items.join(', ')}</p>
                          <p>Total: ${order.total.toFixed(2)}</p>
                          <p>Status: {order.status}</p>
                        </CardContent>
                        <CardFooter>
                          <Button variant="outline">Track Order</Button>
                        </CardFooter>
                      </Card>
                    ))
                  ) : (
                    <p className="text-center text-[#4a4a4a]">No orders found.</p>
                  )}
                </div>
              </TabsContent>
              <TabsContent value="addresses">
                <div className="space-y-4">
                  {addresses.length > 0 ? (
                    addresses.map((address) => (
                      <Card key={address.id}>
                        <CardHeader>
                          <CardTitle>{address.type.charAt(0).toUpperCase() + address.type.slice(1)} Address</CardTitle>
                        </CardHeader>
                        <CardContent>
                          <p>{address.street}</p>
                          <p>{address.city}, {address.state} {address.postalCode}</p>
                        </CardContent>
                        <CardFooter>
                          <Button variant="outline">Edit</Button>
                        </CardFooter>
                      </Card>
                    ))
                  ) : (
                    <p className="text-center text-[#4a4a4a]">No addresses found.</p>
                  )}
                  {isAddingAddress ? (
                    <form onSubmit={handleSubmitNewAddress} className="space-y-4">
                      <Select
                        value={newAddress.type}
                        onValueChange={handleNewAddressTypeChange}
                      >
                        <SelectTrigger className="w-full">
                          <SelectValue placeholder="Select address type" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="shipping">Shipping</SelectItem>
                          <SelectItem value="billing">Billing</SelectItem>
                        </SelectContent>
                      </Select>
                      <Input
                        name="street"
                        value={newAddress.street}
                        onChange={handleNewAddressChange}
                        placeholder="Street"
                        className="bg-white border-[#1c1c1c] text-[#1c1c1c]"
                      />
                      <Input
                        name="city"
                        value={newAddress.city}
                        onChange={handleNewAddressChange}
                        placeholder="City"
                        className="bg-white border-[#1c1c1c] text-[#1c1c1c]"
                      />
                      <Input
                        name="state"
                        value={newAddress.state}
                        onChange={handleNewAddressChange}
                        placeholder="State"
                        className="bg-white border-[#1c1c1c] text-[#1c1c1c]"
                      />
                      <Input
                        name="postalCode"
                        value={newAddress.postalCode}
                        onChange={handleNewAddressChange}
                        placeholder="Postal Code"
                        className="bg-white border-[#1c1c1c] text-[#1c1c1c]"
                      />
                      <Button type="submit" className="w-full bg-[#1c1c1c] text-white hover:bg-[#e87167]">
                        Save New Address
                      </Button>
                      <Button onClick={() => setIsAddingAddress(false)} variant="outline" className="w-full">
                        Cancel
                      </Button>
                    </form>
                  ) : (
                    <Button onClick={handleAddNewAddress} className="w-full bg-[#1c1c1c] text-white hover:bg-[#e87167]">
                      Add New Address
                    </Button>
                  )}
                </div>
              </TabsContent>
              <TabsContent value="security">
                <div className="space-y-4">
                  <h3 className="text-lg font-semibold text-[#1c1c1c]">Change Password</h3>
                  <Button 
                    onClick={handleResetPassword}
                    className="w-full bg-[#1c1c1c] text-white hover:bg-[#e87167]"
                  >
                    Reset Password
                  </Button>
                  <Separator />
                  <h3 className="text-lg font-semibold text-[#1c1c1c]">Login Method</h3>
                  <p className="text-[#4a4a4a]">
                    {user?.providerData[0]?.providerId === 'google.com' 
                      ? 'Logged in with Google' 
                      : 'Email and Password'}
                  </p>
                </div>
              </TabsContent>
            </Tabs>
          </CardContent>
          <CardFooter>
            {error && <p className="text-center text-red-500" role="alert">{error}</p>}
            {successMessage && <p className="text-center text-green-500" role="alert">{successMessage}</p>}
          </CardFooter>
        </Card>
      </main>
      <Footer />
    </div>
  )
}

export default ProfilePage