import { z } from "zod";
export const CategoryType = { INCOME: "income", EXPENSE: "expense" };
export const categorySchema = z.object({
  name: z
    .string("Category is required")
    .trim()
    .min(2, "Category name must be at least 2 characters")
    .max(50, "Category name cannot exceed 50 characters"),
  type: z.enum([CategoryType.INCOME, CategoryType.EXPENSE], {
    message: "Please choose valid type",
  }),
});
