import { Response } from "express";

export class BaseController {
  protected static ok(res: Response, message: string, data?: unknown): void {
    res.status(200).json({ message, data });
  }

  protected static created(res: Response, message: string, data?: unknown): void {
    res.status(201).json({ message, data });
  }

  protected static badRequest(res: Response, message: string): void {
    res.status(400).json({ message });
  }

  protected static notFound(res: Response, message: string): void {
    res.status(404).json({ message });
  }

  protected static serverError(res: Response, message: string, error: unknown): void {
    res.status(500).json({
      message,
      error: error instanceof Error ? error.message : "Unknown error"
    });
  }
}
