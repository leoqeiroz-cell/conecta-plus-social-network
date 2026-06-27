import { User } from "@prisma/client";
import { AuthUserDTO } from "@/dto/auth.dto.js";

export function presentUser(user: User): AuthUserDTO {
  return {
    id: user.id,
    name: user.name,
    email: user.email,
    course: user.course,
    bio: user.bio,
    avatarUrl: user.avatarUrl,
    role: user.role,
    points: user.points
  };
}
