import { Request, Response } from "express";
import { PrismaClient } from "@prisma/client";
import { ITask } from "../types";

const prisma = new PrismaClient();

export const getAllTasks = async (req: Request, res: Response) => {
  try {
    const userId = req.user;

    const tasks = await prisma.task.findMany({
      where: { userId },
    });

    return res.status(200).json(tasks);
  } catch (error) {
    console.log("Error getting all tasks", error);
    return res.status(500).json({ error: "Error while fetching the tasks" });
  } finally {
    await prisma.$disconnect();
  }
};

export const getAllTasksByCategory = async (req: Request, res: Response) => {
  console.log("here");
  try {
    const userId = req.user;
    const { categoryId } = req.params;
    const tasks = await prisma.task.findMany({ where: { userId, categoryId } });

    return res.status(200).json(tasks);
  } catch (error) {
    console.log("Error in getAllTasksByCategory", error);
    return res.status(500).json({ error: "Error while fetching the tasks" });
  } finally {
    await prisma.$disconnect();
  }
};

export const getAllCompletedTasks = async (req: Request, res: Response) => {
  try {
    const userId = req.user;
    const tasks = await prisma.task.findMany({
      where: { userId, isCompleted: true },
    });
    res.status(200).json(tasks);
  } catch (error) {
    console.log("Error in getAllCompletedTasks", error);
    return res.status(500).json({ error: "Error while fetching the tasks" });
  } finally {
    await prisma.$disconnect();
  }
};

export const getTasksForToday = async (req: Request, res: Response) => {
  try {
    const userId = req.user;
    const todaysISODate = new Date();
    todaysISODate.setHours(0, 0, 0, 0);

    const tasks = await prisma.task.findMany({
      where: { userId, date: todaysISODate.toISOString() },
    });
    return res.status(200).json(tasks);
  } catch (error) {
    console.log("Error in getTasksForToday", error);
    return res.status(500).json({ error: "Error while fetching the tasks" });
  } finally {
    await prisma.$disconnect();
  }
};

export const createTask = async (req: Request, res: Response) => {
  try {
    const userId = req.user;
    const { name, date, categoryId }: ITask = req.body;

    const task = await prisma.task.create({
      data: {
        name,
        date,
        categoryId,
        userId,
      },
    });
    res.status(201).json(task);
  } catch (error) {
    console.log("Error creating task", error);
    return res.status(500).json({ error: "Error while creating the task" });
  } finally {
    await prisma.$disconnect();
  }
};

export const toggleTaskStatus = async (req: Request, res: Response) => {
  try {
    console.log("in toggle");
    const { isCompleted } = req.body;
    const { id } = req.params;
    const task = await prisma.task.update({
      where: { id },
      data: { isCompleted },
    });
    res.status(200).json(task);
  } catch (error) {
    console.log("Error in toggleTaskStatus", error);
    return res.status(500).json({ error: "Error while toggling task status" });
  } finally {
    await prisma.$disconnect();
  }
};

export const deleteTask = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    await prisma.task.delete({
      where: { id },
    });
    return res.status(200).json({ message: "Task deleted" });
  } catch (error) {
    console.log("Error in deleteTask", error);
    return res.status(500).json({ error: "Error while deleteing task " });
  } finally {
    await prisma.$disconnect();
  }
};

export const editTask = async (req: Request, res: Response) => {
  try {
    const { id }: ITask = req.body; // The only required field is 'id'
    const dataToUpdate: { categoryId?: string; date?: string; name?: string } =
      {};

    // Check if optional fields are provided in the request body
    if (req.body.categoryId) {
      dataToUpdate.categoryId = req.body.categoryId;
    }
    if (req.body.date) {
      dataToUpdate.date = req.body.date;
    }
    if (req.body.name) {
      dataToUpdate.name = req.body.name;
    }

    if (Object.keys(dataToUpdate).length === 0) {
      // If no fields to update are provided, respond with a bad request status
      return res
        .status(400)
        .json({ error: "No valid fields to update provided" });
    }

    await prisma.task.update({
      where: { id },
      data: dataToUpdate, // Only update the provided fields
    });

    return res.status(200).json({ message: "Task updated successfully" });
  } catch (error) {
    console.log("Error in editTask", error);
    return res.status(500).json({ error: "Error while editing task" });
  } finally {
    await prisma.$disconnect();
  }
};
