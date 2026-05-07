export function calculateLevel(points) {
  if (points >= 1000) return 5
  if (points >= 600) return 4
  if (points >= 300) return 3
  if (points >= 100) return 2
  return 1
}

async function isDuplicateActivity(userId, type, activityId, prismaClient) {
  if (type === 'QUIZ') {
    const existing = await prismaClient.submission.findFirst({
      where: { userId, quizId: activityId },
    })
    return !!existing
  }

  const existing = await prismaClient.activityLog.findFirst({
    where: { userId, type: 'GAME', activityId },
  })
  return !!existing
}

export async function postActivityService(userId, type, activityId, points, prismaClient) {
  const duplicate = await isDuplicateActivity(userId, type, activityId, prismaClient)
  if (duplicate) {
    const user = await prismaClient.user.findUnique({ where: { id: userId } })
    return { points: user.points, level: user.level, duplicate: true }
  }

  await prismaClient.activityLog.create({
    data: { userId, type, activityId, points },
  })

  const updatedUser = await prismaClient.user.update({
    where: { id: userId },
    data: {
      points: { increment: points },
    },
  })

  const newLevel = calculateLevel(updatedUser.points)
  if (newLevel !== updatedUser.level) {
    await prismaClient.user.update({
      where: { id: userId },
      data: { level: newLevel },
    })
    updatedUser.level = newLevel
  }

  return { points: updatedUser.points, level: updatedUser.level, duplicate: false }
}
