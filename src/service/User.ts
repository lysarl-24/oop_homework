import { CreateUserDTO, IUser, UpdateUserDTO, UserModel } from "../models/User";

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

  static async createUser(payload: CreateUserDTO): Promise<IUser> {
    const { name, email } = payload;
    const safeName = name?.trim();
    const safeEmail = email?.trim();

    if (!safeName || !safeEmail) {
      throw new Error("name and email are required");
    }

    return UserModel.create({ name: safeName, email: safeEmail });
  }

  static async updateUser(id: number, payload: UpdateUserDTO): Promise<IUser | null> {
    if (!Number.isInteger(id) || id <= 0) {
      throw new Error("Invalid user id");
    }

    const values = [payload.name, payload.email];
    const [name, email] = values;

    const data: UpdateUserDTO = {};
    if (name !== undefined) data.name = name.trim();
    if (email !== undefined) data.email = email.trim();

    if (Object.keys(data).length === 0) {
      throw new Error("At least one field is required for update");
    }

    return UserModel.update(id, data);
  }

  static async deleteUser(id: number): Promise<boolean> {
    if (!Number.isInteger(id) || id <= 0) {
      throw new Error("Invalid user id");
    }

    return UserModel.delete(id);
  }
}
