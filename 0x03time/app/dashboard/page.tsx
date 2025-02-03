'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'

export default function DashboardPage() {
  const router = useRouter()
  const [userName, setUserName] = useState('')

  useEffect(() => {
    // Check if user is logged in
    const token = localStorage.getItem('token')
    if (!token) {
      router.push('/login')
      return
    }

    // Get user data
    const userData = localStorage.getItem('userData')
    if (userData) {
      const { name, email } = JSON.parse(userData)
      setUserName(name || email)
    }
  }, [router])

  return (
    <div className="min-h-[calc(100vh-64px)] p-8">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-3xl font-bold mb-6">Dashboard</h1>
        <div className="bg-white rounded-lg shadow-sm p-6">
          <h2 className="text-xl font-semibold mb-4">Welcome back, {userName}!</h2>
          <p className="text-gray-600">
            This is your personal dashboard where you can manage your account and access your training materials.
          </p>
        </div>
      </div>
    </div>
  )
} 