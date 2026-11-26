const rateLimit = require("express-rate-limit");

const make = (windowMinutes, max, message) =>
  rateLimit({
    windowMs: windowMinutes * 60 * 1000,
    limit: max,
    standardHeaders: true,
    legacyHeaders: false,
    message: { message },
  });

// Everything under /api: generous, stops floods.
const apiLimiter = make(1, 300, "Too many requests, slow down.");

// Editorial login: slows password guessing.
const loginLimiter = make(15, 10, "Too many login attempts. Try again in 15 minutes.");

// Anonymous reader account creation.
const identityLimiter = make(60, 30, "Too many sign-ups from this network. Try again later.");

// Username attempts (the once-a-day rule is enforced separately in the controller).
const usernameLimiter = make(60, 20, "Too many username attempts. Try again later.");

module.exports = { apiLimiter, loginLimiter, identityLimiter, usernameLimiter };
// NOTE: the default store is in memory, per pm2 process. With "instances: max" the real limit is
// multiplied by the number of CPU cores. Use fewer instances (see ecosystem.config.js).