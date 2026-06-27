import bcrypt from "bcryptjs";
import { userRepository } from "@/repositories/user.repository.js";
import { AppError } from "@/errors/app-error.js";
import { signToken } from "@/utils/jwt.js";
import { presentUser } from "@/utils/user-presenter.js";
import { AuthResponseDTO } from "@/dto/auth.dto.js";

export const authService = {
  async register(input: {
    name: string;
    email: string;
    password: string;
    course: string;
    bio?: string;
    avatarUrl?: string;
  }): Promise<AuthResponseDTO> {
    const existing = await userRepository.findByEmail(input.email);
    if (existing) {
      throw new AppError("E-mail ja cadastrado.", 409);
    }

    const passwordHash = await bcrypt.hash(input.password, 10);
    const user = await userRepository.create({
      name: input.name,
      email: input.email.toLowerCase(),
      passwordHash,
      course: input.course,
      bio: input.bio ?? "",
      avatarUrl: input.avatarUrl
    });

    const token = signToken({ sub: user.id, role: user.role });
    return { token, user: presentUser(user) };
  },

  async login(email: string, password: string): Promise<AuthResponseDTO> {
    const user = await userRepository.findByEmail(email.toLowerCase());
    if (!user) {
      throw new AppError("Credenciais invalidas.", 401);
    }

    const validPassword = await bcrypt.compare(password, user.passwordHash);
    if (!validPassword) {
      throw new AppError("Credenciais invalidas.", 401);
    }

    const token = signToken({ sub: user.id, role: user.role });
    return { token, user: presentUser(user) };
  },

  async me(userId: string) {
    const user = await userRepository.findById(userId);
    if (!user) {
      throw new AppError("Usuario nao encontrado.", 404);
    }

    return presentUser(user);
  }
};
