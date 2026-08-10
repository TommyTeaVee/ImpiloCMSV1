const express = require("express");
const cors = require("cors");

const authRoutes = require("./routes/authRoutes");
const articleRoutes = require("./routes/articleRoutes");
const readerRoutes = require("./routes/readerRoutes");
 const commentRoutes = require("./routes/commentRoutes");
 const mediaRoutes = require("./routes/mediaRoutes");
 const articleBlockRoutes = require("./routes/articleBlockRoutes");
const quizRoutes = require("./routes/quizRoutes");
const gamificationRoutes =
  require("./routes/gamificationRoutes");


const app = express();

const PORT = process.env.PORT || 5000;

// --------------------------------------------------
// Middleware
// --------------------------------------------------

app.use(cors());

app.use(express.json());

app.use(express.urlencoded({ extended: true }));

// --------------------------------------------------
// Health Check
// --------------------------------------------------

app.get("/", (req, res) => {
  res.json({
    message: "Impilo Editorial CMS Server",
    status: "running"
  });
});

// --------------------------------------------------
// Routes
// --------------------------------------------------

app.use("/api/auth", authRoutes);
app.use("/api/articles", articleRoutes);
app.use("/api/readers", readerRoutes);
app.use("/api/comments", commentRoutes);
app.use("/api/media", mediaRoutes);
app.use("/api/blocks", articleBlockRoutes);
app.use("/api/quiz", quizRoutes);
app.use(
  "/api/gamification",
  gamificationRoutes
);
// --------------------------------------------------
// 404 Handler
// --------------------------------------------------

app.use((req, res) => {
  res.status(404).json({
    message: "Route not found"
  });
});

// --------------------------------------------------
// Error Handler
// --------------------------------------------------

app.use((err, req, res, next) => {
  console.error("Server error:", err);

  res.status(500).json({
    message: "Internal server error"
  });
});

// --------------------------------------------------
// Start Server
// --------------------------------------------------

app.listen(PORT, () => {
  console.log(`Impilo Editorial CMS running on port ${PORT}`);
});