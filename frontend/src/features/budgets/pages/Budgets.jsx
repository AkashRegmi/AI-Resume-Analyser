import { useState } from "react";
import { Plus, WalletCards, X } from "lucide-react";
import toast from "react-hot-toast";
import Button from "../../../components/ui/Button";
import ConfirmDeleteDialog from "../../../components/ui/ConfirmDeleteDialog";
import { useCategories } from "../../categories/hooks/useCategories";
import { getError } from "../../../utils/errorHandler";
import BudgetList from "../components/BudgetList";
import BudgetModal from "../components/BudgetModal";
import { useBudget, useBudgets, useDeleteBudget } from "../hooks/useBudgets";

const EMPTY_LIST = [];
const currency = new Intl.NumberFormat(undefined, {
  style: "currency",
  currency: "USD",
});
const monthNames = Array.from({ length: 12 }, (_, index) =>
  new Intl.DateTimeFormat(undefined, { month: "long" }).format(
    new Date(2024, index, 1),
  ),
);

function formatDate(value) {
  if (!value) return "Not available";
  return new Intl.DateTimeFormat(undefined, { dateStyle: "medium" }).format(
    new Date(value),
  );
}

function getCategoryName(category) {
  return typeof category === "string"
    ? "Category"
    : category?.name || "Category";
}

