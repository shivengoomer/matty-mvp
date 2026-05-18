// server.js
const express = require("express");
const http = require("http");
const dotenv = require("dotenv");
const cors = require("cors");
const connectDB = require("./Config/db");
const setupSocket = require("./socket");
const rateLimiter = require("./src/middleware/rateLimiter");
const { notFound, errorHandler } = require("./src/middleware/errorHandler");

dotenv.config(); // Load environment variables from .env file
const app = express();
const server = http.createServer(app);
const PORT = process.env.PORT || 5000;

// Connect to MongoDB
connectDB();

// Initialize Socket.io
setupSocket(server);

app.use(
  cors({
    origin: process.env.CLIENT_URL || "https://matty-lilac.vercel.app",
    methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
    allowedHeaders: ["Content-Type", "Authorization"],
    credentials: true,
  })
);

app.disable("x-powered-by");
app.use((req, res, next) => {
  res.setHeader("X-Content-Type-Options", "nosniff");
  res.setHeader("X-Frame-Options", "DENY");
  res.setHeader("Referrer-Policy", "strict-origin-when-cross-origin");
  next();
});
app.use(rateLimiter());
app.use(express.json({ limit: "20mb" }));
app.use(express.urlencoded({ limit: "20mb", extended: true }));

// Import routes
const authRoutes = require("./src/modules/auth/auth.routes");
const workspaceRoutes = require("./src/modules/workspace/workspace.routes");
const eventRoutes = require("./src/modules/events/event.routes");
const designRoutes = require("./Routes/designs");
const adminRoutes = require("./Routes/admin");
const templateRoutes = require("./Routes/templates"); // 👈 NEW
const { createRouteHandler } = require("uploadthing/express");
const { uploadRouter } = require("./uploadthing");

// Use routes
app.use("/api/auth", authRoutes);
app.use("/api/workspaces", workspaceRoutes);
app.use("/api/events", eventRoutes);
app.use("/api/designs", designRoutes);
app.use("/api/admin", adminRoutes);
app.use("/api/templates", templateRoutes);

app.use(
  "/api/uploadthing",
  createRouteHandler({
    router: uploadRouter,
  })
);

// Basic route
app.get("/", (_req, res) => {
  res.send("✅ Matty API is running...");
});

app.use(notFound);
app.use(errorHandler);

// Start server
server.listen(PORT, () => {
  console.log(`🚀 Server running on port ${PORT}`);
});
