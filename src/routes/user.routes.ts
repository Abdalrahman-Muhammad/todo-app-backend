import express from "express";
import { createUser, loginUser } from "../controllers/user.controller";

const router = express.Router();

router.route("/create").post(createUser);
router.route("/login").post(loginUser);

export default router;
