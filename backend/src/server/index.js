const express = require("express");
const cors = require("cors");

const commandRoutes = require("./routes/commandRoute");
const gestureRoutes = require("./routes/gestureRoute");

const app = express();

const PORT = process.env.PORT || 3000;

app.use(
  cors({
    origin: "*",
    methods: ["GET", "POST", "PUT", "DELETE"],
    credentials: true,
  })
);

app.use(express.json());

app.get("/", (req, res) => {
  res.status(200).json({
    success: true,
    message: "SmartSync Backend is running",
    status: "online",
  });
});

app.use("/api", commandRoutes);
app.use("/api", gestureRoutes);

app.use((req, res) => {
  res.status(404).json({
    success: false,
    message: "Route not found",
  });
});

app.use((error, req, res, next) => {
  console.error(error);

  res.status(500).json({
    success: false,
    message: "Internal server error",
  });
});

app.listen(PORT, "0.0.0.0", () => {
  console.log(`Server running on port ${PORT}`);
});