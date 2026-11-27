// Errors the client caused get a proper 4xx and a stable `code`; only real bugs become a 500.
class HttpError extends Error {
  constructor(status, code, message, extra = {}) {
    super(message);
    this.name = "HttpError";
    this.status = status;
    this.code = code;
    this.extra = extra;
  }
}

class CorsError extends HttpError {
  constructor(origin) {
    super(403, "CORS_ORIGIN_NOT_ALLOWED", "This origin is not allowed to use the API", { origin });
    this.name = "CorsError";
  }
}

// Express error middleware: JSON in, JSON out, never leaks internals.
function errorHandler(err, req, res, next) {
  if (res.headersSent) return next(err);

  const isDev = process.env.NODE_ENV !== "production";
  let status = 500;
  let code = "INTERNAL_ERROR";
  let message = "Internal server error";
  let extra = {};

  if (err instanceof HttpError) {
    ({ status, code, message, extra } = err);
  } else if (err && err.type === "entity.parse.failed") {
    status = 400; code = "BAD_JSON"; message = "Request body is not valid JSON";
  } else if (err && err.type === "entity.too.large") {
    status = 413; code = "BODY_TOO_LARGE"; message = "Request body is too large";
  } else if (err && err.name === "MulterError") {
    status = 400; code = err.code || "UPLOAD_ERROR"; message = err.message;
  } else if (err && err.code === "UNSUPPORTED_MEDIA") {
    status = 400; code = "UNSUPPORTED_MEDIA"; message = err.message;
  } else if (err && err.code === "P2002") {
    status = 409; code = "ALREADY_EXISTS"; message = "That record already exists";
  } else if (err && err.code === "P2025") {
    status = 404; code = "NOT_FOUND"; message = "Record not found";
  }

  if (status >= 500) {
    console.error(`[${req.method} ${req.originalUrl}]`, err);
  } else {
    console.warn(`[${status} ${code}] ${req.method} ${req.originalUrl}${extra.origin ? " origin=" + extra.origin : ""}`);
  }

  const body = { code, message };
  if (extra.origin && isDev) body.origin = extra.origin;
  if (status >= 500 && isDev && err && err.stack) body.detail = String(err.message);
  res.status(status).json(body);
}

// Wrap async route handlers so a thrown error reaches errorHandler (Express 5 does this natively,
// kept for clarity in older code).
const asyncHandler = (fn) => (req, res, next) => Promise.resolve(fn(req, res, next)).catch(next);

module.exports = { HttpError, CorsError, errorHandler, asyncHandler };
