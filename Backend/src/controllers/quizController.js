const prisma = require("../lib/prisma");

const {
  rewardQuizCompletion
} = require("../services/quizRewardsService");

const BASE_POINTS_PER_QUESTION = 20;
const HINT_PENALTY = 5;
const RETRY_PENALTY = 10;
// ==================================================
// HELPERS
// ==================================================

function getAttemptPenaltyRate(attemptNumber) {
  if (attemptNumber <= 1) return 0;
  if (attemptNumber === 2) return 0.20;
  if (attemptNumber === 3) return 0.40;

  return 0.50;
}


function calculateQuestionPoints(
  isCorrect,
  hintsUsed,
  attemptsUsed
) {
  if (!isCorrect) {
    return {
      basePoints: 0,
      hintPenalty: 0,
      retryPenalty: 0,
      points: 0
    };
  }

  const basePoints =
    BASE_POINTS_PER_QUESTION;

  const safeHints =
    Math.min(Math.max(hintsUsed, 0), 1);

  const safeAttempts =
    Math.max(attemptsUsed, 1);

  const retries =
    Math.max(safeAttempts - 1, 0);

  const hintPenalty =
    safeHints * HINT_PENALTY;

  const retryPenalty =
    retries * RETRY_PENALTY;

  const points = Math.max(
    basePoints -
      hintPenalty -
      retryPenalty,
    0
  );

  return {
    basePoints,
    hintPenalty,
    retryPenalty,
    points
  };
}


// ==================================================
// CREATE QUIZ
// ==================================================

async function createQuiz(req, res) {
  try {
    const { articleId } = req.params;

    const {
      title,
      description,
      passingScore,
      questions
    } = req.body;

    if (!title || !title.trim()) {
      return res.status(400).json({
        message: "Quiz title is required"
      });
    }

    const article =
      await prisma.article.findUnique({
        where: { id: articleId }
      });

    if (!article) {
      return res.status(404).json({
        message: "Article not found"
      });
    }

    const existingQuiz =
      await prisma.articleQuiz.findUnique({
        where: { articleId }
      });

    if (existingQuiz) {
      return res.status(409).json({
        message:
          "This article already has a quiz"
      });
    }

    if (
      req.user.role === "WRITER" &&
      article.authorId !== req.user.id
    ) {
      return res.status(403).json({
        message:
          "You can only create quizzes for your own articles"
      });
    }

    const safeQuestions =
      Array.isArray(questions)
        ? questions
        : [];

    for (const question of safeQuestions) {
      if (
        !question.question ||
        !question.question.trim()
      ) {
        return res.status(400).json({
          message:
            "Every quiz question requires text"
        });
      }

      if (
        !Array.isArray(question.options) ||
        question.options.length < 2
      ) {
        return res.status(400).json({
          message:
            "Every question requires at least 2 options"
        });
      }

      const correctOptions =
        question.options.filter(
          option =>
            option.isCorrect === true
        );

      if (correctOptions.length !== 1) {
        return res.status(400).json({
          message:
            "Every question must have exactly one correct answer"
        });
      }
    }

    const quiz =
      await prisma.articleQuiz.create({
        data: {
          articleId,
          title: title.trim(),
          description:
            description || null,
          passingScore:
            passingScore ?? null,

          questions: {
            create:
              safeQuestions.map(
                (question, questionIndex) => ({
                  question:
                    question.question.trim(),

                  hint:
                    question.hint || null,

                  position:
                    question.position ??
                    questionIndex,

                  options: {
                    create:
                      question.options.map(
                        (option, optionIndex) => ({
                          text: option.text,

                          isCorrect:
                            option.isCorrect === true,

                          position:
                            option.position ??
                            optionIndex
                        })
                      )
                  }
                })
              )
          }
        },

        include: {
          questions: {
            orderBy: {
              position: "asc"
            },

            include: {
              options: {
                orderBy: {
                  position: "asc"
                }
              }
            }
          }
        }
      });

    return res.status(201).json({
      message: "Quiz created",
      quiz
    });

  } catch (error) {
    console.error(
      "Create quiz error:",
      error
    );

    return res.status(500).json({
      message:
        "Unable to create quiz"
    });
  }
}


