import { Eye, Pencil, Trash2 } from "lucide-react";

const typeStyles = {
  income: "bg-emerald-50 text-emerald-800",
  expense: "bg-rose-50 text-rose-700",
};

export default function CategoryList({
  categories,
  hasCategories,
  onView,
  onEdit,
  onDelete,
  deletingId,
  onCreate,
}) {
  if (categories.length === 0) {
    return (
      <div className="border-t border-emerald-950/10 py-16 text-center">
        <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-emerald-50 text-finance-primary">
          <Eye className="h-5 w-5" />
        </div>
        <h2 className="mt-4 text-base font-semibold text-finance-text">
          {hasCategories ? "No matching categories" : "No categories yet"}
        </h2>
        <p className="mt-1 text-sm text-finance-muted">
          {hasCategories
            ? "Try another search or category type."
            : "Create your first category to get started."}
        </p>
        {!hasCategories && (
          <button
            type="button"
            onClick={onCreate}
            className="mt-5 text-sm font-semibold text-finance-primary hover:text-finance-dark"
          >
            Add a category
          </button>
        )}
      </div>
    );
  }

  return (
    <div className="overflow-x-auto">
      <table className="w-full min-w-[560px] text-left">
        <thead>
          <tr className="border-y border-emerald-950/10 text-xs uppercase tracking-wide text-finance-muted">
            <th className="py-3 pr-4 font-semibold">Category</th>
            <th className="py-3 px-4 font-semibold">Type</th>
            <th className="py-3 px-4 text-right font-semibold">Actions</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-emerald-950/10">
          {categories.map((category) => (
            <tr key={category._id} className="group">
              <td className="py-4 pr-4">
                <span className="font-medium text-finance-text">
                  {category.name}
                </span>
              </td>
              <td className="py-4 px-4">
                <span
                  className={`inline-flex rounded-full px-2.5 py-1 text-xs font-semibold capitalize ${
                    typeStyles[category.type] || "bg-gray-100 text-gray-700"
                  }`}
                >
                  {category.type}
                </span>
              </td>
              <td className="py-4 pl-4">
                <div className="flex justify-end gap-1">
                  <button
                    type="button"
                    title="View category"
                    aria-label={`View ${category.name}`}
                    onClick={() => onView(category._id)}
                    className="rounded-md p-2 text-finance-muted hover:bg-emerald-50 hover:text-finance-dark"
                  >
                    <Eye className="h-4 w-4" />
                  </button>
                  <button
                    type="button"
                    title="Edit category"
                    aria-label={`Edit ${category.name}`}
                    onClick={() => onEdit(category)}
                    className="rounded-md p-2 text-finance-muted hover:bg-emerald-50 hover:text-finance-dark"
                  >
                    <Pencil className="h-4 w-4" />
                  </button>
                  <button
                    type="button"
                    title="Delete category"
                    aria-label={`Delete ${category.name}`}
                    disabled={deletingId === category._id}
                    onClick={() => onDelete(category)}
                    className="rounded-md p-2 text-finance-muted hover:bg-rose-50 hover:text-finance-danger disabled:opacity-50"
                  >
                    <Trash2 className="h-4 w-4" />
                  </button>
                </div>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