export default function Budgets() {
  const currentDate = new Date();
  const [monthFilter, setMonthFilter] = useState(
    String(currentDate.getMonth() + 1),
  );
  const [yearFilter, setYearFilter] = useState(
    String(currentDate.getFullYear()),
  );
  const [modalOpen, setModalOpen] = useState(false);
  const [editingBudget, setEditingBudget] = useState(null);
  const [selectedBudgetId, setSelectedBudgetId] = useState(null);
  const [pendingDelete, setPendingDelete] = useState(null);
  const budgetsQuery = useBudgets();
  const categoriesQuery = useCategories();
  const deleteMutation = useDeleteBudget();
  const detailQuery = useBudget(selectedBudgetId);
  const budgets = budgetsQuery.data?.data ?? EMPTY_LIST;
  const allCategories = Array.isArray(categoriesQuery.data?.data)
    ? categoriesQuery.data.data
    : EMPTY_LIST;
  const categories = allCategories.filter(
    (category) => String(category.type).toLowerCase() === "expense",
  );
  const years = [
    ...new Set([
      currentDate.getFullYear(),
      ...budgets.map((budget) => budget.year),
    ]),
  ]
    .sort((left, right) => right - left)
    .map(String);
  const filteredBudgets = budgets.filter((budget) => {
    const matchesMonth =
      monthFilter === "all" || budget.month === Number(monthFilter);
    const matchesYear = budget.year === Number(yearFilter);
    return matchesMonth && matchesYear;
  });
  const totalPlanned = filteredBudgets.reduce(
    (total, budget) => total + budget.amount,
    0,
  );

  const openCreate = () => {
    setEditingBudget(null);
    setModalOpen(true);
  };

  const openEdit = (budget) => {
    setEditingBudget(budget);
    setModalOpen(true);
  };

  const closeForm = () => {
    setModalOpen(false);
    setEditingBudget(null);
  };

  const removeBudget = () => {
    if (!pendingDelete) return;
    deleteMutation.mutate(pendingDelete._id, {
      onSuccess: (response) => {
        toast.success(response?.message || "Budget deleted successfully");
        if (selectedBudgetId === pendingDelete._id) setSelectedBudgetId(null);
        setPendingDelete(null);
      },
      onError: (error) => {
        toast.error(getError(error) || "Failed to delete budget");
      },
    });
  };

  const selectedBudget = detailQuery.data?.data;

  return (
    <div className="mx-auto max-w-6xl">
      <header className="mb-8 flex flex-wrap items-end justify-between gap-4">
        <div>
          <div className="mb-2 flex items-center gap-2 text-sm font-medium text-finance-primary">
            <WalletCards className="h-4 w-4" />
            <span>Planning</span>
          </div>
          <h1 className="text-3xl font-bold text-finance-dark">Budgets</h1>
          <p className="mt-2 text-sm text-finance-muted">
            {filteredBudgets.length} budgets · {currency.format(totalPlanned)}{" "}
            planned
          </p>
        </div>
        <Button onClick={openCreate}>
          <Plus className="h-4 w-4" />
          Add budget
        </Button>
      </header>

      <section className="border-t border-emerald-950/10">
        <div className="flex flex-wrap items-end justify-between gap-4 py-4">
          <p className="text-sm font-semibold text-finance-text">
            {monthFilter === "all"
              ? "All months"
              : monthNames[Number(monthFilter) - 1]}{" "}
            {yearFilter}
          </p>
          <div className="flex gap-3">
            <label className="sr-only" htmlFor="budget-month-filter">
              Month
            </label>
            <select
              id="budget-month-filter"
              value={monthFilter}
              onChange={(event) => setMonthFilter(event.target.value)}
              className="rounded-md border border-emerald-950/15 bg-white px-3 py-2 text-sm text-finance-text outline-none focus:border-finance-primary"
            >
              <option value="all">All months</option>
              {monthNames.map((month, index) => (
                <option key={month} value={index + 1}>
                  {month}
                </option>
              ))}
            </select>
            <label className="sr-only" htmlFor="budget-year-filter">
              Year
            </label>
            <select
              id="budget-year-filter"
              value={yearFilter}
              onChange={(event) => setYearFilter(event.target.value)}
              className="rounded-md border border-emerald-950/15 bg-white px-3 py-2 text-sm text-finance-text outline-none focus:border-finance-primary"
            >
              {years.map((year) => (
                <option key={year} value={year}>
                  {year}
                </option>
              ))}
            </select>
          </div>
        </div>

        {budgetsQuery.isPending ? (
          <div className="border-t border-emerald-950/10 py-16 text-center text-sm text-finance-muted">
            Loading budgets...
          </div>
        ) : budgetsQuery.isError ? (
          <div className="border-t border-emerald-950/10 py-12 text-center">
            <p className="text-sm text-finance-danger">
              {getError(budgetsQuery.error)}
            </p>
            <button
              type="button"
              onClick={() => budgetsQuery.refetch()}
              className="mt-3 text-sm font-semibold text-finance-primary hover:text-finance-dark"
            >
              Try again
            </button>
          </div>
        ) : (
          <BudgetList
            budgets={filteredBudgets}
            hasBudgets={budgets.length > 0}
            onView={setSelectedBudgetId}
            onEdit={openEdit}
            onDelete={setPendingDelete}
            deletingId={
              deleteMutation.isPending ? deleteMutation.variables : null
            }
            onCreate={openCreate}
          />
        )}
      </section>

      <BudgetModal
        open={modalOpen}
        budget={editingBudget}
        categories={categories}
        categoriesLoading={categoriesQuery.isPending}
        categoriesError={categoriesQuery.error}
        onRetryCategories={() => categoriesQuery.refetch()}
        initialMonth={
          monthFilter === "all"
            ? currentDate.getMonth() + 1
            : Number(monthFilter)
        }
        initialYear={Number(yearFilter)}
        onClose={closeForm}
        onSuccess={closeForm}
      />

      <ConfirmDeleteDialog
        open={Boolean(pendingDelete)}
        itemName={
          pendingDelete
            ? `Budget for ${getCategoryName(pendingDelete.category)}`
            : "this budget"
        }
        isPending={deleteMutation.isPending}
        onCancel={() => setPendingDelete(null)}
        onConfirm={removeBudget}
      />

      {selectedBudgetId && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4"
          onMouseDown={(event) => {
            if (event.target === event.currentTarget) setSelectedBudgetId(null);
          }}
        >
          <section
            role="dialog"
            aria-modal="true"
            aria-labelledby="budget-detail-title"
            className="w-full max-w-md rounded-lg bg-white p-6 shadow-xl"
          >
            <div className="mb-6 flex items-start justify-between gap-4">
              <div>
                <h2
                  id="budget-detail-title"
                  className="text-xl font-semibold text-finance-text"
                >
                  Budget details
                </h2>
              </div>
              <button
                type="button"
                onClick={() => setSelectedBudgetId(null)}
                aria-label="Close details"
                className="rounded-md p-2 text-finance-muted hover:bg-finance-bg hover:text-finance-text"
              >
                <X className="h-5 w-5" />
              </button>
            </div>
            {detailQuery.isPending ? (
              <p className="py-8 text-center text-sm text-finance-muted">
                Loading budget...
              </p>
            ) : detailQuery.isError ? (
              <p className="py-4 text-sm text-finance-danger">
                {getError(detailQuery.error)}
              </p>
            ) : (
              <dl className="divide-y divide-emerald-950/10">
                <div className="py-3">
                  <dt className="text-xs font-semibold uppercase tracking-wide text-finance-muted">
                    Category
                  </dt>
                  <dd className="mt-1 font-medium text-finance-text">
                    {getCategoryName(selectedBudget?.category)}
                  </dd>
                </div>
                <div className="py-3">
                  <dt className="text-xs font-semibold uppercase tracking-wide text-finance-muted">
                    Period
                  </dt>
                  <dd className="mt-1 text-finance-text">
                    {monthNames[(selectedBudget?.month || 1) - 1]}{" "}
                    {selectedBudget?.year}
                  </dd>
                </div>
                <div className="py-3">
                  <dt className="text-xs font-semibold uppercase tracking-wide text-finance-muted">
                    Planned amount
                  </dt>
                  <dd className="mt-1 font-semibold text-finance-text">
                    {currency.format(selectedBudget?.amount || 0)}
                  </dd>
                </div>
                <div className="py-3">
                  <dt className="text-xs font-semibold uppercase tracking-wide text-finance-muted">
                    Created
                  </dt>
                  <dd className="mt-1 text-sm text-finance-text">
                    {formatDate(selectedBudget?.createdAt)}
                  </dd>
                </div>
                <div className="py-3">
                  <dt className="text-xs font-semibold uppercase tracking-wide text-finance-muted">
                    Last updated
                  </dt>
                  <dd className="mt-1 text-sm text-finance-text">
                    {formatDate(selectedBudget?.updatedAt)}
                  </dd>
                </div>
              </dl>
            )}
          </section>
        </div>
      )}
    </div>
  );
}
