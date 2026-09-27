import { useCreateCategory, useUpdateCategory } from "../hooks/useCategories";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { categorySchema, CategoryType } from "../schamas/category.schema";
import toast from "react-hot-toast";
import { getError } from "../../../utils/errorHandler";
import Button from "../../../components/ui/Button";
import { Input } from "../../../components/ui/Input";
export default function CategoryForm({ category = null, onSuccess, onCancel }) {
  const isEditing = Boolean(category);
  const createMutation = useCreateCategory();
  const updateMutation = useUpdateCategory();
  const mutation = isEditing ? updateMutation : createMutation;
  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm({
    resolver: zodResolver(categorySchema),
    defaultValues: {
      name: category?.name || "",
      type: category?.type || "",
    },
  });

  const onSubmit = (data) => {
    if (isEditing) {
      updateMutation.mutate(
        { id: category._id, data },
        {
          onSuccess: (response) => {
            toast.success(response?.message || "Category updated successfully");
            reset();
            onSuccess?.();
          },
          onError: (error) => {
            toast.error(getError(error) || "Failed to update category");
          },
        },
      );
      return;
    }
    createMutation.mutate(data, {
      onSuccess: (response) => {
        toast.success(response?.message || "Category created successfully");
        reset();
        onSuccess?.();
      },
      onError: (error) => {
        toast.error(getError(error) || "Failed to add the category");
      },
    });
  };
  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
      {" "}
      {/* Category Name */}{" "}
      <Input
        label="Category Name"
        placeholder="e.g. Food"
        {...register("name")}
        error={errors.name?.message}
      />{" "}
      {/* Category Type */}{" "}
      <div>
        {" "}
        <label
          htmlFor="type"
          className="mb-2 block text-sm font-medium text-finance-text"
        >
          {" "}
          Category Type{" "}
        </label>{" "}
        <select
          id="type"
          {...register("type")}
          className="w-full rounded-xl border border-emerald-950/10 bg-white px-4 py-3 text-sm text-finance-text outline-none transition focus:border-finance-primary focus:ring-2 focus:ring-finance-primary/20"
        >
          {" "}
          <option value="">Select category type</option>{" "}
          <option value={CategoryType.INCOME}> Income </option>{" "}
          <option value={CategoryType.EXPENSE}> Expense </option>{" "}
        </select>{" "}
        {errors.type && (
          <p className="mt-1.5 text-xs text-finance-danger">
            {" "}
            {errors.type.message}{" "}
          </p>
        )}{" "}
      </div>{" "}
      {/* Actions */}{" "}
      <div className="flex justify-end gap-3 pt-2">
        {" "}
        {onCancel && (
          <Button type="button" variant="secondary" onClick={onCancel}>
            {" "}
            Cancel{" "}
          </Button>
        )}{" "}
        <Button type="submit" disabled={mutation.isPending}>
          {" "}
          {mutation.isPending
            ? isEditing
              ? "Updating..."
              : "Creating..."
            : isEditing
              ? "Update Category"
              : "Create Category"}{" "}
        </Button>{" "}
      </div>{" "}
    </form>
  );
}