// ==================================================
// CMS: GET QUIZ
// ==================================================

async function getQuiz(req, res) {
  try {
    const { quizId } = req.params;

    const quiz =
      await prisma.articleQuiz.findUnique({
        where: {
          id: quizId
        },

        include: {
          article: {
            select: {
              id: true,
              title: true,
              slug: true,
              status: true,
              authorId: true
            }
          },

          questions: {
            orderBy: {
              position: "asc"
            },

            include: {
              options: {
                orderBy: {
                  position: "asc"
                }
              }
            }
          }
        }
      });

    if (!quiz) {
      return res.status(404).json({
        message: "Quiz not found"
      });
    }

    return res.json({
      quiz
    });

  } catch (error) {
    console.error(
      "Get quiz error:",
      error
    );

    return res.status(500).json({
      message:
        "Unable to retrieve quiz"
    });
  }
}


// ==================================================
// PUBLIC: GET QUIZ
// ==================================================

async function getQuizByArticle(req, res) {
  try {
    const { articleId } = req.params;

    const quiz =
      await prisma.articleQuiz.findUnique({
        where: {
          articleId
        },

        include: {
          questions: {
            orderBy: {
              position: "asc"
            },

            include: {
              options: {
                orderBy: {
                  position: "asc"
                },

                select: {
                  id: true,
                  text: true,
                  position: true
                }
              }
            }
          }
        }
      });

    if (!quiz) {
      return res.status(404).json({
        message:
          "Quiz not found for this article"
      });
    }

    return res.json({
      quiz: {
        id: quiz.id,
        articleId: quiz.articleId,
        title: quiz.title,
        description: quiz.description,
        passingScore: quiz.passingScore,

        questions:
          quiz.questions.map(
            question => ({
              id: question.id,
              question:
                question.question,

              hint:
                question.hint,

              position:
                question.position,

              options:
                question.options
            })
          )
      }
    });

  } catch (error) {
    console.error(
      "Get public quiz error:",
      error
    );

    return res.status(500).json({
      message:
        "Unable to retrieve quiz"
    });
  }
}


// ==================================================
// START QUIZ SESSION
// ==================================================

async function startQuiz(req, res) {
  try {
    const { quizId } = req.params;

    if (!req.user?.id) {
      return res.status(401).json({
        message:
          "Authentication required"
      });
    }

    const quiz =
      await prisma.articleQuiz.findUnique({
        where: {
          id: quizId
        },

        include: {
          article: true,
          questions: {
            orderBy: {
              position: "asc"
            }
          }
        }
      });

    if (!quiz) {
      return res.status(404).json({
        message: "Quiz not found"
      });
    }

    if (
      quiz.article.status !==
      "PUBLISHED"
    ) {
      return res.status(403).json({
        message:
          "This quiz is not available"
      });
    }

    // Only one unfinished session at a time.
    const existingSession =
      await prisma.quizSession.findFirst({
        where: {
          quizId,
          userId: req.user.id,
          completedAt: null
        },

        orderBy: {
          startedAt: "desc"
        }
      });

    if (existingSession) {
      return res.json({
        message:
          "Existing quiz session resumed",
        sessionId:
          existingSession.id
      });
    }

    const session =
      await prisma.$transaction(
        async tx => {

          const newSession =
            await tx.quizSession.create({
              data: {
                quizId,
                userId:
                  req.user.id
              }
            });

          await tx.quizSessionQuestion.createMany({
            data:
              quiz.questions.map(
                question => ({
                  sessionId:
                    newSession.id,

                  questionId:
                    question.id
                })
              )
          });

          return newSession;
        }
      );

    return res.status(201).json({
      message:
        "Quiz session started",

      sessionId:
        session.id
    });

  } catch (error) {
    console.error(
      "Start quiz error:",
      error
    );

    return res.status(500).json({
      message:
        "Unable to start quiz"
    });
  }
}


// ==================================================
// GET SESSION
// ==================================================

