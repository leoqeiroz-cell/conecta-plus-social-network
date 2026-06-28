import { userRepository } from "@/repositories/user.repository.js";
import { presentUser } from "@/utils/user-presenter.js";

export const userService = {
  async search(query = "") {
    const users = query ? await userRepository.search(query) : await userRepository.leaderboard();
    return users.map(presentUser);
  },

  async leaderboard() {
    const users = await userRepository.leaderboard();
    return users.map(presentUser);
  },

  async updateProfile(
    userId: string,
    input: {
      name: string;
      course: string;
      bio?: string;
      avatarUrl?: string | null;
    }
  ) {
    const user = await userRepository.update(userId, {
      name: input.name,
      course: input.course,
      bio: input.bio ?? "",
      avatarUrl: input.avatarUrl ?? null
    });
    return presentUser(user);
  }
};
