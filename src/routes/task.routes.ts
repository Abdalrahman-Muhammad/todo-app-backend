import express from "express";
import { authenticationMiddleware } from "../middleware";
import {
  createTask,
  deleteTask,
  editTask,
  getAllCompletedTasks,
  getAllTasks,
  getAllTasksByCategory,
  getTasksForToday,
  toggleTaskStatus,
} from "../controllers/task.controller";
const router = express.Router();

router.use(authenticationMiddleware);

router.route("/").get(getAllTasks);
router.route("/tasks-by-categories/:categoryId").get(getAllTasksByCategory);
router.route("/completed").get(getAllCompletedTasks);
router.route("/today").get(getTasksForToday);
router.route("/create").post(createTask);
router.route("/update/:id").put(toggleTaskStatus);
router.route("/:id").delete(deleteTask);
router.route("/edit/:id").put(editTask);

export default router;
