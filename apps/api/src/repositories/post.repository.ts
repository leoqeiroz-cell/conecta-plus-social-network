import { PostCategory, Prisma } from "@prisma/client";
import { prisma } from "@/config/prisma.js";

const includePostRelations = {
  author: true,
  comments: { include: { author: true }, orderBy: { createdAt: "asc" as const } },
  likes: true,
  tags: { include: { tag: true } }
};

export const postRepository = {
  list(filters: { search?: string; category?: PostCategory; tag?: string }) {
    return prisma.post.findMany({
      where: {
        category: filters.category,
        AND: [
          filters.search
            ? {
                OR: [
                  { title: { contains: filters.search, mode: "insensitive" } },
                  { content: { contains: filters.search, mode: "insensitive" } },
                  { author: { name: { contains: filters.search, mode: "insensitive" } } }
                ]
              }
            : {},
          filters.tag
            ? {
                tags: {
                  some: {
                    tag: { name: filters.tag.replace("#", "") }
                  }
                }
              }
            : {}
        ]
      },
      include: includePostRelations,
      orderBy: { createdAt: "desc" },
      take: 50
    });
  },

  findById(id: string) {
    return prisma.post.findUnique({ where: { id }, include: includePostRelations });
  },

  create(data: Prisma.PostCreateInput) {
    return prisma.post.create({ data, include: includePostRelations });
  },

  update(id: string, data: Prisma.PostUpdateInput) {
    return prisma.post.update({ where: { id }, data, include: includePostRelations });
  },

  delete(id: string) {
    return prisma.post.delete({ where: { id } });
  },

  toggleLike(postId: string, authorId: string) {
    return prisma.$transaction(async (tx) => {
      const existing = await tx.like.findUnique({
        where: { authorId_postId: { authorId, postId } }
      });

      if (existing) {
        await tx.like.delete({ where: { id: existing.id } });
        return { liked: false };
      }

      await tx.like.create({ data: { postId, authorId } });
      return { liked: true };
    });
  },

  addComment(postId: string, authorId: string, content: string) {
    return prisma.comment.create({
      data: { postId, authorId, content },
      include: { author: true }
    });
  },

  findCommentById(id: string) {
    return prisma.comment.findUnique({
      where: { id },
      include: { author: true, post: true }
    });
  },

  updateComment(id: string, content: string) {
    return prisma.comment.update({
      where: { id },
      data: { content },
      include: { author: true }
    });
  },

  deleteComment(id: string) {
    return prisma.comment.delete({ where: { id } });
  },

  count() {
    return prisma.post.count();
  },

  recent() {
    return prisma.post.findMany({
      orderBy: { createdAt: "desc" },
      take: 5,
      include: { author: true, likes: true, comments: true }
    });
  }
};
