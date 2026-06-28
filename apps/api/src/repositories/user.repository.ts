import { Prisma, UserRole } from "@prisma/client";
import { prisma } from "@/config/prisma.js";

export const userRepository = {
  findByEmail(email: string) {
    return prisma.user.findUnique({ where: { email } });
  },

  findById(id: string) {
    return prisma.user.findUnique({ where: { id } });
  },

  create(data: Prisma.UserCreateInput) {
    return prisma.user.create({ data });
  },

  update(id: string, data: Prisma.UserUpdateInput) {
    return prisma.user.update({ where: { id }, data });
  },

  search(query: string) {
    return prisma.user.findMany({
      where: {
        OR: [
          { name: { contains: query, mode: "insensitive" } },
          { course: { contains: query, mode: "insensitive" } },
          { email: { contains: query, mode: "insensitive" } }
        ]
      },
      orderBy: [{ points: "desc" }, { name: "asc" }],
      take: 20
    });
  },

  leaderboard() {
    return prisma.user.findMany({
      orderBy: [{ points: "desc" }, { name: "asc" }],
      take: 10
    });
  },

  incrementPoints(id: string, amount: number) {
    return prisma.user.update({
      where: { id },
      data: { points: { increment: amount } }
    });
  },

  countByRole(role?: UserRole) {
    return prisma.user.count(role ? { where: { role } } : undefined);
  }
};
