const prisma = require("../lib/prisma");

// ==================================================
// IMPILO LEVELS
// ==================================================

const IMPILO_LEVELS = [
  {
    level: 1,
    name: "New Reader",
    minXP: 0,
    maxXP: 49
  },

  {
    level: 2,
    name: "Explorer",
    minXP: 50,
    maxXP: 149
  },

  {
    level: 3,
    name: "Insider",
    minXP: 150,
    maxXP: 299
  },

  {
    level: 4,
    name: "Tastemaker",
    minXP: 300,
    maxXP: 499
  },

  {
    level: 5,
    name: "IMPILO Icon",
    minXP: 500,
    maxXP: 999
  },

  {
    level: 6,
    name: "Showbiz Elite",
    minXP: 1000,
    maxXP: Infinity
  }
];
// ==================================================
// CALCULATE IMPILO LEVEL
// ==================================================

function calculateImpiloLevel(xp) {

  const safeXP =
    Math.max(
      Number(xp) || 0,
      0
    );

  let currentLevel =
    IMPILO_LEVELS[
      IMPILO_LEVELS.length - 1
    ];

  for (
    const level
    of IMPILO_LEVELS
  ) {

    if (
      safeXP >= level.minXP &&
      safeXP <= level.maxXP
    ) {
      currentLevel = level;
      break;
    }
  }

  // -----------------------------------------------
  // MAX LEVEL
  // -----------------------------------------------

  if (
    currentLevel.level ===
    IMPILO_LEVELS[
      IMPILO_LEVELS.length - 1
    ].level
  ) {

    return {
      level:
        currentLevel.level,

      levelName:
        currentLevel.name,

      currentLevelXP:
        currentLevel.minXP,

      nextLevelXP:
        null,

      progressXP:
        safeXP -
        currentLevel.minXP,

      requiredXP:
        null,

      progress:
        100,

      maxLevel:
        true
    };
  }


  // -----------------------------------------------
  // NORMAL LEVEL
  // -----------------------------------------------

  const nextLevel =
    IMPILO_LEVELS[
      currentLevel.level
    ];

  const levelRange =
    nextLevel.minXP -
    currentLevel.minXP;

  const progressXP =
    safeXP -
    currentLevel.minXP;

  const progress =
    Math.min(
      Math.max(
        (
          progressXP /
          levelRange
        ) *
        100,

        0
      ),

      100
    );


  return {
    level:
      currentLevel.level,

    levelName:
      currentLevel.name,

    currentLevelXP:
      currentLevel.minXP,

    nextLevelXP:
      nextLevel.minXP,

    progressXP,

    requiredXP:
      levelRange,

    progress:
      Number(
        progress.toFixed(2)
      ),

    maxLevel:
      false
  };
}
// ==================================================
// GET MY GAMIFICATION PROFILE
// ==================================================
// ==================================================
// GET ALL ACHIEVEMENTS
// ==================================================

// ==================================================
// GET ALL ACHIEVEMENTS WITH PROGRESS
// ==================================================

async function getAchievements(req, res) {
  try {
    const achievements =
      await prisma.achievement.findMany({
        orderBy: {
          points: "asc"
        },

        select: {
          id: true,
          code: true,
          name: true,
          description: true,
          icon: true,
          points: true
        }
      });

    // ----------------------------------------------
    // If the user is not authenticated, return
    // achievement definitions only.
    // ----------------------------------------------

    let userAchievements = [];

    if (req.user?.id) {
      userAchievements =
        await prisma.readerAchievement.findMany({
          where: {
            userId: req.user.id
          },

          select: {
            achievementId: true,
            earnedAt: true
          }
        });
    }

    const earnedMap =
      new Map(
        userAchievements.map(item => [
          item.achievementId,
          item.earnedAt
        ])
      );


    // ----------------------------------------------
    // USER QUIZ PROGRESS
    // ----------------------------------------------

    let completedQuizCount = 0;
    let perfectQuizCount = 0;

    if (req.user?.id) {

      const quizAttempts =
        await prisma.quizAttempt.findMany({
          where: {
            userId: req.user.id
          },

          select: {
            quizId: true,
            percentage: true
          }
        });


      const uniqueQuizIds =
        new Set(
          quizAttempts.map(
            attempt =>
              attempt.quizId
          )
        );


      completedQuizCount =
        uniqueQuizIds.size;


      perfectQuizCount =
        quizAttempts.filter(
          attempt =>
            Number(
              attempt.percentage
            ) >= 100
        ).length;
    }


    // ----------------------------------------------
    // BUILD PROGRESS
    // ----------------------------------------------

    const results =
      achievements.map(
        achievement => {

          const earned =
            earnedMap.has(
              achievement.id
            );


          let progress = 0;
          let target = 1;


          switch (
            achievement.code
          ) {

            case "FIRST_QUIZ":

              progress =
                Math.min(
                  completedQuizCount,
                  1
                );

              target = 1;

              break;


            case "PERFECT_QUIZ":

              progress =
                Math.min(
                  perfectQuizCount,
                  1
                );

              target = 1;

              break;


            case "QUIZ_MASTER":

              progress =
                Math.min(
                  completedQuizCount,
                  5
                );

              target = 5;

              break;


            default:

              progress =
                earned
                  ? 1
                  : 0;

              target = 1;
          }


          return {

            id:
              achievement.id,

            code:
              achievement.code,

            name:
              achievement.name,

            description:
              achievement.description,

            icon:
              achievement.icon,

            points:
              achievement.points,

            earned,

            earnedAt:
              earnedMap.get(
                achievement.id
              ) || null,

            progress,

            target,

            progressPercentage:
              target > 0
                ? Math.round(
                    (
                      progress /
                      target
                    ) * 100
                  )
                : 0
          };
        }
      );


    return res.json({
      achievements:
        results
    });

  } catch (error) {

    console.error(
      "Get achievements error:",
      error
    );

    return res.status(500).json({
      message:
        "Unable to retrieve achievements"
    });
  }
}


