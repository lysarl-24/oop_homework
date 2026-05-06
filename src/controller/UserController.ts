import { Request, Response } from "express";
import { BaseController } from "./baseController";
import { UserService } from "../service/User";

export class UserController extends BaseController {
  static async getUsers(_req: Request, res: Response): Promise<void> {
    try {
      const users = await UserService.getUsers();
      UserController.ok(res, "Users fetched", users);
    } catch (error) {
      UserController.serverError(res, "Failed to fetch users", error);
    }
  }

  static async getUserById(req: Request, res: Response): Promise<void> {
    try {
      const id = Number(req.params.id);
      const user = await UserService.getUserById(id);
      if (!user) {
        UserController.notFound(res, "User not found");
        return;
      }
      UserController.ok(res, "User fetched", user);
    } catch (error) {
      if (error instanceof Error && error.message === "Invalid user id") {
        UserController.badRequest(res, error.message);
        return;
      }
      UserController.serverError(res, "Failed to fetch user", error);
    }
  }

  static async createUser(req: Request, res: Response): Promise<void> {
    try {
      const { name, email } = req.body as { name?: string; email?: string };
      const created = await UserService.createUser({
        name: name ?? "",
        email: email ?? ""
      });
      UserController.created(res, "User created", created);
    } catch (error) {
      if (error instanceof Error && error.message === "name and email are required") {
        UserController.badRequest(res, error.message);
        return;
      }
      UserController.serverError(res, "Failed to create user", error);
    }
  }

  static async updateUser(req: Request, res: Response): Promise<void> {
    try {
      const id = Number(req.params.id);
      const payload = req.body as { name?: string; email?: string };
      const updated = await UserService.updateUser(id, payload);

      if (!updated) {
        UserController.notFound(res, "User not found");
        return;
      }

      UserController.ok(res, "User updated", updated);
    } catch (error) {
      if (
        error instanceof Error &&
        (error.message === "Invalid user id" ||
          error.message === "At least one field is required for update")
      ) {
        UserController.badRequest(res, error.message);
        return;
      }
      UserController.serverError(res, "Failed to update user", error);
    }
  }

  static async deleteUser(req: Request, res: Response): Promise<void> {
    try {
      const id = Number(req.params.id);
      const deleted = await UserService.deleteUser(id);

      if (!deleted) {
        UserController.notFound(res, "User not found");
        return;
      }

      UserController.ok(res, "User deleted");
    } catch (error) {
      if (error instanceof Error && error.message === "Invalid user id") {
        UserController.badRequest(res, error.message);
        return;
      }
      UserController.serverError(res, "Failed to delete user", error);
    }
  }
}
