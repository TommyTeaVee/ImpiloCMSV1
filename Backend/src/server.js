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
const magazineRoutes =
  require("./routes/magazineRoutes");
const cloudfrontMediaRoutes =
  require(
    "./routes/cloudfrontMediaRoutes"
  );
  const userRoutes = require("./routes/userRoutes");
const magazineAdminRoutes =
  require("./routes/magazineAdminRoutes");


const app = express();

const PORT = process.env.SERVER_PORT || 35050;

// --------------------------------------------------
// Middleware
// --------------------------------------------------

app.use(cors());
// 1. Parse the comma-separated environment string into a clean array
const allowedOrigins = process.env.ALLOWED_ORIGINS
  ? process.env.ALLOWED_ORIGINS.split(',').map(origin => origin.trim())
  : [];

// 2. Wire up the dynamic CORS engine onto your Express app instance
app.use(cors({
  origin: function (origin, callback) {
    // Allow server-to-server requests or tools like Postman/Insomnia (no origin header)
    if (!origin) return callback(null, true);
    
    if (allowedOrigins.includes(origin)) {
      callback(null, true);
    } else {
      console.warn(`[CORS Blocked]: Request from unauthorized origin: ${origin}`);
      callback(new Error('Not allowed by CORS'));
    }
  },
  credentials: true, // Crucial for auth endpoints using HTTP cookies or sessions
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization']
}));

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
app.use("/api/gamification", gamificationRoutes);
app.use(
  "/api/cloudfront-media",cloudfrontMediaRoutes);
app.use(
  "/api/magazines",
  magazineRoutes
);
app.use(
  "/api/magazine-admin/issues",
  magazineAdminRoutes
);
app.use("/api/users", userRoutes);
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