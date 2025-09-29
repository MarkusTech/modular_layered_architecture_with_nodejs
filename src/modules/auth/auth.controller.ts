import { Request, Response } from "express";
import * as AuthService from "./auth.service";
import bcrypt from "bcryptjs";
import prisma from "../../config/prismaClient";

// register controller
export async function register(req: Request, res: Response) {
  const { email, password, name, tenantId, role } = req.body;

  // hash password
  const hashedPassword = await bcrypt.hash(password, 10);

  const user = await prisma.user.create({
    data: {
      email,
      password: hashedPassword,
      name,
      role: role || "USER", // default to USER if not provided
    },
  });

  res.status(201).json({
    id: user.id,
    email: user.email,
    name: user.name,
    role: user.role,
  });
}

export async function login(req: Request, res: Response) {
  const { email, password } = req.body;
  const result = await AuthService.login(email, password);
  res.json(result);
}

export async function refreshToken(req: Request, res: Response) {
  const { refreshToken } = req.body;
  const result = await AuthService.refreshToken(refreshToken);
  res.json(result);
}