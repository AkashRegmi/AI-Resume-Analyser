import { X } from "lucide-react";
import TransactionForm from "./TransactionForm";

export default function TransactionModal({
  open,
  transaction,
  categories,
  categoriesLoading,
  categoriesError,
  onRetryCategories,
  onClose,
  onSuccess,
}) {
  if (!open) return null;

  const isEditing = Boolean(transaction);

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4"
      onMouseDown={(event) => {
        if (event.target === event.currentTarget) onClose();
      }}
    >
      <section
        role="dialog"
        aria-modal="true"
        aria-labelledby="transaction-modal-title"
        className="max-h-[90vh] w-full max-w-lg overflow-y-auto rounded-lg bg-white p-6 shadow-xl"
      >
        <div className="mb-6 flex items-start justify-between gap-4">
          <h2
            id="transaction-modal-title"
            className="text-xl font-semibold text-finance-text"
          >
            {isEditing ? "Edit transaction" : "Add transaction"}
          </h2>
          <button
            type="button"
            onClick={onClose}
            aria-label="Close dialog"
            className="rounded-md p-2 text-finance-muted hover:bg-finance-bg hover:text-finance-text"
          >
            <X className="h-5 w-5" />
          </button>
        </div>
        <TransactionForm
          transaction={transaction}
          categories={categories}
          categoriesLoading={categoriesLoading}
          categoriesError={categoriesError}
          onRetryCategories={onRetryCategories}
          onCancel={onClose}
          onSuccess={onSuccess}
        />
      </section>
    </div>
  );
}
