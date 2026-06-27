export type UserRole = "USER" | "ADMIN";
export type PostCategory = "ESTUDOS" | "PROJETOS" | "EMPREGO" | "DUVIDAS";

export type User = {
  id: string;
  name: string;
  email: string;
  course: string;
  bio: string;
  avatarUrl: string | null;
  role: UserRole;
  points: number;
};

export type Tag = {
  tag: {
    id: string;
    name: string;
  };
};

export type Comment = {
  id: string;
  content: string;
  createdAt: string;
  author: User;
};

export type Post = {
  id: string;
  title: string;
  content: string;
  category: PostCategory;
  createdAt: string;
  updatedAt: string;
  author: User;
  comments: Comment[];
  likes: Array<{ id: string; authorId: string }>;
  tags: Tag[];
};

export type StudyGroup = {
  id: string;
  name: string;
  description: string;
  category: PostCategory;
  membersCount: number;
  isMember: boolean;
};
