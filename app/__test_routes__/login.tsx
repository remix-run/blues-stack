import type { LoaderFunction } from "remix";
import { prisma } from "~/db.server";
import bcrypt from "~/bcrypt.server";
import { createUserSession } from "~/session.server";

export const loader: LoaderFunction = async ({ request }) => {
  const url = new URL(request.url);
  const email = url.searchParams.get("email");
  if (!email) {
    throw new Error("email required for login page");
  }
  if (!email.endsWith("example.com")) {
    throw new Error("All test emails must end in example.com");
  }

  let user = await prisma.user.findFirst({ where: { email } });
  if (!user) {
    const hashedPassword = await bcrypt.hash("mysupergoodpassword", 10);
    user = await prisma.user.create({
      data: { email, password: { create: { hash: hashedPassword } } },
    });
  }
  return createUserSession(request, user.id, "/");
};
