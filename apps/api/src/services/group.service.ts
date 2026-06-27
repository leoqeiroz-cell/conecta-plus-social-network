import { groupRepository } from "@/repositories/group.repository.js";
import { userRepository } from "@/repositories/user.repository.js";

export const groupService = {
  list(userId?: string) {
    return groupRepository.list(userId);
  },

  async toggleMembership(groupId: string, userId: string) {
    const result = await groupRepository.toggleMembership(groupId, userId);
    if (result.joined) await userRepository.incrementPoints(userId, 3);
    return result;
  }
};
