import { PrismaClient } from "@prisma/client";
import { Request, Response } from "express";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import { IUser } from "../types";

const prisma = new PrismaClient();

const getUserToken = (_id: String) => {
  const authenticatedUserToken = jwt.sign({ _id }, "express", {
    expiresIn: "7d",
  });
  return authenticatedUserToken;
};

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

export const loginUser = async (req: Request, res: Response) => {
  try {
    const { email, password }: IUser = req.body;
    const existingUser = await prisma.user.findUnique({
      where: { email },
    });
    if (!existingUser)
      return res.status(409).json({ message: "User doesn't exist" });

    const isPasswordIdentical = await bcrypt.compare(
      password,
      existingUser.password
    );
    if (isPasswordIdentical) {
      const token = getUserToken(existingUser.id);
      return res.status(200).send({
        token,
        user: {
          email: existingUser.email,
          name: existingUser.name,
        },
      });
    } else {
      return res.status(403).send({ message: "Wrong credentials" });
    }
  } catch (error) {
    console.log("error in loginUser", error);
  } finally {
    await prisma.$disconnect();
  }
};
