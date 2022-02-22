import bcrypt from "@node-rs/bcrypt";
import { prisma } from "~/db.server";

export async function getUserByEmail(email: string) {
  return prisma.user.findUnique({ where: { email } });
}

export async function createUser(email: string, password: string) {
  const hashedPassword = await bcrypt.hash(password, 10);
  const user = await prisma.user.create({
    data: {
      email,
      password: {
        create: {
          hash: hashedPassword,
        },
      },
    },
  });

  return user;
}

export async function verifyLogin(email: string, password: string) {
  const user = await prisma.user.findUnique({
    where: { email },
    include: {
      password: true,
    },
  });

  if (!user || !user.password) {
    return undefined;
  }

  const isValid = await bcrypt.verify(password, user.password.hash);

  if (!isValid) {
    return undefined;
  }

  const { password: _password, ...userWithoutPassword } = user;

  return userWithoutPassword;
}
