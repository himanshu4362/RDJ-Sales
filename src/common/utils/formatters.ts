/**
 * src/common/utils/formatters.ts
 */

const INR_FORMATTER = new Intl.NumberFormat('en-IN', {
  style: 'currency',
  currency: 'INR',
  maximumFractionDigits: 0,
});

export const formatCurrency = (value: number): string => {
  return INR_FORMATTER.format(value);
};