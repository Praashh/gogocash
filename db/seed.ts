import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();
async function main() {
  try {
    await prisma.user.create({
      data: {
        name: "Praash",
        email: "hello.praash@gmail.com",
        password: "123456",
      },
    });
    console.log("User created");
  } catch (error) {
    console.error(error);
  } finally {
    await prisma.$disconnect();
  }
}

main();
