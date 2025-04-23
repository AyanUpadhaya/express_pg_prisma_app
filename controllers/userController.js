const { PrismaClient } = require("../generated/prisma");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const prisma = new PrismaClient();

exports.register = async (req, res, next) => {
  try {
    const { username, password } = req.body;
    const hashedPassword = await bcrypt.hash(password, 10);

    const user = await prisma.users.create({
      data: { username, password: hashedPassword },
    });

    res.status(201).json({
      message: "User registered",
      user: { id: user.id, username: user.username },
    });
  } catch (err) {
    next(err);
  }
};

async function comparePassword(plainTextPassword, hashedPassword) {
  try {
    const isMatch = await bcrypt.compare(plainTextPassword, hashedPassword);
    return isMatch;
  } catch (error) {
    console.error("Error comparing passwords:", error);
    return false;
  }
}

exports.login = async (req, res, next) => {
  const { username, password } = req.body;

  try {
    const { username, password } = req.body;
    const user = await prisma.users.findUnique({ where: { username } });

    if (!user || !(await comparePassword(password, user.password))) {
      return res.status(401).json({ message: "Invalid credentials" });
    }

    const token = jwt.sign(
      { id: user.id, username},
      process.env.JWT_SECRET,
      {
        expiresIn: "7d",
      }
    );

    res.json({ message: "Login successful", token });
  } catch (err) {
    next(err);
  }
};

exports.getAllUsers = async (req, res, next) => {
  try {
    const users = await prisma.users.findMany();
    res.json(users);
  } catch (error) {
    next(error);
  }
};
exports.getSingleUser = async (req, res, next) => {
  try {
    const user = await prisma.users.findUnique({
      where: { username: req.query.username },
    });
    const { password: _, ...userWithoutPassword } = user;
    res.json(userWithoutPassword);
  } catch (error) {
    next(error);
  }
};
