import { Eye, Pencil, Trash2, WalletCards } from "lucide-react";

const currency = new Intl.NumberFormat(undefined, {
  style: "currency",
  currency: "USD",
});

export default function BudgetList({
  budgets,
  hasBudgets,
  onView,
  onEdit,
  onDelete,
  deletingId,
  onCreate,
}) {
  if (budgets.length === 0) {
    return (
      <div className="border-t border-emerald-950/10 py-16 text-center">
        <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-emerald-50 text-finance-primary">
          <WalletCards className="h-5 w-5" />
        </div>
        <h2 className="mt-4 text-base font-semibold text-finance-text">
          {hasBudgets ? "No budgets for this period" : "No budgets yet"}
        </h2>
        <p className="mt-1 text-sm text-finance-muted">
          {hasBudgets
            ? "Choose another month or year."
            : "Set a monthly limit for an expense category."}
        </p>
        {!hasBudgets && (
          <button
            type="button"
            onClick={onCreate}
            className="mt-5 text-sm font-semibold text-finance-primary hover:text-finance-dark"
          >
            Add a budget
          </button>
        )}
      </div>
    );
  }

  return (
    <div className="overflow-x-auto">
      <table className="w-full min-w-[640px] text-left">
        <thead>
          <tr className="border-y border-emerald-950/10 text-xs uppercase tracking-wide text-finance-muted">
            <th className="py-3 pr-4 font-semibold">Expense category</th>
            <th className="px-4 py-3 font-semibold">Period</th>
            <th className="px-4 py-3 text-right font-semibold">Planned</th>
            <th className="py-3 pl-4 text-right font-semibold">Actions</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-emerald-950/10">
          {budgets.map((budget) => (
            <tr key={budget._id}>
              <td className="py-4 pr-4 font-medium text-finance-text">
                {budget.category?.name || "Category"}
              </td>
              <td className="px-4 py-4 text-sm text-finance-muted">
                {new Intl.DateTimeFormat(undefined, { month: "long" }).format(
                  new Date(budget.year, budget.month - 1),
                )}{" "}
                {budget.year}
              </td>
              <td className="px-4 py-4 text-right font-semibold tabular-nums text-finance-text">
                {currency.format(budget.amount)}
              </td>
              <td className="py-4 pl-4">
                <div className="flex justify-end gap-1">
                  <button
                    type="button"
                    title="View budget"
                    aria-label={`View budget for ${budget.category?.name || "category"}`}
                    onClick={() => onView(budget._id)}
                    className="rounded-md p-2 text-finance-muted hover:bg-emerald-50 hover:text-finance-dark"
                  >
                    <Eye className="h-4 w-4" />
                  </button>
                  <button
                    type="button"
                    title="Edit budget"
                    aria-label={`Edit budget for ${budget.category?.name || "category"}`}
                    onClick={() => onEdit(budget)}
                    className="rounded-md p-2 text-finance-muted hover:bg-emerald-50 hover:text-finance-dark"
                  >
                    <Pencil className="h-4 w-4" />
                  </button>
                  <button
                    type="button"
                    title="Delete budget"
                    aria-label={`Delete budget for ${budget.category?.name || "category"}`}
                    disabled={deletingId === budget._id}
                    onClick={() => onDelete(budget)}
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
