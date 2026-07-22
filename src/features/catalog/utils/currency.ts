/**
 * Converts backend paise (lowest denomination) to standard Rupees.
 * Centralized here to prevent magic numbers (/100) from scattering across mappers.
 */
export const convertPaiseToRupees = (paise: number): number => {
  return paise / 100;
};