const { PrismaClient } = require("./generated/prisma");
const prisma = new PrismaClient();
const bcrypt = require("bcryptjs");

async function main() {
  // Clear existing data (optional but helpful for testing)
  await prisma.notes.deleteMany();
  await prisma.tasks.deleteMany();
  await prisma.users.deleteMany();

  // Create users with hashed password
  const passwordHash = await bcrypt.hash("password123", 10);
  const user1 = await prisma.users.create({
    data: {
      username: "john_doe",
      password: passwordHash,
      notes: {
        create: [
          {
            title: "First Note",
            content: "Content of the first note",
          },
          {
            title: "Second Note",
            content: "Another note content",
          },
        ],
      },
    },
  });

  const user2 = await prisma.users.create({
    data: {
      username: "jane_doe",
      password: passwordHash,
    },
  });

  // Create standalone tasks
  const tasks = await prisma.tasks.createMany({
    data: [
      { title: "Buy groceries", content: "Milk, Bread, Eggs" },
      { title: "Call Mom", content: "Don’t forget to call her!" },
      { title: "Workout", content: "30 mins cardio + stretching" },
    ],
  });

  console.log("🌱 Seeded users, notes, and tasks successfully.");
  console.log({ user1, user2, tasks });
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(() => prisma.$disconnect());