// ==================================================
// GET MY ACHIEVEMENTS
// ==================================================
// ==================================================
// GET GAMIFICATION DASHBOARD
// ==================================================

async function getGamificationDashboard(req, res) {
  try {
    const userId = req.user.id;

    // ==============================================
    // POINT TRANSACTIONS
    // ==============================================

    const transactions =
      await prisma.pointsTransaction.findMany({
        where: {
          userId
        },

        orderBy: {
          createdAt: "desc"
        },

        take: 10,

        select: {
          id: true,
          points: true,
          reason: true,
          eventId: true,
          createdAt: true
        }
      });


    // ==============================================
    // TOTAL XP
    // ==============================================

    const allTransactions =
      await prisma.pointsTransaction.findMany({
        where: {
          userId
        },

        select: {
          points: true
        }
      });


    const points =
      allTransactions.reduce(
        (total, transaction) =>
          total + transaction.points,

        0
      );


    // ==============================================
    // LEVEL
    // ==============================================

    const level =
      calculateImpiloLevel(
        points
      );


    // ==============================================
    // LEADERBOARD
    // ==============================================

    const leaderboard =
      await buildLeaderboard();


    const myRank =
      leaderboard.find(
        player =>
          player.userId === userId
      );


    // ==============================================
    // ACHIEVEMENTS
    // ==============================================

    const achievements =
      await prisma.achievement.findMany({
        orderBy: {
          points: "asc"
        },

        select: {
          id: true,
          code: true,
          name: true,
          description: true,
          icon: true,
          points: true
        }
      });


    const earnedAchievements =
      await prisma.readerAchievement.findMany({
        where: {
          userId
        },

        select: {
          achievementId: true,
          earnedAt: true
        }
      });


    const earnedMap =
      new Map(
        earnedAchievements.map(
          item => [
            item.achievementId,
            item.earnedAt
          ]
        )
      );


    // ==============================================
    // QUIZ PROGRESS
    // ==============================================

    const quizAttempts =
      await prisma.quizAttempt.findMany({
        where: {
          userId
        },

        select: {
          quizId: true,
          percentage: true
        }
      });


    const uniqueQuizIds =
      new Set(
        quizAttempts.map(
          attempt =>
            attempt.quizId
        )
      );


    const completedQuizCount =
      uniqueQuizIds.size;


    const perfectQuizCount =
      quizAttempts.filter(
        attempt =>
          Number(
            attempt.percentage
          ) >= 100
      ).length;


    // ==============================================
    // ACHIEVEMENT PROGRESS
    // ==============================================

    const achievementData =
      achievements.map(
        achievement => {

          const earned =
            earnedMap.has(
              achievement.id
            );

          let progress = 0;
          let target = 1;

          switch (
            achievement.code
          ) {

            case "FIRST_QUIZ":

              progress =
                Math.min(
                  completedQuizCount,
                  1
                );

              target = 1;

              break;


            case "PERFECT_QUIZ":

              progress =
                Math.min(
                  perfectQuizCount,
                  1
                );

              target = 1;

              break;


            case "QUIZ_MASTER":

              progress =
                Math.min(
                  completedQuizCount,
                  5
                );

              target = 5;

              break;


            default:

              progress =
                earned
                  ? 1
                  : 0;

              target = 1;
          }


          return {
            id:
              achievement.id,

            code:
              achievement.code,

            name:
              achievement.name,

            description:
              achievement.description,

            icon:
              achievement.icon,

            points:
              achievement.points,

            earned,

            earnedAt:
              earnedMap.get(
                achievement.id
              ) || null,

            progress,

            target,

            progressPercentage:
              target > 0
                ? Math.round(
                    (
                      progress /
                      target
                    ) * 100
                  )
                : 0
          };
        }
      );


    // ==============================================
    // RECENT ACTIVITY
    // ==============================================

    const recentActivity =
      transactions.map(
        transaction => ({
          id:
            transaction.id,

          points:
            transaction.points,

          reason:
            transaction.reason,

          eventId:
            transaction.eventId,

          createdAt:
            transaction.createdAt
        })
      );


    // ==============================================
    // LEADERBOARD PREVIEW
    // ==============================================

    const leaderboardPreview =
      leaderboard.slice(
        0,
        10
      );


    // ==============================================
    // RESPONSE
    // ==============================================

    return res.json({

      profile: {

        userId,

        points,

        xp:
          points,

        level:
          level.level,

        levelName:
          level.levelName,

        currentLevelXP:
          level.currentLevelXP,

        nextLevelXP:
          level.nextLevelXP,

        progressXP:
          level.progressXP,

        requiredXP:
          level.requiredXP,

        progress:
          level.progress,

        maxLevel:
          level.maxLevel,

        rank:
          myRank
            ? myRank.rank
            : null
      },


      achievements:
        achievementData,


      leaderboard:
        leaderboardPreview,


      recentActivity
    });

  } catch (error) {

    console.error(
      "Get gamification dashboard error:",
      error
    );

    return res.status(500).json({
      message:
        "Unable to retrieve gamification dashboard"
    });
  }
}
async function getMyAchievements(req, res) {
  try {
    const achievements =
      await prisma.readerAchievement.findMany({
        where: {
          userId:
            req.user.id
        },

        orderBy: {
          earnedAt: "desc"
        },

        include: {
          achievement: true
        }
      });

    return res.json({
      achievements:
        achievements.map(item => ({
          id:
            item.achievement.id,

          code:
            item.achievement.code,

          name:
            item.achievement.name,

          description:
            item.achievement.description,

          icon:
            item.achievement.icon,

          points:
            item.achievement.points,

          earnedAt:
            item.earnedAt
        }))
    });

  } catch (error) {
    console.error(
      "Get my achievements error:",
      error
    );

    return res.status(500).json({
      message:
        "Unable to retrieve achievements"
    });
  }
}
// ==================================================
// GET MY GAMIFICATION PROFILE
// ==================================================