async function getQuizSession(req, res) {
  try {
    const {
      quizId,
      sessionId
    } = req.params;

    const session =
      await prisma.quizSession.findFirst({
        where: {
          id: sessionId,
          quizId,
          userId: req.user.id
        },

        include: {
          questions: {
            orderBy: {
              question: {
                position: "asc"
              }
            },

            include: {
              question: {
                include: {
                  options: {
                    orderBy: {
                      position: "asc"
                    },

                    select: {
                      id: true,
                      text: true,
                      position: true
                    }
                  }
                }
              }
            }
          }
        }
      });

    if (!session) {
      return res.status(404).json({
        message:
          "Quiz session not found"
      });
    }

    return res.json({
      session: {
        id: session.id,
        quizId: session.quizId,
        startedAt:
          session.startedAt,
        completedAt:
          session.completedAt,

        questions:
          session.questions.map(
            item => ({
              questionId:
                item.question.id,

              question:
                item.question.question,

              position:
                item.question.position,

              options:
                item.question.options,

              answered:
                item.answered,

              attemptsUsed:
                item.attemptsUsed,

              hintsUsed:
                item.hintsUsed,

              isCorrect:
                item.answered
                  ? item.isCorrect
                  : null
            })
          )
      }
    });

  } catch (error) {
    console.error(
      "Get quiz session error:",
      error
    );

    return res.status(500).json({
      message:
        "Unable to retrieve quiz session"
    });
  }
}


// ==================================================
// REQUEST HINT
// ==================================================

async function getQuizHint(req, res) {
  try {
    const {
      quizId,
      sessionId,
      questionId
    } = req.params;

    const session =
      await prisma.quizSession.findFirst({
        where: {
          id: sessionId,
          quizId,
          userId: req.user.id,
          completedAt: null
        }
      });

    if (!session) {
      return res.status(404).json({
        message:
          "Active quiz session not found"
      });
    }

    const sessionQuestion =
      await prisma.quizSessionQuestion.findUnique({
        where: {
          sessionId_questionId: {
            sessionId,
            questionId
          }
        },

        include: {
          question: true
        }
      });

    if (!sessionQuestion) {
      return res.status(404).json({
        message:
          "Question does not belong to this quiz session"
      });
    }

    if (sessionQuestion.answered) {
      return res.status(400).json({
        message:
          "This question has already been answered"
      });
    }

    if (sessionQuestion.hintsUsed >= 1) {
      return res.status(400).json({
        message:
          "Hint already used for this question"
      });
    }

    const updated =
      await prisma.quizSessionQuestion.update({
        where: {
          id: sessionQuestion.id
        },

        data: {
          hintsUsed: 1
        }
      });

    return res.json({
      message: "Hint revealed",

      questionId,

      hint:
        sessionQuestion.question.hint ||
        "No hint is available for this question.",

      penalty:
        HINT_PENALTY,

      hintsUsed:
        updated.hintsUsed
    });

  } catch (error) {
    console.error(
      "Get quiz hint error:",
      error
    );

    return res.status(500).json({
      message:
        "Unable to retrieve hint"
    });
  }
}


// ==================================================
// ANSWER QUESTION
// ==================================================

