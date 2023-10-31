import cors from "cors";
import express, { Request, Response } from "express";

import userRoutes from "./routes/user.routes";
import categoryRoutes from "./routes/category.routes";
import taskRoutes from "./routes/task.routes";

const app = express();
const corsOptions = {
  origin: "*",
  methods: ["GET", "POST", "DELETE", "PUT", "OPTIONS", "PATH"],
  allowedHeaders: ["Content-Type", "Authorization"],
};
app.use(cors(corsOptions));
app.use(express.json());

const PORT = 8000;

app.get("/ping", (req: Request, res: Response) => {
  res.send("pong");
});

app.use("/users", userRoutes);
app.use("/categories", categoryRoutes);
app.use("/tasks", taskRoutes);

app.listen(PORT, () => {
  console.log("Server up and running");
});
