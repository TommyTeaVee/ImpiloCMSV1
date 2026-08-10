const prisma = require("../lib/prisma");


// ==================================================
// QUIZ REWARD SETTINGS
// ==================================================

const QUIZ_COMPLETION_BONUS = 10;
const QUIZ_PASS_BONUS = 10;


// ==================================================
// ACHIEVEMENTS
// ==================================================

const ACHIEVEMENTS = {
  FIRST_QUIZ: {
    code: "FIRST_QUIZ",
    name: "First Quiz",
    description:
      "Completed your first IMPILO quiz.",
    points: 25
  },

  PERFECT_QUIZ: {
    code: "PERFECT_QUIZ",
    name: "Perfect Score",
    description:
      "Scored 100% on an IMPILO quiz.",
    points: 50
  },

  QUIZ_MASTER: {
    code: "QUIZ_MASTER",
    name: "Quiz Master",
    description:
      "Completed five different IMPILO quizzes.",
    points: 100
  }
};


// ==================================================
// REWARD QUIZ COMPLETION
// ==================================================

async function rewardQuizCompletion(
  tx,
  {
    userId,
    quizId,
    attemptId,
    score,
    percentage,
    passed
  }
) {

  // =================================================
  // CALCULATE QUIZ POINTS
  // =================================================

  const quizPoints =
    Math.max(
      Number(score) || 0,
      0
    );


  const completionBonus =
    QUIZ_COMPLETION_BONUS;


  const passingBonus =
    passed
      ? QUIZ_PASS_BONUS
      : 0;


  const totalPoints =
    quizPoints +
    completionBonus +
    passingBonus;


  // =================================================
  // CREATE MAIN POINT TRANSACTION
  // =================================================

  await tx.pointsTransaction.create({
    data: {
      userId,

      points:
        totalPoints,

      reason:
        passed
          ? `Quiz completed and passed (${percentage}%)`
          : `Quiz completed (${percentage}%)`,

      eventId:
        attemptId
    }
  });


  // =================================================
  // QUIZ COMPLETED EVENT
  // =================================================

  await tx.readerEvent.create({
    data: {
      userId,

      type:
        "QUIZ_COMPLETED",

      metadata: {
        quizId,
        attemptId,

        score:
          quizPoints,

        percentage,

        passed,

        pointsEarned:
          totalPoints
      }
    }
  });


  // =================================================
  // UNIQUE QUIZZES COMPLETED
  // =================================================

  const completedQuizzes =
    await tx.quizAttempt.findMany({
      where: {
        userId
      },

      select: {
        quizId: true
      },

      distinct: [
        "quizId"
      ]
    });


  const completedQuizCount =
    completedQuizzes.length;


  // =================================================
  // ACHIEVEMENT HELPER
  // =================================================

  async function awardAchievement(
    achievementDefinition
  ) {

    // -----------------------------------------------
    // CREATE ACHIEVEMENT IF IT DOESN'T EXIST
    // -----------------------------------------------

    const achievement =
      await tx.achievement.upsert({
        where: {
          code:
            achievementDefinition.code
        },

        update: {},

        create: {
          code:
            achievementDefinition.code,

          name:
            achievementDefinition.name,

          description:
            achievementDefinition.description,

          points:
            achievementDefinition.points
        }
      });


    // -----------------------------------------------
    // CHECK WHETHER USER ALREADY HAS IT
    // -----------------------------------------------

    const existing =
      await tx.readerAchievement.findUnique({
        where: {
          userId_achievementId: {
            userId,

            achievementId:
              achievement.id
          }
        }
      });


    if (existing) {
      return null;
    }


    // -----------------------------------------------
    // AWARD ACHIEVEMENT
    // -----------------------------------------------

    const readerAchievement =
      await tx.readerAchievement.create({
        data: {
          userId,

          achievementId:
            achievement.id
        }
      });


    // -----------------------------------------------
    // ACHIEVEMENT POINTS
    // -----------------------------------------------

    await tx.pointsTransaction.create({
      data: {
        userId,

        points:
          achievement.points,

        reason:
          `Achievement earned: ${achievement.name}`,

        eventId:
          readerAchievement.id
      }
    });


    // -----------------------------------------------
    // ACHIEVEMENT EVENT
    // -----------------------------------------------

    await tx.readerEvent.create({
      data: {
        userId,

        type:
          "ACHIEVEMENT_EARNED",

        metadata: {
          achievementId:
            achievement.id,

          code:
            achievement.code,

          name:
            achievement.name,

          points:
            achievement.points
        }
      }
    });


    return {
      id:
        achievement.id,

      code:
        achievement.code,

      name:
        achievement.name,

      points:
        achievement.points
    };
  }


  // =================================================
  // ACHIEVEMENTS EARNED THIS COMPLETION
  // =================================================

  const achievementsEarned = [];


  // =================================================
  // FIRST QUIZ
  // =================================================

  if (
    completedQuizCount === 1
  ) {

    const achievement =
      await awardAchievement(
        ACHIEVEMENTS.FIRST_QUIZ
      );

    if (achievement) {
      achievementsEarned.push(
        achievement
      );
    }
  }


  // =================================================
  // PERFECT SCORE
  // =================================================

  if (
    Number(percentage) >= 100
  ) {

    const achievement =
      await awardAchievement(
        ACHIEVEMENTS.PERFECT_QUIZ
      );

    if (achievement) {
      achievementsEarned.push(
        achievement
      );
    }
  }


  // =================================================
  // QUIZ MASTER
  // =================================================

  if (
    completedQuizCount >= 5
  ) {

    const achievement =
      await awardAchievement(
        ACHIEVEMENTS.QUIZ_MASTER
      );

    if (achievement) {
      achievementsEarned.push(
        achievement
      );
    }
  }


  // =================================================
  // RETURN REWARD INFORMATION
  // =================================================

  return {
    pointsEarned:
      totalPoints,

    quizPoints,

    completionBonus,

    passingBonus,

    completedQuizCount,

    achievementsEarned
  };
}


// ==================================================
// EXPORT
// ==================================================

module.exports = {
  rewardQuizCompletion
};