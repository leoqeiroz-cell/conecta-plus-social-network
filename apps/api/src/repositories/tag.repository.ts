import { prisma } from "@/config/prisma.js";

export const tagRepository = {
  list() {
    return prisma.tag.findMany({ orderBy: { name: "asc" } });
  },

  connectOrCreate(names: string[]) {
    return names.map((name) => ({
      tag: {
        connectOrCreate: {
          where: { name: name.replace("#", "").toLowerCase() },
          create: { name: name.replace("#", "").toLowerCase() }
        }
      }
    }));
  }
};
