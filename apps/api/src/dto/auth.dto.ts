import { UserRole } from "@prisma/client";

export type AuthUserDTO = {
  id: string;
  name: string;
  email: string;
  course: string;
  bio: string;
  avatarUrl: string | null;
  role: UserRole;
  points: number;
};

export type AuthResponseDTO = {
  token: string;
  user: AuthUserDTO;
};