async function answerQuestion(req, res) {
  try {
    const {
      quizId,
      sessionId,
      questionId
    } = req.params;

    const { optionId } = req.body;

    if (!optionId) {
      return res.status(400).json({
        message:
          "optionId is required"
      });
    }

    const session =
      await prisma.quizSession.findFirst({
        where: {
          id: sessionId,
          quizId,
          userId: req.user.id,
          completedAt: null
        }
      });

    if (!session) {
      return res.status(404).json({
        message:
          "Active quiz session not found"
      });
    }

    const sessionQuestion =
      await prisma.quizSessionQuestion.findUnique({
        where: {
          sessionId_questionId: {
            sessionId,
            questionId
          }
        },

        include: {
          question: {
            include: {
              options: true
            }
          }
        }
      });

    if (!sessionQuestion) {
      return res.status(404).json({
        message:
          "Question does not belong to this quiz session"
      });
    }

    if (sessionQuestion.answered) {
      return res.status(400).json({
        message:
          "This question has already been completed"
      });
    }

    const selectedOption =
      sessionQuestion.question.options.find(
        option =>
          option.id === optionId
      );

    if (!selectedOption) {
      return res.status(400).json({
        message:
          "Invalid option for this question"
      });
    }

    const attemptsUsed =
      sessionQuestion.attemptsUsed + 1;

    const isCorrect =
      selectedOption.isCorrect;

    // Wrong answer:
    // allow one retry.
    if (
      !isCorrect &&
      attemptsUsed < 2
    ) {

      const updated =
        await prisma.quizSessionQuestion.update({
          where: {
            id: sessionQuestion.id
          },

          data: {
            attemptsUsed
          }
        });

      return res.json({
        message:
          "Incorrect answer",

        correct: false,

        retryAvailable: true,

        attemptsUsed:
          updated.attemptsUsed,

        hintsUsed:
          updated.hintsUsed,

        pointsAvailable:
          Math.max(
            BASE_POINTS_PER_QUESTION -
              updated.hintsUsed *
                HINT_PENALTY -
              RETRY_PENALTY,
            0
          )
      });
    }

    // Correct OR final wrong attempt
    const scoring =
      calculateQuestionPoints(
        isCorrect,
        sessionQuestion.hintsUsed,
        attemptsUsed
      );

    const updated =
      await prisma.quizSessionQuestion.update({
        where: {
          id: sessionQuestion.id
        },

        data: {
          attemptsUsed,
          answered: true,
          isCorrect,
          optionId
        }
      });

    return res.json({
      message:
        isCorrect
          ? "Correct answer"
          : "Incorrect answer",

      correct:
        isCorrect,

      retryAvailable:
        false,

      attemptsUsed:
        updated.attemptsUsed,

      hintsUsed:
        updated.hintsUsed,

      points:
        scoring.points,

      basePoints:
        scoring.basePoints,

      hintPenalty:
        scoring.hintPenalty,

      retryPenalty:
        scoring.retryPenalty
    });

  } catch (error) {
    console.error(
      "Answer question error:",
      error
    );

    return res.status(500).json({
      message:
        "Unable to process answer"
    });
  }
}


// ==================================================
// COMPLETE QUIZ
// ==================================================

