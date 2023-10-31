import { Request, Response } from "express";
import { PrismaClient } from "@prisma/client";
import { ICategory } from "../types";
const prisma = new PrismaClient();

export const getAllCategories = async (req: Request, res: Response) => {
  try {
    const { user } = req;

    const categories = await prisma.category.findMany({
      where: { userId: user },
    });

    // Fetch the associated Color and Icon records for each category
    const categoriesWithDetails = await Promise.all(
      categories.map(async (category) => {
        const categoryWithColor = await prisma.category.findUnique({
          where: { id: category.id },
          include: { color: true, icon: true },
        });

        return categoryWithColor;
      })
    );

    return res.status(200).json(categoriesWithDetails);
  } catch (error) {
    console.log("Error getting all categories", error);
  } finally {
    await prisma.$disconnect();
  }
};
export const getCategoryById = async (req: Request, res: Response) => {
  try {
    const { user } = req;
    const { id } = req.params;

    const category = await prisma.category.findUnique({
      where: { id: id },
    });
    if (!category) {
      // Handle the case where the category with the specified ID is not found
      return res.status(404).json({ error: "Category not found" });
    }
    // Fetch the associated Color and Icon records for each category
    const categoryWithDetails = await prisma.category.findUnique({
      where: { id: category.id },
      include: { color: true, icon: true },
    });

    res.status(200).json(categoryWithDetails);
  } catch (error) {
    console.log("Error getting all categories", error);
  } finally {
    await prisma.$disconnect();
  }
};

export const createCategory = async (req: Request, res: Response) => {
  try {
    const { color, icon, isEditable, name }: ICategory = req.body;
    const { user } = req;
    const newColor = await prisma.color.create({ data: color });
    const newIcon = await prisma.icon.create({ data: icon });
    const category = await prisma.category.create({
      data: {
        isEditable,
        name,
        userId: user,
        colorId: newColor.id,
        iconId: newIcon.id,
      },
    });

    // Fetch the actual Color and Icon records based on their IDs
    const actualColor = await prisma.color.findUnique({
      where: { id: newColor.id },
    });

    const actualIcon = await prisma.icon.findUnique({
      where: { id: newIcon.id },
    });

    // Return the response with actual Color and Icon data
    res.status(201).json({
      id: category.id,
      name: category.name,
      isEditable: category.isEditable,
      color: actualColor,
      icon: actualIcon,
      userId: category.userId,
    });
  } catch (error) {
    console.log("Error creating category", error);
    res.json({ error: "Something went wrong" });
  } finally {
    await prisma.$disconnect();
  }
};

export const deleteCategory = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const deletedCategory = await prisma.category.delete({
      where: { id: id },
    });
    if (!deletedCategory) throw Error("No Category Found");
    res.sendStatus(204);
  } catch (error) {
    console.log("Error deleting category", error);
    res.json({ error: "Something went wrong" });
  } finally {
    await prisma.$disconnect();
  }
};

export const updateCategory = async (req: Request, res: Response) => {
  try {
    const { id, color, icon, isEditable, name }: ICategory = req.body;

    await prisma.category.update({
      where: { id: id },
      data: {
        isEditable,
        name,
        color: {
          update: { code: color.code, name: color.name },
        },
        icon: {
          update: { name: icon.name, symbol: icon.symbol },
        },
      },
    });
    res.status(201).json({ message: "Category updated successfully" });
  } catch (error) {
    console.log("Error updating category", error);
    res.json({ error: "Something went wrong" });
  } finally {
    await prisma.$disconnect();
  }
};
