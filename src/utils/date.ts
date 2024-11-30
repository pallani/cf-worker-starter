import { formatISO, toDate } from "date-fns";
import { z } from "zod";

export const zStringToDate = () =>
  z
    .string()
    .refine((v) => !isNaN(Date.parse(v)), {
      message: "Invalid date string",
    })
    .transform((v) => formatISO(toDate(v)));

export function formatTimestamp(date: Date | string | null): string | null {
  if (!date) return null;
  return formatISO(toDate(date));
}
