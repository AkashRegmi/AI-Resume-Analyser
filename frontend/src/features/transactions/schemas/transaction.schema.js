import { z } from "zod";

export const transactionTypes = {
  INCOME: "income",
  EXPENSE: "expense",
};

export const transactionSchema = z.object({
  category: z.string().regex(/^[0-9a-fA-F]{24}$/, "Choose a category"),
  type: z.enum([transactionTypes.INCOME, transactionTypes.EXPENSE], {
    message: "Choose a transaction type",
  }),
  amount: z.number().positive("Amount must be greater than 0"),
  description: z
    .string()
    .trim()
    .max(500, "Description cannot exceed 500 characters"),
  date: z.coerce.date({ error: "Choose a transaction date" }),
});
