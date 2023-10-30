import { NextFunction, Request, Response } from "express";
import jwt from "jsonwebtoken";
import { PrismaClient } from "@prisma/client";
import { IUser } from "../types";

const prisma = new PrismaClient();

// Extend the Request object to include a custom user property
declare global {
  namespace Express {
    interface Request {
      user: string;
    }
  }
}

export const authenticationMiddleware = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const { authorization } = req.headers;
    if (!authorization) {
      return res.status(401).json({ error: "No token provided" });
    }

    const token = authorization;
    // Verify the token here...
    const { _id } = await jwt.verify(token as string, "express");
    const existingUser = await prisma.user.findFirst({
      where: { id: _id },
    });
    if (existingUser) {
      req.user = existingUser.id;
    }
    next();
  } catch (error) {
    console.log(error);
  }
};
