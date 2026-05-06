import { Request, Response } from "express";
import { UserService } from "../services/user.service";

export class UserController {
  static async getUsers(_req: Request, res: Response): Promise<void> {
    try {
      const users = await UserService.getUsers();
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
      const user = await UserService.getUserById(id);
      if (!user) {
        res.status(404).json({ message: "User not found" });
        return;
      }
      res.status(200).json({ message: "User fetched", data: user });
    } catch (error) {
      if (error instanceof Error && error.message === "Invalid user id") {
        res.status(400).json({ message: error.message });
        return;
      }
      res.status(500).json({
        message: "Failed to fetch user",
        error: error instanceof Error ? error.message : "Unknown error"
      });
    }
  }

  // Create user
  static async createUser(req: Request, res: Response): Promise<void> {
    try {
      const { name, email } = req.body as { name?: string; email?: string };
      const created = await UserService.createUser({ name: name ?? "", email: email ?? "" });
      res.status(201).json({ message: "User created", data: created });
    } catch (error) {
      if (error instanceof Error && error.message === "name and email are required") {
        res.status(400).json({ message: error.message });
        return;
      }
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
      const updated = await UserService.updateUser(id, payload);
      if (!updated) {
        res.status(404).json({ message: "User not found" });
        return;
      }

      res.status(200).json({ message: "User updated", data: updated });
    } catch (error) {
      if (
        error instanceof Error &&
        (error.message === "Invalid user id" ||
          error.message === "At least one field is required for update")
      ) {
        res.status(400).json({ message: error.message });
        return;
      }
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
      const deleted = await UserService.deleteUser(id);
      if (!deleted) {
        res.status(404).json({ message: "User not found" });
        return;
      }

      res.status(200).json({ message: "User deleted" });
    } catch (error) {
      if (error instanceof Error && error.message === "Invalid user id") {
        res.status(400).json({ message: error.message });
        return;
      }
      res.status(500).json({
        message: "Failed to delete user",
        error: error instanceof Error ? error.message : "Unknown error"
      });
    }
  }
}
