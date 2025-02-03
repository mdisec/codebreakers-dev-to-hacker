'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import CreditTransfer from '../components/CreditTransfer'

interface UserProfile {
  name: string | null
  email: string
  credits: number
}


export default function DashboardPage() {
  const router = useRouter()
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [profile, setProfile] = useState<UserProfile | null>(null)

  const refreshProfile = async () => {
    try {
      const res = await fetch('/api/user/profile')
      if (res.ok) {
        const data = await res.json()
        setProfile(data)
      }
    } catch (err) {
      console.error('Profile refresh error:', err)
    }
  }

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const res = await fetch('/api/user/profile')

        if (!res.ok) {
          if (res.status === 401) {
            router.push('/login')
            return
          }
          throw new Error('Failed to fetch profile')
        }

        const data = await res.json()
        setProfile(data)
      } catch (err) {
        setError('Failed to load profile data')
        console.error('Profile fetch error:', err)
      } finally {
        setLoading(false)
      }
    }

    fetchProfile()
  }, [router])

  if (loading) {
    return (
      <div className="min-h-[calc(100vh-64px)] flex items-center justify-center">
        <div className="text-gray-600">Loading...</div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="min-h-[calc(100vh-64px)] flex items-center justify-center">
        <div className="text-red-600">{error}</div>
      </div>
    )
  }

  if (!profile) {
    return null
  }

  return (
    <div className="min-h-[calc(100vh-64px)] p-8">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-3xl font-bold mb-6">Dashboard</h1>
        <div className="bg-white rounded-lg shadow-sm p-6 mb-6">
          <h2 className="text-xl font-semibold mb-4">
            Welcome back, {profile.name || profile.email}!
          </h2>
          <div className="space-y-2 text-gray-600">
            <p>
              <span className="font-medium">Email:</span> {profile.email}
            </p>
            {profile.name && (
              <p>
                <span className="font-medium">Name:</span> {profile.name}
              </p>
            )}
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-sm p-6">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-lg font-semibold text-gray-900">Account Credits</h3>
              <p className="text-gray-500">Available credits for training materials</p>
            </div>
            <div className="bg-blue-50 px-4 py-2 rounded-lg">
              <span className="text-2xl font-bold text-blue-600">{profile.credits}</span>
              <span className="text-blue-600 ml-1">credits</span>
            </div>
          </div>
        </div>   
        <CreditTransfer onTransferComplete={refreshProfile} />
      </div>
    </div>


  )
} 