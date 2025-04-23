const express = require("express");
const router = express.Router();
const { getAllTasks, createTask, deleteTask } = require("../controllers/tasksController");

router.get("/", getAllTasks);
router.post("/", createTask);
router.delete("/:id", deleteTask);

module.exports = router;
