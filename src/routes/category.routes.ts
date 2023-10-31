import express from "express";
import {
  createCategory,
  deleteCategory,
  getAllCategories,
  getCategoryById,
  updateCategory,
} from "../controllers/category.controllers";
import { authenticationMiddleware } from "../middleware";

const router = express.Router();
router.use(authenticationMiddleware);
router.route("/").get(getAllCategories);
router.route("/:id").get(getCategoryById);
router.route("/create").post(createCategory);
router.route("/category/:id").delete(deleteCategory);
router.route("/update").put(updateCategory);

export default router;
