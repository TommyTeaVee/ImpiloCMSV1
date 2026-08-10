const express = require("express");

const {
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
} = require("../controllers/quizController");

const {
  authenticate,
  requireRole
} = require("../middleware/authMiddleware");

const router = express.Router();


// ==================================================
// CMS
// ==================================================

router.post(
  "/articles/:articleId/quiz",
  authenticate,
  requireRole(
    "ADMIN",
    "EDITOR",
    "WRITER"
  ),
  createQuiz
);

router.get(
  "/quiz/:quizId",
  authenticate,
  requireRole(
    "ADMIN",
    "EDITOR",
    "WRITER",
    "MODERATOR"
  ),
  getQuiz
);

router.put(
  "/:quizId",
  authenticate,
  requireRole(
    "ADMIN",
    "EDITOR",
    "WRITER"
  ),
  updateQuiz
);

router.delete(
  "/quiz/:quizId",
  authenticate,
  requireRole(
    "ADMIN",
    "EDITOR"
  ),
  deleteQuiz
);


// ==================================================
// PUBLIC QUIZ
// ==================================================

router.get(
  "/articles/:articleId/quiz",
  getQuizByArticle
);


// ==================================================
// QUIZ SESSION
// ==================================================

// Start quiz
router.post(
  "/:quizId/start",
  authenticate,
  requireRole(
    "READER",
    "ADMIN",
    "EDITOR",
    "WRITER"
  ),
  startQuiz
);


// Get current session
router.get(
  "/:quizId/session/:sessionId",
  authenticate,
  requireRole(
    "READER",
    "ADMIN",
    "EDITOR",
    "WRITER"
  ),
  getQuizSession
);


// Request hint
router.post(
  "/:quizId/session/:sessionId/questions/:questionId/hint",
  authenticate,
  requireRole(
    "READER",
    "ADMIN",
    "EDITOR",
    "WRITER"
  ),
  getQuizHint
);


// Answer question
router.post(
  "/:quizId/session/:sessionId/questions/:questionId/answer",
  authenticate,
  requireRole(
    "READER",
    "ADMIN",
    "EDITOR",
    "WRITER"
  ),
  answerQuestion
);


// Complete quiz
router.post(
  "/:quizId/session/:sessionId/complete",
  authenticate,
  requireRole(
    "READER",
    "ADMIN",
    "EDITOR",
    "WRITER"
  ),
  completeQuiz
);


// ==================================================
// ATTEMPTS
// ==================================================

router.get(
  "/:quizId/attempts",
  authenticate,
  requireRole(
    "READER",
    "ADMIN",
    "EDITOR",
    "WRITER"
  ),
  getMyQuizAttempts
);


module.exports = router;