async function completeQuiz(req, res) {
  try {

    const {
      quizId,
      sessionId
    } = req.params;


    // =================================================
    // GET QUIZ SESSION
    // =================================================

    const session =
      await prisma.quizSession.findFirst({
        where: {
          id:
            sessionId,

          quizId,

          userId:
            req.user.id
        },

        include: {
          quiz: true,

          questions: true
        }
      });


    // =================================================
    // SESSION NOT FOUND
    // =================================================

    if (!session) {
      return res.status(404).json({
        message:
          "Quiz session not found"
      });
    }


    // =================================================
    // PREVENT DOUBLE COMPLETION
    // =================================================

    if (session.completedAt) {
      return res.status(400).json({
        message:
          "Quiz session has already been completed"
      });
    }


    // =================================================
    // CHECK ALL QUESTIONS
    // =================================================

    const unanswered =
      session.questions.filter(
        question =>
          !question.answered
      );


    if (
      unanswered.length > 0
    ) {

      return res.status(400).json({
        message:
          "Complete all questions before finishing the quiz",

        unanswered:
          unanswered.map(
            question =>
              question.questionId
          )
      });
    }


    // =================================================
    // DETERMINE ATTEMPT NUMBER
    // =================================================

    const previousAttempts =
      await prisma.quizAttempt.count({
        where: {
          quizId,

          userId:
            req.user.id
        }
      });


    const attemptNumber =
      previousAttempts + 1;


    // =================================================
    // CALCULATE QUESTION SCORES
    // =================================================

    let basePoints = 0;

    let hintPenalty = 0;

    let retryPenalty = 0;

    let scoreBeforeAttemptPenalty = 0;


    for (
      const question
      of session.questions
    ) {

      const scoring =
        calculateQuestionPoints(
          question.isCorrect === true,

          question.hintsUsed,

          question.attemptsUsed
        );


      basePoints +=
        scoring.basePoints;


      hintPenalty +=
        scoring.hintPenalty;


      retryPenalty +=
        scoring.retryPenalty;


      scoreBeforeAttemptPenalty +=
        scoring.points;
    }


    // =================================================
    // ATTEMPT PENALTY
    // =================================================

    const attemptPenaltyRate =
      getAttemptPenaltyRate(
        attemptNumber
      );


    const attemptPenalty =
      Math.round(
        scoreBeforeAttemptPenalty *
          attemptPenaltyRate
      );


    // =================================================
    // FINAL SCORE
    // =================================================

    const finalScore =
      Math.max(
        scoreBeforeAttemptPenalty -
          attemptPenalty,

        0
      );


    // =================================================
    // TOTAL QUESTIONS
    // =================================================

    const total =
      session.questions.length;


    // =================================================
    // MAXIMUM POSSIBLE POINTS
    // =================================================

    const maxPossiblePoints =
      total *
      BASE_POINTS_PER_QUESTION;


    // =================================================
    // PERCENTAGE
    // =================================================

    const percentage =
      maxPossiblePoints > 0
        ? Number(
            (
              (
                finalScore /
                maxPossiblePoints
              ) *
              100
            ).toFixed(2)
          )
        : 0;


    // =================================================
    // HINTS USED
    // =================================================

    const hintsUsed =
      session.questions.reduce(
        (
          sum,
          question
        ) =>
          sum +
          question.hintsUsed,

        0
      );


    // =================================================
    // RETRIES USED
    // =================================================

    const retriesUsed =
      session.questions.reduce(
        (
          sum,
          question
        ) =>
          sum +
          Math.max(
            question.attemptsUsed - 1,

            0
          ),

        0
      );


    // =================================================
    // PASS / FAIL
    // =================================================

    const passed =
      session.quiz.passingScore !== null &&
      percentage >=
        session.quiz.passingScore;


    // =================================================
    // ATOMIC DATABASE TRANSACTION
    // =================================================

    const result =
      await prisma.$transaction(
        async tx => {


          // =============================================
          // CREATE QUIZ ATTEMPT
          // =============================================

          const attempt =
            await tx.quizAttempt.create({
              data: {

                quizId,

                userId:
                  req.user.id,

                score:
                  finalScore,

                total,

                percentage,

                hintsUsed,

                retriesUsed,

                attemptNumber,

                basePoints,

                hintPenalty,

                retryPenalty,

                attemptPenalty
              }
            });


          // =============================================
          // CREATE QUIZ ANSWERS
          // =============================================

          await tx.quizAnswer.createMany({

            data:
              session.questions.map(
                question => {

                  const scoring =
                    calculateQuestionPoints(

                      question.isCorrect ===
                        true,

                      question.hintsUsed,

                      question.attemptsUsed
                    );


                  return {

                    attemptId:
                      attempt.id,

                    questionId:
                      question.questionId,

                    optionId:
                      question.optionId,

                    isCorrect:
                      question.isCorrect ===
                      true,

                    points:
                      scoring.points,

                    hintsUsed:
                      question.hintsUsed,

                    attemptsUsed:
                      question.attemptsUsed
                  };
                }
              )
          });


          // =============================================
          // REWARD USER
          // =============================================

          const rewards =
            await rewardQuizCompletion(
              tx,

              {
                userId:
                  req.user.id,

                quizId,

                attemptId:
                  attempt.id,

                score:
                  finalScore,

                percentage,

                passed
              }
            );


          // =============================================
          // COMPLETE SESSION
          // =============================================

          await tx.quizSession.update({

            where: {
              id:
                session.id
            },

            data: {

              completedAt:
                new Date()
            }
          });


          // =============================================
          // RETURN TRANSACTION RESULT
          // =============================================

          return {

            attempt,

            rewards,

            passed
          };
        }
      );


    // =================================================
    // RESPONSE
    // =================================================

    return res.status(201).json({

      message:
        "Quiz completed",


      // ===============================================
      // QUIZ RESULT
      // ===============================================

      result: {

        score:
          finalScore,

        total,

        percentage,

        passingScore:
          session.quiz.passingScore,

        passed:
          result.passed,

        attemptNumber,

        basePoints,

        hintPenalty,

        retryPenalty,

        attemptPenalty,

        hintsUsed,

        retriesUsed
      },


      // ===============================================
      // REWARDS
      // ===============================================

      rewards: {

        pointsEarned:
          result.rewards.pointsEarned,

        quizPoints:
          result.rewards.quizPoints,

        completionBonus:
          result.rewards.completionBonus,

        passingBonus:
          result.rewards.passingBonus,

        completedQuizCount:
          result.rewards.completedQuizCount,

        achievements:
          result.rewards.achievementsEarned
      },


      // ===============================================
      // ATTEMPT
      // ===============================================

      attempt: {

        id:
          result.attempt.id,

        completedAt:
          result.attempt.completedAt
      }
    });


  } catch (error) {

    console.error(
      "Complete quiz error:",
      error
    );


    return res.status(500).json({

      message:
        "Unable to complete quiz"
    });
  }
}


