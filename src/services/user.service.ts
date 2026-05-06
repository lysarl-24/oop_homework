import {
  CreateUserDTO,
  IUser,
  UpdateUserDTO,
  UserModel
} from "../models/user.model";

export class UserService {
  static async getUsers(): Promise<IUser[]> {
    return UserModel.findAll();
  }

  static async getUserById(id: number): Promise<IUser | null> {
    if (!Number.isInteger(id) || id <= 0) {
      throw new Error("Invalid user id");
    }
    return UserModel.findById(id);
  }

  static async createUser(data: CreateUserDTO): Promise<IUser> {
    const name = data.name?.trim();
    const email = data.email?.trim();

    if (!name || !email) {
      throw new Error("name and email are required");
    }

    return UserModel.create({ name, email });
  }

  static async updateUser(id: number, data: UpdateUserDTO): Promise<IUser | null> {
    if (!Number.isInteger(id) || id <= 0) {
      throw new Error("Invalid user id");
    }

    const payload: UpdateUserDTO = {};
    if (data.name !== undefined) payload.name = data.name.trim();
    if (data.email !== undefined) payload.email = data.email.trim();

    if (Object.keys(payload).length === 0) {
      throw new Error("At least one field is required for update");
    }

    return UserModel.update(id, payload);
  }

  static async deleteUser(id: number): Promise<boolean> {
    if (!Number.isInteger(id) || id <= 0) {
      throw new Error("Invalid user id");
    }

    return UserModel.delete(id);
  }
}
