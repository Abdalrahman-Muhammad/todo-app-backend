import express, { Request, Response } from "express";

import userRouter from "./routes/user.routes";

const app = express();

app.use(express.json());

const PORT = 1337;

app.get("/ping", (req: Request, res: Response) => {
  res.send("pong");
});

app.use("/user", userRouter);
app.listen(PORT, () => {
  console.log("Server up and running");
});
