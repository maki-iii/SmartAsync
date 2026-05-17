const express = require("express");
const cors = require("cors");

const commandRoutes = require("./routes/commandRoute");
const gestureRoutes = require("./routes/gestureRoute");

const app = express();
const PORT = 3000;

app.use(cors());
app.use(express.json());

app.get("/", (req, res) => {
  res.json({
    message: "SmartSync Backend is running",
  });
});

app.use("/api", commandRoutes);
app.use("/api", gestureRoutes);

app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});