async function getMyGamification(req, res) {

  try {

    const userId =
      req.user.id;


    // ================================================
    // GET POINT TRANSACTIONS
    // ================================================

    const transactions =
      await prisma.pointsTransaction.findMany({

        where: {
          userId
        },

        orderBy: {
          createdAt: "desc"
        },

        select: {
          id: true,
          points: true,
          reason: true,
          eventId: true,
          createdAt: true
        }
      });


    // ================================================
    // CALCULATE TOTAL XP
    // ================================================

    const points =
      transactions.reduce(
        (
          total,
          transaction
        ) =>
          total +
          transaction.points,

        0
      );


    // ================================================
    // CALCULATE LEVEL
    // ================================================

    const level =
      calculateImpiloLevel(
        points
      );


    // ================================================
    // GET ACHIEVEMENTS
    // ================================================

    const achievements =
      await prisma.readerAchievement.findMany({

        where: {
          userId
        },

        orderBy: {
          earnedAt: "desc"
        },

        include: {
          achievement: {
            select: {
              id: true,
              code: true,
              name: true,
              description: true,
              icon: true,
              points: true
            }
          }
        }
      });


    // ================================================
    // BUILD LEADERBOARD
    // ================================================

    const leaderboard =
      await buildLeaderboard();


    const myRankIndex =
      leaderboard.findIndex(
        player =>
          player.userId ===
          userId
      );


    const rank =
      myRankIndex === -1
        ? null
        : myRankIndex + 1;


    // ================================================
    // RESPONSE
    // ================================================

    return res.json({

      profile: {

        userId,

        points,

        xp:
          points,

        level:
          level.level,

        levelName:
          level.levelName,

        currentLevelXP:
          level.currentLevelXP,

        nextLevelXP:
          level.nextLevelXP,

        progressXP:
          level.progressXP,

        requiredXP:
          level.requiredXP,

        progress:
          level.progress,

        maxLevel:
          level.maxLevel,

        rank
      },


      achievements:
        achievements.map(
          item => ({

            id:
              item.achievement.id,

            code:
              item.achievement.code,

            name:
              item.achievement.name,

            description:
              item.achievement.description,

            icon:
              item.achievement.icon,

            points:
              item.achievement.points,

            earnedAt:
              item.earnedAt
          })
        ),


      transactions

    });

  } catch (error) {

    console.error(
      "Get gamification profile error:",
      error
    );


    return res.status(500).json({

      message:
        "Unable to retrieve gamification profile"
    });
  }
}


