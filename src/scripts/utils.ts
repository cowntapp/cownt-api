// Random Utils

export const randomInt = (min: number, max: number): number => {
  return Math.floor(Math.random() * (max - min + 1)) + min;
};

export const pickRandom = <T>(arr: T[]): T => {
  const idx = Math.floor(Math.random() * arr.length);
  return arr[idx];
};

export const pickRandomMany = <T>(arr: T[], n: number): T[] => {
  const copy = [...arr];
  const result: T[] = [];
  const limit = Math.min(n, copy.length);

  for (let i = 0; i < limit; i++) {
    const idx = Math.floor(Math.random() * copy.length);
    result.push(copy.splice(idx, 1)[0]);
  }
  return result;
};
