import { Eye, Pencil, Trash2 } from "lucide-react";

const currency = new Intl.NumberFormat(undefined, {
  style: "currency",
  currency: "USD",
});

function formatDate(value) {
  return value
    ? new Intl.DateTimeFormat(undefined, { dateStyle: "medium" }).format(
        new Date(value),
      )
    : "Not available";
}

export default function TransactionList({
  transactions,
  hasTransactions,
  onView,
  onEdit,
  onDelete,
  deletingId,
  onCreate,
}) {
  if (transactions.length === 0) {
    return (
      <div className="border-t border-emerald-950/10 py-16 text-center">
        <h2 className="text-base font-semibold text-finance-text">
          {hasTransactions ? "No matching transactions" : "No transactions yet"}
        </h2>
        <p className="mt-1 text-sm text-finance-muted">
          {hasTransactions
            ? "Change the filter or search term."
            : "Add your first income or expense transaction."}
        </p>
        {!hasTransactions && (
          <button
            type="button"
            onClick={onCreate}
            className="mt-5 text-sm font-semibold text-finance-primary hover:text-finance-dark"
          >
            Add a transaction
          </button>
        )}
      </div>
    );
  }

  return (
    <div className="overflow-x-auto">
      <table className="w-full min-w-[720px] text-left">
        <thead>
          <tr className="border-y border-emerald-950/10 text-xs uppercase tracking-wide text-finance-muted">
            <th className="py-3 pr-4 font-semibold">Transaction</th>
            <th className="px-4 py-3 font-semibold">Category</th>
            <th className="px-4 py-3 font-semibold">Date</th>
            <th className="px-4 py-3 text-right font-semibold">Amount</th>
            <th className="py-3 pl-4 text-right font-semibold">Actions</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-emerald-950/10">
          {transactions.map((transaction) => (
            <tr key={transaction._id}>
              <td className="py-4 pr-4">
                <div className="font-medium text-finance-text">
                  {transaction.description ||
                    transaction.category?.name ||
                    "Transaction"}
                </div>
                <span
                  className={`mt-1 inline-flex rounded-full px-2 py-0.5 text-xs font-semibold capitalize ${
                    transaction.type === "income"
                      ? "bg-emerald-50 text-emerald-800"
                      : "bg-rose-50 text-rose-700"
                  }`}
                >
                  {transaction.type}
                </span>
              </td>
              <td className="px-4 py-4 text-sm text-finance-text">
                {transaction.category?.name || "Category"}
              </td>
              <td className="px-4 py-4 text-sm text-finance-muted">
                {formatDate(transaction.date)}
              </td>
              <td
                className={`px-4 py-4 text-right font-semibold tabular-nums ${
                  transaction.type === "income"
                    ? "text-emerald-800"
                    : "text-finance-text"
                }`}
              >
                {transaction.type === "income" ? "+" : "−"}
                {currency.format(transaction.amount)}
              </td>
              <td className="py-4 pl-4">
                <div className="flex justify-end gap-1">
                  <button
                    type="button"
                    title="View transaction"
                    aria-label="View transaction"
                    onClick={() => onView(transaction._id)}
                    className="rounded-md p-2 text-finance-muted hover:bg-emerald-50 hover:text-finance-dark"
                  >
                    <Eye className="h-4 w-4" />
                  </button>
                  <button
                    type="button"
                    title="Edit transaction"
                    aria-label="Edit transaction"
                    onClick={() => onEdit(transaction)}
                    className="rounded-md p-2 text-finance-muted hover:bg-emerald-50 hover:text-finance-dark"
                  >
                    <Pencil className="h-4 w-4" />
                  </button>
                  <button
                    type="button"
                    title="Delete transaction"
                    aria-label="Delete transaction"
                    disabled={deletingId === transaction._id}
                    onClick={() => onDelete(transaction)}
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
