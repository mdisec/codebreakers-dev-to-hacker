import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { cookies } from 'next/headers'
import { getSessionUser } from '@/lib/auth'
import { cleanupSession } from '@/lib/auth'

export async function POST() {
  try {
    const cookieStore = await cookies()
    const sessionId = cookieStore.get('sessionId')?.value

    if (sessionId) {
      await cleanupSession(sessionId)
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