import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { cookies } from 'next/headers'

export async function GET(req: Request) {
  try {
    // Get session ID from cookies
    const sessionId = (await cookies()).get('sessionId')?.value

    if (!sessionId) {
      return NextResponse.json(
        { error: 'Not authenticated' },
        { status: 401 }
      )
    }

    // Find valid session
    const session = await prisma.session.findUnique({
      where: { id: sessionId },
      include: {
        user: {
          select: {
            id: true,
            email: true,
            name: true,
            credits: true
          }
        }
      }
    })

    // Check if session exists and hasn't expired
    if (!session || session.expiresAt < new Date()) {
      // Delete expired session if it exists
      if (session) {
        await prisma.session.delete({
          where: { id: sessionId }
        })
      }
      
      // Clear the cookie
      (await cookies()).delete('sessionId')
      
      return NextResponse.json(
        { error: 'Session expired' },
        { status: 401 }
      )
    }

    return NextResponse.json(session.user)
  } catch (error) {
    console.error('Profile fetch error:', error)
    return NextResponse.json(
      { error: 'Something went wrong' },
      { status: 500 }
    )
  }
} 