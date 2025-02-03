import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import bcrypt from 'bcryptjs'
import { cookies } from 'next/headers'

// Session will expire in 24 hours
const SESSION_EXPIRY_HOURS = 24

export async function POST(req: Request) {
  try {
    const { email, password } = await req.json()
    const cookieStore = await cookies()

    if (!email || !password) {
      return NextResponse.json(
        { error: 'Email and password are required' },
        { status: 400 }
      )
    }

    // Find user
    const user = await prisma.user.findUnique({
      where: { email },
      select: {
        id: true,
        email: true,
        password: true,
        name: true,
        credits: true
      }
    })

    if (!user) {
      return NextResponse.json(
        { error: 'Invalid credentials' },
        { status: 401 }
      )
    }

    // Verify password
    const isValidPassword = await bcrypt.compare(password, user.password)

    if (!isValidPassword) {
      return NextResponse.json(
        { error: 'Invalid credentials' },
        { status: 401 }
      )
    }

    // Create a new session
    const session = await prisma.session.create({
      data: {
        userId: user.id,
        expiresAt: new Date(Date.now() + SESSION_EXPIRY_HOURS * 60 * 60 * 1000)
      }
    })

    // Set session cookie
    cookieStore.set('sessionId', session.id, {
      httpOnly: true,
      secure: false, // spend 2 hours this ffs! mdifuck! process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      expires: new Date(Date.now() + SESSION_EXPIRY_HOURS * 60 * 60 * 1000)
    })

    // Remove password from response
    const { password: _, ...userWithoutPassword } = user

    return NextResponse.json({
      user: userWithoutPassword
    })
  } catch (error) {
    console.error('Login error:', error)
    return NextResponse.json(
      { error: 'Something went wrong' },
      { status: 500 }
    )
  }
} 