const express = require("express");
const cors = require("cors");
const logger = require("./src/routes/logger.js");
const db = require("./src/config/database.js");
const proxyRouter = require("./src/routes/proxy.js");
const routes = require("./src/routes/index.js");
const session = require("express-session");
const cookieParser = require("cookie-parser");
const fs = require("fs");
const path = require("path"); 

const app = express();
const NODE_ENV = process.env.NODE_ENV || "development";
const IS_PROD = NODE_ENV === "production";

const SESSION_SECRET = process.env.SESSION_SECRET || "your_secret_key";

app.use((req, res, next) => {
  res.setHeader("Cache-Control", "no-store");
  next();
});

app.use(cookieParser());
 
// 🔁 Middleware
app.use(cors({
  origin: [/\.nagarkaryavalinewuat\.com$/, "http://localhost:5173"],
  credentials: true
}));
app.use(express.json({ limit: '50mb' }));
app.use(express.urlencoded({ limit: '50mb', extended: true }));

// 🔐 Session (must be before route usage)
app.use(session({
  secret: SESSION_SECRET,
  resave: false,
  saveUninitialized: false,
  cookie: {
    httpOnly: true,
    secure: IS_PROD, // Set true in production (HTTPS)
    sameSite: "Strict",
    domain: ".nagarkaryavalinewuat.com", // Shared domain for all modules
    maxAge: 60 * 60 * 1000 // 1 hour
  }
}));
logger.info("Session middleware initialized");

// 🔗 Routes
app.use("/proxy", proxyRouter);
app.use("/", routes);
logger.info("Routes loaded");

// 🔌 Initialize DB Connection
// Catch unhandled exceptions
process.on('uncaughtException', (err) => {
  logger.error('Uncaught Exception:', err);
  process.exit(1); // optional: exit process
});

process.on('unhandledRejection', (reason, promise) => {
  logger.error('Unhandled Rejection:', reason);
});
db.initialize()
  .then(() => {
    logger.info("🔌 Oracle DB Connection Pool Initialized");
    console.log("Oracle DB Connection Pool Initialized");

    const PORT = process.env.PORT || 5000;
    app.listen(PORT, () => {
      logger.info(`Server started on port ${PORT}`);
      console.log(`Server running on port ${PORT}`);
    });
  })
  .catch((err) => {
    logger.error("Database Initialization Failed: " + err.message);
    console.error("Database Initialization Failed:", err);
    process.exit(1);
  });
