import { PostCategory } from "@prisma/client";
import { AppError } from "@/errors/app-error.js";
import { postRepository } from "@/repositories/post.repository.js";
import { tagRepository } from "@/repositories/tag.repository.js";
import { userRepository } from "@/repositories/user.repository.js";

export const postService = {
  list(filters: { search?: string; category?: PostCategory; tag?: string }) {
    return postRepository.list(filters);
  },

  async create(authorId: string, input: { title: string; content: string; category: PostCategory; tags: string[] }) {
    const post = await postRepository.create({
      title: input.title,
      content: input.content,
      category: input.category,
      author: { connect: { id: authorId } },
      tags: { create: tagRepository.connectOrCreate(input.tags) }
    });

    await userRepository.incrementPoints(authorId, 12);
    return post;
  },

  async update(postId: string, authorId: string, input: Partial<{ title: string; content: string; category: PostCategory; tags: string[] }>) {
    const post = await postRepository.findById(postId);
    if (!post) throw new AppError("Publicacao nao encontrada.", 404);
    if (post.authorId !== authorId) throw new AppError("Voce so pode editar suas publicacoes.", 403);

    return postRepository.update(postId, {
      title: input.title,
      content: input.content,
      category: input.category,
      tags: input.tags
        ? {
            deleteMany: {},
            create: tagRepository.connectOrCreate(input.tags)
          }
        : undefined
    });
  },

  async delete(postId: string, authorId: string, role: "USER" | "ADMIN") {
    const post = await postRepository.findById(postId);
    if (!post) throw new AppError("Publicacao nao encontrada.", 404);
    if (post.authorId !== authorId && role !== "ADMIN") throw new AppError("Acao nao permitida.", 403);
    await postRepository.delete(postId);
    return { ok: true };
  },

  async toggleLike(postId: string, authorId: string) {
    const post = await postRepository.findById(postId);
    if (!post) throw new AppError("Publicacao nao encontrada.", 404);
    const result = await postRepository.toggleLike(postId, authorId);
    if (result.liked && post.authorId !== authorId) {
      await userRepository.incrementPoints(post.authorId, 2);
    }
    return result;
  },

  async addComment(postId: string, authorId: string, content: string) {
    const post = await postRepository.findById(postId);
    if (!post) throw new AppError("Publicacao nao encontrada.", 404);
    const comment = await postRepository.addComment(postId, authorId, content);
    await userRepository.incrementPoints(authorId, 4);
    if (post.authorId !== authorId) await userRepository.incrementPoints(post.authorId, 1);
    return comment;
  },

  async updateComment(commentId: string, authorId: string, content: string) {
    const comment = await postRepository.findCommentById(commentId);
    if (!comment) throw new AppError("Comentario nao encontrado.", 404);
    if (comment.authorId !== authorId) throw new AppError("Voce so pode editar seus comentarios.", 403);
    return postRepository.updateComment(commentId, content);
  },

  async deleteComment(commentId: string, authorId: string, role: "USER" | "ADMIN") {
    const comment = await postRepository.findCommentById(commentId);
    if (!comment) throw new AppError("Comentario nao encontrado.", 404);
    if (comment.authorId !== authorId && role !== "ADMIN") throw new AppError("Acao nao permitida.", 403);
    await postRepository.deleteComment(commentId);
    return { ok: true };
  }
};