// ==================================================
// BUILD LEADERBOARD
// ==================================================

async function buildLeaderboard() {

  const transactions =
    await prisma.pointsTransaction.findMany({
      select: {
        userId: true,
        points: true
      }
    });

  const totals =
    new Map();

  for (
    const transaction
    of transactions
  ) {

    const current =
      totals.get(
        transaction.userId
      ) || 0;

    totals.set(
      transaction.userId,

      current +
        transaction.points
    );
  }


  // ----------------------------------------------
  // GET USERS
  // ----------------------------------------------

  const userIds =
    Array.from(
      totals.keys()
    );

  if (
    userIds.length === 0
  ) {
    return [];
  }


  const users =
    await prisma.user.findMany({
      where: {
        id: {
          in: userIds
        }
      },

      select: {
        id: true,
        username: true,
        displayName: true,
        avatarUrl: true
      }
    });


  const userMap =
    new Map(
      users.map(user => [
        user.id,
        user
      ])
    );


  // ----------------------------------------------
  // ACHIEVEMENT COUNTS
  // ----------------------------------------------

  const achievementCounts =
    await prisma.readerAchievement.groupBy({
      by: [
        "userId"
      ],

      where: {
        userId: {
          in: userIds
        }
      },

      _count: {
        id: true
      }
    });


  const achievementMap =
    new Map(
      achievementCounts.map(item => [
        item.userId,
        item._count.id
      ])
    );


  // ----------------------------------------------
  // CREATE LEADERBOARD
  // ----------------------------------------------

  const leaderboard =
    userIds
      .map(userId => {

        const user =
          userMap.get(userId);

        if (!user) {
          return null;
        }

        return {
          userId,

          username:
            user.username,

          displayName:
            user.displayName,

          avatarUrl:
            user.avatarUrl,

          points:
            totals.get(userId) || 0,

          achievements:
            achievementMap.get(
              userId
            ) || 0
        };
      })

      .filter(Boolean);


  // ----------------------------------------------
  // SORT
  // ----------------------------------------------

  leaderboard.sort(
    (a, b) => {

      if (
        b.points !== a.points
      ) {
        return (
          b.points -
          a.points
        );
      }

      return (
        b.achievements -
        a.achievements
      );
    }
  );


  // ----------------------------------------------
  // ADD RANK
  // ----------------------------------------------

  return leaderboard.map(
    (player, index) => ({
      rank:
        index + 1,

      ...player
    })
  );
}


// ==================================================
// GET LEADERBOARD
// ==================================================

async function getLeaderboard(req, res) {
  try {

    const leaderboard =
      await buildLeaderboard();


    const limit =
      Math.min(
        Math.max(
          parseInt(
            req.query.limit || "20",
            10
          ),

          1
        ),

        100
      );


    const results =
      leaderboard.slice(
        0,
        limit
      );


    return res.json({
      leaderboard:
        results,

      totalPlayers:
        leaderboard.length
    });

  } catch (error) {
    console.error(
      "Get leaderboard error:",
      error
    );

    return res.status(500).json({
      message:
        "Unable to retrieve leaderboard"
    });
  }
}


// ==================================================
// GET MY RANK
// ==================================================

async function getMyRank(req, res) {
  try {

    const leaderboard =
      await buildLeaderboard();


    const player =
      leaderboard.find(
        item =>
          item.userId ===
          req.user.id
      );


    if (!player) {
      return res.json({
        rank: null,
        points: 0,
        achievements: 0
      });
    }


    return res.json({
      rank:
        player.rank,

      points:
        player.points,

      achievements:
        player.achievements
    });

  } catch (error) {
    console.error(
      "Get my rank error:",
      error
    );

    return res.status(500).json({
      message:
        "Unable to retrieve rank"
    });
  }
}


module.exports = {
  getMyGamification,
  getLeaderboard,
  getMyRank,
  getAchievements,
  getMyAchievements,
  getGamificationDashboard
};