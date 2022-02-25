import { DateStrings } from "../state";
import { format } from "date-fns";

/**
 * Converts date into strings to be rendered, making sure day/month is double digit
 *
 * @param date - {@link Date}
 */
export const getDateStrings = (date: Date): DateStrings => {
  return {
    day: format(date, "dd"),
    month: format(date, "MM"),
    year: format(date, "yyyy"),
  };
};
