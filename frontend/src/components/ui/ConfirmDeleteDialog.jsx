import { useEffect } from "react";
import { AlertTriangle } from "lucide-react";
import Button from "./Button";

export default function ConfirmDeleteDialog({
  open,
  itemName,
  isPending = false,
  onCancel,
  onConfirm,
}) {
  useEffect(() => {
    if (!open || isPending) return undefined;

    const handleKeyDown = (event) => {
      if (event.key === "Escape") onCancel();
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [isPending, onCancel, open]);

  if (!open) return null;

  return (
    <div
      className="fixed inset-0 z-[60] flex items-center justify-center bg-black/45 p-4"
      onMouseDown={(event) => {
        if (event.target === event.currentTarget && !isPending) onCancel();
      }}
    >
      <section
        role="alertdialog"
        aria-modal="true"
        aria-labelledby="confirm-delete-title"
        aria-describedby="confirm-delete-description"
        className="w-full max-w-md rounded-lg bg-white p-6 shadow-xl"
      >
        <div className="flex items-start gap-4">
          <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-rose-50 text-finance-danger">
            <AlertTriangle className="h-5 w-5" />
          </div>
          <div>
            <h2
              id="confirm-delete-title"
              className="text-lg font-semibold text-finance-text"
            >
              Delete this item?
            </h2>
            <p
              id="confirm-delete-description"
              className="mt-2 text-sm leading-6 text-finance-muted"
            >
              <span className="font-medium text-finance-text">{itemName}</span>{" "}
              will be permanently deleted. This action cannot be undone.
            </p>
          </div>
        </div>
        <div className="mt-7 flex justify-end gap-3">
          <Button
            type="button"
            variant="outline"
            disabled={isPending}
            onClick={onCancel}
          >
            Cancel
          </Button>
          <Button
            type="button"
            variant="danger"
            disabled={isPending}
            onClick={onConfirm}
          >
            {isPending ? "Deleting..." : "Delete"}
          </Button>
        </div>
      </section>
    </div>
  );
}
