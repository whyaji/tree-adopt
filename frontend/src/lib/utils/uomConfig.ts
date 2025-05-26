export const getDiameterFromCircumference = (circumference: number): number => {
  return Number((circumference / Math.PI).toFixed(1));
};
