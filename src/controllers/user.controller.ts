import { Request, Response } from "express";
import { UserModel } from "../models/user.model";

export class UserController {
  static async getUsers(_req: Request, res: Response): Promise<void> {
    try {
      const users = await UserModel.findAll();
      res.status(200).json({ message: "Users fetched", data: users });
    } catch (error) {
      res.status(500).json({
        message: "Failed to fetch users",
        error: error instanceof Error ? error.message : "Unknown error"
      });
    }
  }

  // Get users
  static async getUserById(req: Request, res: Response): Promise<void> {
    try {
      const id = Number(req.params.id);
      const user = await UserModel.findById(id);
      if (!user) {
        res.status(404).json({ message: "User not found" });
        return;
      }
      res.status(200).json({ message: "User fetched", data: user });
    } catch (error) {
      res.status(500).json({
        message: "Failed to fetch user",
        error: error instanceof Error ? error.message : "Unknown error"
      });
    }
  }

  // Create user
  static async createUser(req: Request, res: Response): Promise<void> {
    try {
      // object destructuring
      const { name, email } = req.body as { name?: string; email?: string };
      if (!name || !email) {
        res.status(400).json({ message: "name and email are required" });
        return;
      }

      const created = await UserModel.create({ name, email });
      res.status(201).json({ message: "User created", data: created });
    } catch (error) {
      res.status(500).json({
        message: "Failed to create user",
        error: error instanceof Error ? error.message : "Unknown error"
      });
    }
  }

  // Update user
  static async updateUser(req: Request, res: Response): Promise<void> {
    try {
      const id = Number(req.params.id);
      const payload = req.body as { name?: string; email?: string };

      // array destructuring
      const values = [payload.name, payload.email];
      const [name, email] = values;

      const updated = await UserModel.update(id, { name, email });
      if (!updated) {
        res.status(404).json({ message: "User not found" });
        return;
      }

      res.status(200).json({ message: "User updated", data: updated });
    } catch (error) {
      res.status(500).json({
        message: "Failed to update user",
        error: error instanceof Error ? error.message : "Unknown error"
      });
    }
  }

  // Delelte user
  static async deleteUser(req: Request, res: Response): Promise<void> {
    try {
      const id = Number(req.params.id);
      const deleted = await UserModel.delete(id);
      if (!deleted) {
        res.status(404).json({ message: "User not found" });
        return;
      }

      res.status(200).json({ message: "User deleted" });
    } catch (error) {
      res.status(500).json({
        message: "Failed to delete user",
        error: error instanceof Error ? error.message : "Unknown error"
      });
    }
  }
}
