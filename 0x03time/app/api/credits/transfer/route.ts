import { NextResponse } from 'next/server'
import { cookies } from 'next/headers'
import { prisma } from '@/lib/prisma'
import { getSessionUser } from '@/lib/auth'

export async function POST(req: Request) {
  try {
    // Get the current user's session
    const sessionId = (await cookies()).get('sessionId')?.value
    if (!sessionId) {
      return NextResponse.json(
        { error: 'No session found' },
        { status: 401 }
      )
    }

    const user = await getSessionUser(sessionId)
    if (!user) {
      return NextResponse.json(
        { error: 'Session expired' },
        { status: 401 }
      )
    }
    

    // Get transfer details from request body
    const { recipientEmail, amount } = await req.json()

    // Validate input
    if (!recipientEmail || !amount || amount <= 0) {
      return NextResponse.json(
        { error: 'Invalid transfer details' },
        { status: 400 }
      )
    }

    // Find recipient
    const recipient = await prisma.user.findUnique({
      where: { email: recipientEmail }
    })

    if (!recipient) {
      return NextResponse.json(
        { error: 'Recipient not found' },
        { status: 404 }
      )
    }

    // Check if sender has enough credits
    if (user.credits < amount) {
      return NextResponse.json(
        { error: 'Insufficient credits' },
        { status: 400 }
      )
    }

    // Perform the transfer in a transaction
    const transfer = await prisma.$transaction(async (tx) => {
      // Deduct from sender
      const updatedSender = await tx.user.update({
        where: { id: user.id },
        data: { credits: { decrement: amount } }
      })

      // Add to recipient
      const updatedRecipient = await tx.user.update({
        where: { id: recipient.id },
        data: { credits: { increment: amount } }
      })

      return { updatedSender, updatedRecipient }
    })

    return NextResponse.json({
      success: true,
      newBalance: transfer.updatedSender.credits
    })

  } catch (error) {
    console.error('Transfer error:', error)
    return NextResponse.json(
      { error: 'Something went wrong' },
      { status: 500 }
    )
  }
} 