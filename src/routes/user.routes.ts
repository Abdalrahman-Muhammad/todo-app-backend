import express from "express";
import { createUser, loginUser } from "../controllers/user.controller";

const router = express.Router();

router.route("/create").post((req, res, next) => {
  console.log("here");
  next();
}, createUser);
router.route("/login").post(loginUser);

export default router;
