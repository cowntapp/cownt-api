// TODO: delete and extract to animal service transform (same as cow, see file #/features/animals/cow/utils/transform.ts)

export function transformLeanDoc<T extends { _id: any; __v?: any }>(
  doc: T
): Omit<T, '_id' | '__v'> & { id: string } {
  const { _id, __v, ...res } = doc;

  return {
    ...(res as any),
    id: String(_id),
  };
}
