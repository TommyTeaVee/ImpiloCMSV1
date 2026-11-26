// Impilo Editorial CMS API (hardened). Replaces Backend/src/server.js.
require("dotenv").config();

const express = require("express");
const cors = require("cors");
const helmet = require("helmet");

const { apiLimiter } = require("./middleware/rateLimits");

const authRoutes = require("./routes/authRoutes");
const articleRoutes = require("./routes/articleRoutes");
const readerRoutes = require("./routes/readerRoutes");
const commentRoutes = require("./routes/commentRoutes");
const mediaRoutes = require("./routes/mediaRoutes");
const articleBlockRoutes = require("./routes/articleBlockRoutes");
const quizRoutes = require("./routes/quizRoutes");
const gamificationRoutes = require("./routes/gamificationRoutes");
const magazineRoutes = require("./routes/magazineRoutes");
const cloudfrontMediaRoutes = require("./routes/cloudfrontMediaRoutes");
const userRoutes = require("./routes/userRoutes");
const magazineAdminRoutes = require("./routes/magazineAdminRoutes");

if (!process.env.JWT_SECRET || process.env.JWT_SECRET.length < 32) {
  console.error("JWT_SECRET is missing or shorter than 32 characters. Refusing to start.");
  process.exit(1);
}

const app = express();
const PORT = process.env.SERVER_PORT || process.env.PORT || 35050;

app.disable("x-powered-by");
// Behind Nginx: without this every request looks like 127.0.0.1 and rate limits hit everyone at once.
app.set("trust proxy", 1);

app.use(
  helmet({
    // The API is called from other origins (www site, SSR); CORS below decides who may.
    crossOriginResourcePolicy: { policy: "cross-origin" },
  })
);

// Only the origins in ALLOWED_ORIGINS (comma separated) may call this API from a browser.
const allowedOrigins = (process.env.ALLOWED_ORIGINS || "")
  .split(",")
  .map((o) => o.trim())
  .filter(Boolean);

app.use(
  cors({
    origin(origin, callback) {
      // no Origin header = server-to-server (the SSR server), curl, health checks
      if (!origin || allowedOrigins.includes(origin)) return callback(null, true);
      console.warn(`[CORS blocked] ${origin}`);
      return callback(null, false);
    },
    credentials: true,
    methods: ["GET", "POST", "PUT", "PATCH", "DELETE", "OPTIONS"], // PATCH: magazine page reorder
    allowedHeaders: ["Content-Type", "Authorization"],
  })
);

app.use(express.json({ limit: "2mb" }));
app.use(express.urlencoded({ extended: true, limit: "2mb" }));

app.get("/", (req, res) => {
  res.json({ message: "Impilo Editorial CMS Server", status: "running" });
});

app.use("/api", apiLimiter);

app.use("/api/auth", authRoutes);
app.use("/api/articles", articleRoutes);
app.use("/api/readers", readerRoutes);
app.use("/api/comments", commentRoutes);
app.use("/api/media", mediaRoutes);
app.use("/api/blocks", articleBlockRoutes);
app.use("/api/quiz", quizRoutes);
app.use("/api/gamification", gamificationRoutes);
app.use("/api/cloudfront-media", cloudfrontMediaRoutes);
app.use("/api/magazines", magazineRoutes);
app.use("/api/magazine-admin/issues", magazineAdminRoutes);
app.use("/api/users", userRoutes);

app.use((req, res) => {
  res.status(404).json({ message: "Route not found" });
});

app.use((err, req, res, next) => {
  // multer errors (too big, wrong type) are the client's fault, not a 500
  if (err && err.name === "MulterError") {
    return res.status(400).json({ message: err.message });
  }
  if (err && err.code === "UNSUPPORTED_MEDIA") {
    return res.status(400).json({ message: err.message });
  }
  console.error("Server error:", err);
  res.status(500).json({ message: "Internal server error" });
});

app.listen(PORT, () => {
  console.log(`Impilo Editorial CMS running on port ${PORT}`);
});