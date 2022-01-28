import { DateStrings } from "../state";

const twoDigitDayOrMonth = (val: number): string => (val < 10 ? `0${val}` : `${val}`);

/**
 * Converts date into strings to be rendered, making sure day/month is double digit
 *
 * @param date - {@link Date}
 */
export const getDateStrings = (date: Date): DateStrings => {
  return {
    day: twoDigitDayOrMonth(date.getDate()),
    month: twoDigitDayOrMonth(date.getMonth() + 1), // month is returned as 0-based
    year: `${date.getFullYear()}`,
  };
};
