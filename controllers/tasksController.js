const { PrismaClient } = require("../generated/prisma");
const prisma = new PrismaClient();

exports.getAllTasks = async (req, res, next) => {
  try {
    const tasks = await prisma.tasks.findMany();
    res.json(tasks);
  } catch (err) {
    next(err);
  }
};

exports.createTask = async (req, res, next) => {
  try {
    const { title, content } = req.body;
    const task = await prisma.tasks.create({
      data: { title, content },
    });
    res.status(201).json(task);
  } catch (err) {
    next(err);
  }
};
