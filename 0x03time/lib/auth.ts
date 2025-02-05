import { prisma } from './prisma'

export async function getSessionUser(sessionId: string) {
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

  if (!session) {
    return null
  }

  // Check if session has expired
  if (session.expiresAt < new Date()) {
    await cleanupSession(sessionId)
    return null
  }

  return session.user
}

export async function cleanupSession(sessionId: string) {
  try {
    await prisma.session.delete({
      where: { id: sessionId }
    })
  } catch (error) {
    console.error('Session cleanup error:', error)
  }
}