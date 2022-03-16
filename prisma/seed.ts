import { PrismaClient } from "@prisma/client";
import bcrypt from "@node-rs/bcrypt";

const prisma = new PrismaClient();

async function upsertDefaultUser() {
  const userSync = await prisma.user.findFirst({
    where: { email: "you@example.com" },
  });
  if (userSync) {
    return userSync;
  }

  const hashedPassword = await bcrypt.hash("mysupergoodpassword", 10);

  return prisma.user.create({
    data: {
      email: "you@example.com",
      password: {
        create: {
          hash: hashedPassword,
        },
      },
    },
  });
}

async function upsertNote(title: string, userId: string) {
  const note = await prisma.note.findFirst({
    where: { title },
  });
  if (note) {
    return note;
  }

  return prisma.note.create({
    data: {
      title,
      body: "Hello, world!",
      userId: userId,
    },
  });
}

async function seed() {
  const user = await upsertDefaultUser();

  await upsertNote("My first note", user.id);
  await upsertNote("My second note", user.id);

  console.log(`Database has been seeded. 🌱`);
}

seed()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
