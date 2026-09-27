import { z } from "zod";

export const budgetSchema = z.object({
  category: z.string().regex(/^[0-9a-fA-F]{24}$/, "Choose a category"),
  amount: z.number().positive("Budget amount must be greater than 0"),
  month: z
    .number()
    .int("Month must be a whole number")
    .min(1, "Month must be between 1 and 12")
    .max(12, "Month must be between 1 and 12"),
  year: z
    .number()
    .int("Year must be a whole number")
    .min(2000, "Invalid budget year")
    .max(2100, "Invalid budget year"),
});
