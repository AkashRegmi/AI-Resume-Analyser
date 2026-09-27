import { useEffect } from "react";
import { Link } from "react-router-dom";
import { useForm, useWatch } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import toast from "react-hot-toast";
import Button from "../../../components/ui/Button";
import { Input } from "../../../components/ui/Input";
import { getError } from "../../../utils/errorHandler";
import {
  useCreateTransaction,
  useUpdateTransaction,
} from "../hooks/useTransactions";
import {
  transactionSchema,
  transactionTypes,
} from "../schemas/transaction.schema";

function localDate(value) {
  const date = value ? new Date(value) : new Date();
  const timezoneOffset = date.getTimezoneOffset() * 60_000;
  return new Date(date.getTime() - timezoneOffset).toISOString().slice(0, 10);
}

function getDefaults(transaction) {
  return {
    category: transaction?.category?._id ?? transaction?.category ?? "",
    type: transaction?.type ?? transactionTypes.EXPENSE,
    amount: transaction?.amount ?? "",
    description: transaction?.description ?? "",
    date: localDate(transaction?.date),
  };
}

export default function TransactionForm({
  transaction = null,
  categories = [],
  categoriesLoading = false,
  categoriesError = null,
  onRetryCategories,
  onSuccess,
  onCancel,
}) {
  const isEditing = Boolean(transaction);
  const createMutation = useCreateTransaction();
  const updateMutation = useUpdateTransaction();
  const mutation = isEditing ? updateMutation : createMutation;
  const {
    register,
    handleSubmit,
    reset,
    setValue,
    control,
    formState: { errors },
  } = useForm({
    resolver: zodResolver(transactionSchema),
    defaultValues: getDefaults(transaction),
  });

  useEffect(() => {
    reset(getDefaults(transaction));
  }, [reset, transaction]);

  const selectedType = useWatch({ control, name: "type" });
  const availableCategories = categories.filter(
    (category) => category.type === selectedType,
  );
  const typeRegistration = register("type");

  const onSubmit = (data) => {
    const options = {
      onSuccess: (response) => {
        toast.success(
          response?.message ||
            (isEditing
              ? "Transaction updated successfully"
              : "Transaction created successfully"),
        );
        onSuccess?.();
      },
      onError: (error) => {
        toast.error(
          getError(error) ||
            (isEditing
              ? "Failed to update transaction"
              : "Failed to create transaction"),
        );
      },
    };

    if (isEditing) {
      updateMutation.mutate({ id: transaction._id, data }, options);
    } else {
      createMutation.mutate(data, options);
    }
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
      <div>
        <label
          htmlFor="transaction-type"
          className="mb-2 block text-sm font-medium text-finance-text"
        >
          Type
        </label>
        <select
          id="transaction-type"
          {...typeRegistration}
          onChange={(event) => {
            typeRegistration.onChange(event);
            setValue("category", "", { shouldValidate: true });
          }}
          className="w-full rounded-xl border border-emerald-950/10 bg-white px-4 py-3 text-sm capitalize text-finance-text outline-none transition focus:border-finance-primary focus:ring-2 focus:ring-finance-primary/20"
        >
          <option value={transactionTypes.EXPENSE}>Expense</option>
          <option value={transactionTypes.INCOME}>Income</option>
        </select>
        {errors.type && (
          <p className="mt-1.5 text-xs text-finance-danger">
            {errors.type.message}
          </p>
        )}
      </div>

      <div>
        <label
          htmlFor="transaction-category"
          className="mb-2 block text-sm font-medium text-finance-text"
        >
          Category
        </label>
        <select
          id="transaction-category"
          {...register("category")}
          disabled={categoriesLoading || Boolean(categoriesError)}
          className="w-full rounded-xl border border-emerald-950/10 bg-white px-4 py-3 text-sm text-finance-text outline-none transition focus:border-finance-primary focus:ring-2 focus:ring-finance-primary/20"
        >
          <option value="">
            {categoriesLoading
              ? "Loading categories..."
              : categoriesError
                ? "Categories could not be loaded"
                : `Select an ${selectedType || "expense"} category`}
          </option>
          {availableCategories.map((category) => (
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
        ) : !categoriesLoading && availableCategories.length === 0 ? (
          <p className="mt-1.5 text-xs text-finance-muted">
            No {selectedType || "expense"} categories are available.{" "}
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
        id="transaction-amount"
        label="Amount"
        type="number"
        min="0.01"
        step="0.01"
        placeholder="0.00"
        {...register("amount", { valueAsNumber: true })}
        error={errors.amount?.message}
      />

      <Input
        id="transaction-date"
        label="Date"
        type="date"
        {...register("date")}
        error={errors.date?.message}
      />

      <div>
        <label
          htmlFor="transaction-description"
          className="mb-2 block text-sm font-medium text-finance-text"
        >
          Description{" "}
          <span className="font-normal text-finance-muted">(optional)</span>
        </label>
        <textarea
          id="transaction-description"
          rows={3}
          maxLength={500}
          {...register("description")}
          className="w-full resize-y rounded-xl border border-emerald-950/10 bg-white px-4 py-3 text-sm text-finance-text outline-none transition focus:border-finance-primary focus:ring-2 focus:ring-finance-primary/20"
          placeholder="Add a note"
        />
        {errors.description && (
          <p className="mt-1.5 text-xs text-finance-danger">
            {errors.description.message}
          </p>
        )}
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
            availableCategories.length === 0
          }
        >
          {mutation.isPending
            ? isEditing
              ? "Updating..."
              : "Creating..."
            : isEditing
              ? "Update transaction"
              : "Create transaction"}
        </Button>
      </div>
    </form>
  );
}
