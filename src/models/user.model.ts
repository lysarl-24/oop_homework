import { db } from "../config/db";

export interface IUser {
  id: number;
  name: string;
  email: string;
}

export interface CreateUserDTO {
  name: string;
  email: string;
}

export interface UpdateUserDTO {
  name?: string;
  email?: string;
}

export class UserModel {
  static async initTable(): Promise<void> {
    await db.execute(`
      CREATE TABLE IF NOT EXISTS users (
        id INT AUTO_INCREMENT PRIMARY KEY,
        name VARCHAR(100) NOT NULL,
        email VARCHAR(120) NOT NULL UNIQUE
      )
    `);
  } 

  // Get all users
  static async findAll(): Promise<IUser[]> {
    const [rows] = await db.query(
      "SELECT id, name, email FROM users ORDER BY id DESC"
    );
    return rows as IUser[];
  }
  
  // Get user by ID
  static async findById(id: number): Promise<IUser | null> {
    const [rows] = await db.query("SELECT id, name, email FROM users WHERE id = ?", [id]);
    const users = rows as IUser[];
    return users[0] ?? null;
  }

  // Create user
  static async create(data: CreateUserDTO): Promise<IUser> {
    const { name, email } = data;
    const [result] = await db.execute(
      "INSERT INTO users (name, email) VALUES (?, ?)",
      [name, email]
    );

    const insertResult = result as { insertId: number };
    const newUser = await this.findById(insertResult.insertId);
    if (!newUser) {
      throw new Error("Failed to create user.");
    }
    return newUser;
  }
  
  // Update user
  static async update(id: number, data: UpdateUserDTO): Promise<IUser | null> {
    const current = await this.findById(id);
    if (!current) return null;

    // object destructuring + spread
    const merged = { ...current, ...data };
    const { name, email } = merged;

    await db.execute("UPDATE users SET name = ?, email = ? WHERE id = ?", [
      name,
      email,
      id
    ]);
    return this.findById(id);
  }
  
  // Delete user
  static async delete(id: number): Promise<boolean> {
    const [result] = await db.execute("DELETE FROM users WHERE id = ?", [id]);
    const deleteResult = result as { affectedRows: number };
    return deleteResult.affectedRows > 0;
  }
}
