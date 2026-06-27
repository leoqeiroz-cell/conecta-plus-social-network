import { prisma } from "@/config/prisma.js";

export const groupRepository = {
  list(userId?: string) {
    return prisma.studyGroup.findMany({
      include: {
        members: true
      },
      orderBy: { name: "asc" }
    }).then((groups) =>
      groups.map((group) => ({
        ...group,
        membersCount: group.members.length,
        isMember: userId ? group.members.some((member) => member.userId === userId) : false
      }))
    );
  },

  toggleMembership(groupId: string, userId: string) {
    return prisma.$transaction(async (tx) => {
      const existing = await tx.groupMember.findUnique({
        where: { userId_groupId: { userId, groupId } }
      });

      if (existing) {
        await tx.groupMember.delete({ where: { id: existing.id } });
        return { joined: false };
      }

      await tx.groupMember.create({ data: { userId, groupId } });
      return { joined: true };
    });
  },

  count() {
    return prisma.studyGroup.count();
  }
};
