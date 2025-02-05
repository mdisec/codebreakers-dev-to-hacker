'use client'

import Link from 'next/link'
import { useEffect, useState } from 'react'
import { useRouter, usePathname } from 'next/navigation'

interface UserProfile {
  name: string | null
  email: string
}

export default function Navigation() {
  const [isLoggedIn, setIsLoggedIn] = useState(false)
  const [profile, setProfile] = useState<UserProfile | null>(null)
  const router = useRouter()
  const pathname = usePathname()

  const checkAuthStatus = async () => {
    try {
      const res = await fetch('/api/user/profile')
      if (res.ok) {
        const data = await res.json()
        setIsLoggedIn(true)
        setProfile(data)
      } else {
        setIsLoggedIn(false)
        setProfile(null)
      }
    } catch (err) {
      setIsLoggedIn(false)
      setProfile(null)
    }
  }

  useEffect(() => {
    checkAuthStatus()
  }, [pathname])

  const handleLogout = async () => {
    try {
      const res = await fetch('/api/auth/logout', {
        method: 'POST'
      })

      if (res.ok) {
        setIsLoggedIn(false)
        setProfile(null)
        router.replace('/login')
      }
    } catch (err) {
      console.error('Logout error:', err)
    }
  }

  return (
    <nav className="bg-white shadow-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16 items-center">
          <Link href="/" className="text-xl font-semibold text-gray-800">
            Home
          </Link>
          <div className="flex gap-4 items-center">
            {isLoggedIn && profile ? (
              <>
                <span className="text-gray-600">
                  Welcome, {profile.name || profile.email}!
                </span>
                <Link
                  href="/dashboard"
                  className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-gray-700 bg-gray-50 hover:bg-gray-100"
                >
                  Dashboard
                </Link>
                <button
                  onClick={handleLogout}
                  className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-red-600 hover:bg-red-700"
                >
                  Logout
                </button>
              </>
            ) : (
              <>
                <Link
                  href="/login"
                  className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-gray-700 bg-gray-50 hover:bg-gray-100"
                >
                  Login
                </Link>
                <Link
                  href="/register"
                  className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700"
                >
                  Register
                </Link>
              </>
            )}
          </div>
        </div>
      </div>
    </nav>
  )
} 