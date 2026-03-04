export const getOrderIndex = async (getModel: any, sectionId: bigint): Promise<number> => {
  const lastVideo = await getModel.findFirst({
    where: { sectionId },
    orderBy: { orderIndex: 'desc' },
    select: { orderIndex: true },
  });

  return lastVideo ? lastVideo.orderIndex + 1 : 1;
};
