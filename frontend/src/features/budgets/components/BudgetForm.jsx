import { useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import toast from "react-hot-toast";
import { Link } from "react-router-dom";
import Button from "../../../components/ui/Button";
import { Input } from "../../../components/ui/Input";
import { getError } from "../../../utils/errorHandler";
import { useCreateBudget, useUpdateBudget } from "../hooks/useBudgets";
import { budgetSchema } from "../schemas/budget.schema";

const MONTHS = [
  "January",
  "February",
  "March",
  "April",
  "May",
  "June",
  "July",
  "August",
  "September",
  "October",
  "November",
  "December",
];

function getBudgetDefaults(budget, initialMonth, initialYear) {
  const currentDate = new Date();
  return {
    category: budget?.category?._id ?? budget?.category ?? "",
    amount: budget?.amount ?? "",
    month: budget?.month ?? initialMonth ?? currentDate.getMonth() + 1,
    year: budget?.year ?? initialYear ?? currentDate.getFullYear(),
  };
}

export default function BudgetForm({
  budget = null,
  categories = [],
  categoriesLoading = false,
  categoriesError = null,
  onRetryCategories,
  initialMonth,
  initialYear,
  onSuccess,
  onCancel,
}) {
  const isEditing = Boolean(budget);
  const createMutation = useCreateBudget();
  const updateMutation = useUpdateBudget();
  const mutation = isEditing ? updateMutation : createMutation;
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm({
    resolver: zodResolver(budgetSchema),
    defaultValues: getBudgetDefaults(budget, initialMonth, initialYear),
  });

  useEffect(() => {
    reset(getBudgetDefaults(budget, initialMonth, initialYear));
  }, [budget, initialMonth, initialYear, reset]);

  const onSubmit = (data) => {
    const options = {
      onSuccess: (response) => {
        toast.success(
          response?.message ||
            (isEditing
              ? "Budget updated successfully"
              : "Budget created successfully"),
        );
        onSuccess?.();
      },
      onError: (error) => {
        toast.error(
          getError(error) ||
            (isEditing ? "Failed to update budget" : "Failed to create budget"),
        );
      },
    };

    if (isEditing) {
      updateMutation.mutate({ id: budget._id, data }, options);
    } else {
      createMutation.mutate(data, options);
    }
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
      <div>
        <label
          htmlFor="budget-category"
          className="mb-2 block text-sm font-medium text-finance-text"
        >
          Expense category
        </label>
        <select
          id="budget-category"
          {...register("category")}
          disabled={categoriesLoading || Boolean(categoriesError)}
          className="w-full rounded-xl border border-emerald-950/10 bg-white px-4 py-3 text-sm text-finance-text outline-none transition focus:border-finance-primary focus:ring-2 focus:ring-finance-primary/20"
        >
          <option value="">
            {categoriesLoading
              ? "Loading expense categories..."
              : categoriesError
                ? "Categories could not be loaded"
                : "Select an expense category"}
          </option>
          {categories.map((category) => (
            <option key={category._id} value={category._id}>
              {category.name}
            </option>
          ))}
        </select>
        {errors.category && (
          <p className="mt-1.5 text-xs text-finance-danger">
            {errors.category.message}
          </p>
        )}
        {categoriesError ? (
          <div className="mt-2 text-xs text-finance-danger">
            <p>{getError(categoriesError)}</p>
            <button
              type="button"
              onClick={onRetryCategories}
              className="mt-1 font-semibold underline"
            >
              Retry loading categories
            </button>
          </div>
        ) : !categoriesLoading && categories.length === 0 ? (
          <p className="mt-1.5 text-xs text-finance-muted">
            No expense categories are available.{" "}
            <Link
              to="/categories"
              className="font-semibold text-finance-primary hover:text-finance-dark"
            >
              Create one
            </Link>
            .
          </p>
        ) : null}
      </div>

      <Input
        id="budget-amount"
        label="Budget amount"
        type="number"
        min="0.01"
        step="0.01"
        placeholder="0.00"
        {...register("amount", { valueAsNumber: true })}
        error={errors.amount?.message}
      />

      <div className="grid gap-4 sm:grid-cols-2">
        <div>
          <label
            htmlFor="budget-month"
            className="mb-2 block text-sm font-medium text-finance-text"
          >
            Month
          </label>
          <select
            id="budget-month"
            {...register("month", { valueAsNumber: true })}
            className="w-full rounded-xl border border-emerald-950/10 bg-white px-4 py-3 text-sm text-finance-text outline-none transition focus:border-finance-primary focus:ring-2 focus:ring-finance-primary/20"
          >
            {MONTHS.map((month, index) => (
              <option key={month} value={index + 1}>
                {month}
              </option>
            ))}
          </select>
          {errors.month && (
            <p className="mt-1.5 text-xs text-finance-danger">
              {errors.month.message}
            </p>
          )}
        </div>
        <Input
          id="budget-year"
          label="Year"
          type="number"
          min="2000"
          max="2100"
          step="1"
          {...register("year", { valueAsNumber: true })}
          error={errors.year?.message}
        />
      </div>

      <div className="flex justify-end gap-3 pt-2">
        {onCancel && (
          <Button type="button" variant="outline" onClick={onCancel}>
            Cancel
          </Button>
        )}
        <Button
          type="submit"
          disabled={
            mutation.isPending ||
            categoriesLoading ||
            Boolean(categoriesError) ||
            categories.length === 0
          }
        >
          {mutation.isPending
            ? isEditing
              ? "Updating..."
              : "Creating..."
            : isEditing
              ? "Update budget"
              : "Create budget"}
        </Button>
      </div>
    </form>
  );
}
