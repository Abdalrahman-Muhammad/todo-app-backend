import { PrismaClient } from "@prisma/client";
import { Request, Response } from "express";
import bcrypt from "bcrypt";

const prisma = new PrismaClient();

export const createUser = async (req: Request, res: Response) => {
  try {
    const { name, email, password } = req.body;

    const existingUser = await prisma.user.findUnique({
      where: {
        email: email,
      },
    });
    if (existingUser) {
      return res.status(409).send("user already exist");
    }

    const hashedPassword = await bcrypt.hash(password, 12);
    const user = await prisma.user.create({
      data: {
        name,
        email,
        password: hashedPassword,
      },
    });

    return res.status(201).send("User created successfully");
  } catch (error) {
    console.log("error in createUser", error);
  } finally {
    await prisma.$disconnect();
  }
};

const loginUser = async (req: Request, res: Response) => {
  try {
  } catch (error) {
    console.log("err");
  }
};
