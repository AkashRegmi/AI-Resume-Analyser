import { X } from "lucide-react";
import CategoryForm from "./CategoryForm";

export default function CategoryModal({ open, category, onClose, onSuccess }) {
  if (!open) return null;

  const isEditing = Boolean(category);

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
        aria-labelledby="category-modal-title"
        className="w-full max-w-lg rounded-lg bg-white p-6 shadow-xl"
      >
        <div className="mb-6 flex items-start justify-between gap-4">
          <div>
            <h2
              id="category-modal-title"
              className="text-xl font-semibold text-finance-text"
            >
              {isEditing ? "Edit category" : "Add category"}
            </h2>
            <p className="mt-1 text-sm text-finance-muted">
              {isEditing
                ? "Update the category details."
                : "Create a category."}
            </p>
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
        <CategoryForm
          category={category}
          onCancel={onClose}
          onSuccess={onSuccess}
        />
      </section>
    </div>
  );
}
