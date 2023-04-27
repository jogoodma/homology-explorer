/**
 * Normalize values between 0 and 1.
 * @param val
 * @param max
 * @param min
 */
export const normalize = (val: number, max: number, min: number) => {
  if (max - min === 0) return 1; // or 0, it's up to you
  return (val - min) / (max - min);
};
