import express from "express";
import userRouter from "./routes/userRoutes";

const app = express();

app.use(express.json());

app.get("/", (_req, res) => {
  res.json({ message: "OOP MVC User API is running" });
});

app.use("/api/users", userRouter);

export default app;
