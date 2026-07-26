export const pluralize = (
  value: number,
  one: string,
  few: string,
  many: string,
): string => {
  const remainder100 = value % 100;
  const remainder10 = value % 10;

  if (remainder100 >= 11 && remainder100 <= 14) {
    return many;
  }

  if (remainder10 === 1) {
    return one;
  }

  if (remainder10 >= 2 && remainder10 <= 4) {
    return few;
  }

  return many;
};
