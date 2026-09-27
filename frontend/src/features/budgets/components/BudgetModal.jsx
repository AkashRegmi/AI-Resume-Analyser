import { X } from "lucide-react";
import BudgetForm from "./BudgetForm";

export default function BudgetModal({
  open,
  budget,
  categories,
  categoriesLoading,
  categoriesError,
  onRetryCategories,
  initialMonth,
  initialYear,
  onClose,
  onSuccess,
}) {
  if (!open) return null;

  const isEditing = Boolean(budget);

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
        aria-labelledby="budget-modal-title"
        className="w-full max-w-lg rounded-lg bg-white p-6 shadow-xl"
      >
        <div className="mb-6 flex items-start justify-between gap-4">
          <div>
            <h2
              id="budget-modal-title"
              className="text-xl font-semibold text-finance-text"
            >
              {isEditing ? "Edit budget" : "Add budget"}
            </h2>
          </div>
          <button
            type="button"
            onClick={onClose}
            aria-label="Close dialog"
            className="rounded-md p-2 text-finance-muted hover:bg-finance-bg hover:text-finance-text"
          >
            <X className="h-5 w-5" />
          </button>
        </div>
        <BudgetForm
          budget={budget}
          categories={categories}
          categoriesLoading={categoriesLoading}
          categoriesError={categoriesError}
          onRetryCategories={onRetryCategories}
          initialMonth={initialMonth}
          initialYear={initialYear}
          onCancel={onClose}
          onSuccess={onSuccess}
        />
      </section>
    </div>
  );
}
