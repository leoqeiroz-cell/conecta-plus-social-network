import { groupRepository } from "@/repositories/group.repository.js";
import { postRepository } from "@/repositories/post.repository.js";
import { userRepository } from "@/repositories/user.repository.js";

export const adminService = {
  async metrics() {
    const [users, posts, groups, admins, leaderboard, recentPosts] = await Promise.all([
      userRepository.countByRole(),
      postRepository.count(),
      groupRepository.count(),
      userRepository.countByRole("ADMIN"),
      userRepository.leaderboard(),
      postRepository.recent()
    ]);

    return {
      users,
      posts,
      groups,
      admins,
      leaderboard,
      recentPosts
    };
  }
};
