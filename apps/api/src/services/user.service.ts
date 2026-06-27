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
  }
};
