import express from "express";
import bodyParser from "body-parser";
import mongoose from "mongoose";
import cors from "cors";
import dotenv from "dotenv";

// Load environment variables
dotenv.config();

// Create Express app
const app = express();

// Configure CORS
app.use(
  cors({
    origin:
      process.env.APPLICATION_URL ||
      "https://memories-project-client.vercel.app",
    methods: ["GET", "POST", "PATCH", "DELETE"],
    allowedHeaders: ["Content-Type", "Authorization"],
  })
);

console.log(
  "CORS allowed origin:",
  process.env.APPLICATION_URL || "https://memories-project-client.vercel.app"
);

// Middleware for handling incoming JSON data
app.use(bodyParser.json({ limit: "30mb", extended: true }));
app.use(bodyParser.urlencoded({ limit: "30mb", extended: true }));

// Routes
const postRoutes = (await import("./routes/posts.js")).default;
const userRoutes = (await import("./routes/users.js")).default;

app.use("/posts", postRoutes);
app.use("/user", userRoutes);

// Add a root route
app.get("/", (req, res) => {
  res.send("Memories Project API is running");
});

// Handle favicon requests
app.get("/favicon.ico", (req, res) => res.status(204).end());

const PORT = process.env.PORT || 5000;

// Connect to MongoDB and start the server
try {
  await mongoose.connect(process.env.CONNECTION_URL);
  app.listen(PORT, () => console.log(`Server running on port: ${PORT}`));
} catch (error) {
  console.log("Error connecting to MongoDB or starting server:", error.message);
}
