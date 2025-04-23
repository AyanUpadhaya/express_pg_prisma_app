const express = require("express");
const dotenv = require("dotenv");
const cors = require("cors");
const tasksRoutes = require("./routes/tasksRoutes");
const userRoutes = require("./routes/userRoutes");
const noteRoutes = require("./routes/noteRoutes");
const errorHandler = require("./middlewares/errorMiddleware");
const { testConnection, getPoolConnection } = require("./db-test");

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

app.use(express.json()); // for parsing JSON
app.use(cors());
app.use("/api/tasks", tasksRoutes);
app.use("/api/users", userRoutes);
app.use("/api/notes", noteRoutes);

app.get("/", (req, res) => {
  return res.send("Server is running");
});

app.use(errorHandler); // error middleware at the end

testConnection()
  .then(() => {
    app.listen(PORT, () => {
      console.log(`Server running on http://localhost:${PORT}`);
    });
  })
  .catch((error) => {
    console.log(error);
    process.exit(1);
  });