// ==================================================
// GET MY ATTEMPTS
// ==================================================

async function getMyQuizAttempts(req, res) {
  try {
    const { quizId } = req.params;

    const attempts =
      await prisma.quizAttempt.findMany({
        where: {
          quizId,
          userId: req.user.id
        },

        orderBy: {
          completedAt: "desc"
        },

        select: {
          id: true,
          score: true,
          total: true,
          percentage: true,

          hintsUsed: true,
          retriesUsed: true,
          attemptNumber: true,

          basePoints: true,
          hintPenalty: true,
          retryPenalty: true,
          attemptPenalty: true,

          completedAt: true,

          answers: {
            select: {
              questionId: true,
              optionId: true,
              isCorrect: true,
              points: true,
              hintsUsed: true,
              attemptsUsed: true
            }
          }
        }
      });

    return res.json({
      attempts
    });

  } catch (error) {
    console.error(
      "Get quiz attempts error:",
      error
    );

    return res.status(500).json({
      message:
        "Unable to retrieve quiz attempts"
    });
  }
}


// ==================================================
// UPDATE QUIZ
// ==================================================

async function updateQuiz(req, res) {
  try {
    const { quizId } = req.params;

    const {
      title,
      description,
      passingScore,
      questions
    } = req.body;

    const existingQuiz =
      await prisma.articleQuiz.findUnique({
        where: {
          id: quizId
        },

        include: {
          article: true,

          questions: {
            include: {
              options: true
            }
          }
        }
      });

    if (!existingQuiz) {
      return res.status(404).json({
        message: "Quiz not found"
      });
    }

    // ==============================================
    // PERMISSION
    // ==============================================

    if (
      req.user.role === "WRITER" &&
      existingQuiz.article.authorId !==
        req.user.id
    ) {
      return res.status(403).json({
        message:
          "You can only edit quizzes for your own articles"
      });
    }

    // ==============================================
    // BASIC VALIDATION
    // ==============================================

    if (
      title !== undefined &&
      (!title || !title.trim())
    ) {
      return res.status(400).json({
        message:
          "Quiz title cannot be empty"
      });
    }

    if (
      passingScore !== undefined &&
      passingScore !== null &&
      (
        !Number.isInteger(
          passingScore
        ) ||
        passingScore < 0 ||
        passingScore > 100
      )
    ) {
      return res.status(400).json({
        message:
          "passingScore must be between 0 and 100"
      });
    }

    if (
      questions !== undefined &&
      !Array.isArray(questions)
    ) {
      return res.status(400).json({
        message:
          "questions must be an array"
      });
    }

    // ==============================================
    // UPDATE QUIZ + QUESTIONS ATOMICALLY
    // ==============================================

    const quiz =
      await prisma.$transaction(
        async tx => {

          // ------------------------------------------
          // UPDATE QUIZ INFORMATION
          // ------------------------------------------

          const quizData = {};

          if (title !== undefined) {
            quizData.title =
              title.trim();
          }

          if (
            description !== undefined
          ) {
            quizData.description =
              description || null;
          }

          if (
            passingScore !== undefined
          ) {
            quizData.passingScore =
              passingScore;
          }

          if (
            Object.keys(quizData).length > 0
          ) {
            await tx.articleQuiz.update({
              where: {
                id: quizId
              },

              data: quizData
            });
          }

          // ==========================================
          // QUESTIONS
          // ==========================================

          if (Array.isArray(questions)) {

            const existingQuestionIds =
              existingQuiz.questions.map(
                question =>
                  question.id
              );

            const incomingQuestionIds =
              questions
                .filter(
                  question =>
                    question.id
                )
                .map(
                  question =>
                    question.id
                );

            // ----------------------------------------
            // DELETE REMOVED QUESTIONS
            // ----------------------------------------

            const questionsToDelete =
              existingQuestionIds.filter(
                id =>
                  !incomingQuestionIds.includes(
                    id
                  )
              );

            if (
              questionsToDelete.length > 0
            ) {

              /*
               * A question may have historical
               * QuizAnswer records.
               *
               * Do not blindly delete it if it
               * has answer history.
               */

              const questionsWithHistory =
                await tx.quizAnswer.findMany({
                  where: {
                    questionId: {
                      in:
                        questionsToDelete
                    }
                  },

                  select: {
                    questionId: true
                  },

                  distinct: [
                    "questionId"
                  ]
                });

              const protectedQuestionIds =
                questionsWithHistory.map(
                  item =>
                    item.questionId
                );

              const safeToDelete =
                questionsToDelete.filter(
                  id =>
                    !protectedQuestionIds.includes(
                      id
                    )
                );

              if (
                safeToDelete.length > 0
              ) {
                await tx.quizQuestion.deleteMany({
                  where: {
                    id: {
                      in:
                        safeToDelete
                    }
                  }
                });
              }
            }

            // ----------------------------------------
            // CREATE / UPDATE QUESTIONS
            // ----------------------------------------

            for (
              let questionIndex = 0;
              questionIndex <
                questions.length;
              questionIndex++
            ) {

              const question =
                questions[
                  questionIndex
                ];

              // --------------------------------------
              // VALIDATE QUESTION
              // --------------------------------------

              if (
                !question.question ||
                !question.question.trim()
              ) {
                throw new Error(
                  "Every quiz question requires text"
                );
              }

              if (
                !Array.isArray(
                  question.options
                ) ||
                question.options.length < 2
              ) {
                throw new Error(
                  "Every question requires at least 2 options"
                );
              }

              const correctOptions =
                question.options.filter(
                  option =>
                    option.isCorrect ===
                    true
                );

              if (
                correctOptions.length !== 1
              ) {
                throw new Error(
                  "Every question must have exactly one correct answer"
                );
              }

              // ========================================
              // EXISTING QUESTION
              // ========================================

              if (question.id) {

                const existingQuestion =
                  existingQuiz.questions.find(
                    item =>
                      item.id ===
                      question.id
                  );

                if (!existingQuestion) {
                  throw new Error(
                    `Question ${question.id} does not belong to this quiz`
                  );
                }

                // --------------------------------------
                // UPDATE QUESTION
                // --------------------------------------

                await tx.quizQuestion.update({
                  where: {
                    id:
                      question.id
                  },

                  data: {
                    question:
                      question.question.trim(),

                    hint:
                      question.hint ||
                      null,

                    position:
                      question.position ??
                      questionIndex
                  }
                });

                // --------------------------------------
                // OPTIONS
                // --------------------------------------

                const existingOptionIds =
                  existingQuestion.options.map(
                    option =>
                      option.id
                  );

                const incomingOptionIds =
                  question.options
                    .filter(
                      option =>
                        option.id
                    )
                    .map(
                      option =>
                        option.id
                    );

                // --------------------------------------
                // DELETE REMOVED OPTIONS
                // --------------------------------------

                const optionsToDelete =
                  existingOptionIds.filter(
                    id =>
                      !incomingOptionIds.includes(
                        id
                      )
                  );

                for (
                  const optionId
                  of optionsToDelete
                ) {

                  /*
                   * Do not delete an option if
                   * historical answers reference it.
                   */

                  const answerCount =
                    await tx.quizAnswer.count({
                      where: {
                        optionId
                      }
                    });

                  if (
                    answerCount === 0
                  ) {
                    await tx.quizOption.delete({
                      where: {
                        id:
                          optionId
                      }
                    });
                  }
                }

                // --------------------------------------
                // CREATE / UPDATE OPTIONS
                // --------------------------------------

                for (
                  let optionIndex = 0;
                  optionIndex <
                    question.options.length;
                  optionIndex++
                ) {

                  const option =
                    question.options[
                      optionIndex
                    ];

                  // Existing option
                  if (option.id) {

                    const existingOption =
                      existingQuestion.options.find(
                        item =>
                          item.id ===
                          option.id
                      );

                    if (!existingOption) {
                      throw new Error(
                        `Option ${option.id} does not belong to this question`
                      );
                    }

                    await tx.quizOption.update({
                      where: {
                        id:
                          option.id
                      },

                      data: {
                        text:
                          option.text,

                        isCorrect:
                          option.isCorrect ===
                          true,

                        position:
                          option.position ??
                          optionIndex
                      }
                    });

                  } else {

                    // New option
                    await tx.quizOption.create({
                      data: {
                        questionId:
                          question.id,

                        text:
                          option.text,

                        isCorrect:
                          option.isCorrect ===
                          true,

                        position:
                          option.position ??
                          optionIndex
                      }
                    });
                  }
                }

              } else {

                // ======================================
                // NEW QUESTION
                // ======================================

                await tx.quizQuestion.create({
                  data: {
                    quizId,

                    question:
                      question.question.trim(),

                    hint:
                      question.hint ||
                      null,

                    position:
                      question.position ??
                      questionIndex,

                    options: {
                      create:
                        question.options.map(
                          (
                            option,
                            optionIndex
                          ) => ({
                            text:
                              option.text,

                            isCorrect:
                              option.isCorrect ===
                              true,

                            position:
                              option.position ??
                              optionIndex
                          })
                        )
                    }
                  }
                });
              }
            }
          }

          // ==========================================
          // RETURN UPDATED QUIZ
          // ==========================================

          return tx.articleQuiz.findUnique({
            where: {
              id: quizId
            },

            include: {
              questions: {
                orderBy: {
                  position: "asc"
                },

                include: {
                  options: {
                    orderBy: {
                      position: "asc"
                    }
                  }
                }
              }
            }
          });
        }
      );

    return res.json({
      message:
        "Quiz updated",

      quiz
    });

  } catch (error) {

    console.error(
      "Update quiz error:",
      error
    );

    if (
      error.message?.includes(
        "does not belong"
      ) ||
      error.message?.includes(
        "requires"
      ) ||
      error.message?.includes(
        "must have"
      )
    ) {
      return res.status(400).json({
        message:
          error.message
      });
    }

    return res.status(500).json({
      message:
        "Unable to update quiz"
    });
  }
}


// ==================================================
// DELETE QUIZ
// ==================================================

async function deleteQuiz(req, res) {
  try {
    const { quizId } = req.params;

    const quiz =
      await prisma.articleQuiz.findUnique({
        where: {
          id: quizId
        },

        include: {
          article: true
        }
      });

    if (!quiz) {
      return res.status(404).json({
        message: "Quiz not found"
      });
    }

    if (
      req.user.role === "WRITER" &&
      quiz.article.authorId !==
        req.user.id
    ) {
      return res.status(403).json({
        message:
          "You can only delete your own quizzes"
      });
    }

    await prisma.articleQuiz.delete({
      where: {
        id: quizId
      }
    });

    return res.json({
      message:
        "Quiz deleted"
    });

  } catch (error) {
    console.error(
      "Delete quiz error:",
      error
    );

    return res.status(500).json({
      message:
        "Unable to delete quiz"
    });
  }
}


module.exports = {
  createQuiz,
  getQuiz,
  getQuizByArticle,

  startQuiz,
  getQuizSession,
  getQuizHint,
  answerQuestion,
  completeQuiz,

  getMyQuizAttempts,

  updateQuiz,
  deleteQuiz
};