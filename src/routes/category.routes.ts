import express from "express";
import {
  createCategory,
  deletCategory,
  getAllCategories,
  updateCategory,
} from "../controllers/category.controllers";
import { authenticationMiddleware } from "../middleware";

const router = express.Router();
router.use(authenticationMiddleware);
router.route("/").get(getAllCategories);
router.route("/create").post(createCategory);
router.route("/category/:id").delete(deletCategory);
router.route("/update").put(updateCategory);

export default router;
