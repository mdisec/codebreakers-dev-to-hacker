import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { cookies } from 'next/headers'

export async function POST() {
  try {
    const sessionId = cookies().get('sessionId')?.value

    if (sessionId) {
      // Delete the session from the database
      await prisma.session.delete({
        where: { id: sessionId }
      })

      // Clear the session cookie
      cookies().delete('sessionId')
    }

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error('Logout error:', error)
    return NextResponse.json(
      { error: 'Something went wrong' },
      { status: 500 }
    )
  }
} 