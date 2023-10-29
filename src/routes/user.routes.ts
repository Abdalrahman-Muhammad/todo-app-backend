import express from "express";
import { createUser } from "../controllers/user.controller";

const router = express.Router();

router.route("/create").post(createUser);

export default router;
