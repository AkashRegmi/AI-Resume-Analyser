import { useState } from "react";
import { ArrowLeftRight, Plus, Search, X } from "lucide-react";
import toast from "react-hot-toast";
import Button from "../../../components/ui/Button";
import ConfirmDeleteDialog from "../../../components/ui/ConfirmDeleteDialog";
import { useCategories } from "../../categories/hooks/useCategories";
import { getError } from "../../../utils/errorHandler";
import TransactionList from "../components/TransactionList";
import TransactionModal from "../components/TransactionModal";
import {
  useDeleteTransaction,
  useTransaction,
  useTransactions,
} from "../hooks/useTransactions";

const EMPTY_LIST = [];
const transactionFilters = ["all", "income", "expense"];
const currency = new Intl.NumberFormat(undefined, {
  style: "currency",
  currency: "USD",
});

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

export default function Transactions() {
  const [typeFilter, setTypeFilter] = useState("all");
  const [search, setSearch] = useState("");
  const [modalOpen, setModalOpen] = useState(false);
  const [editingTransaction, setEditingTransaction] = useState(null);
  const [selectedTransactionId, setSelectedTransactionId] = useState(null);
  const [pendingDelete, setPendingDelete] = useState(null);
  const transactionsQuery = useTransactions();
  const categoriesQuery = useCategories();
  const deleteMutation = useDeleteTransaction();
  const detailQuery = useTransaction(selectedTransactionId);
  const transactions = transactionsQuery.data?.data ?? EMPTY_LIST;
  const categories = Array.isArray(categoriesQuery.data?.data)
    ? categoriesQuery.data.data
    : EMPTY_LIST;
  const normalizedSearch = search.trim().toLowerCase();
  const filteredTransactions = transactions.filter((transaction) => {
    const matchesType = typeFilter === "all" || transaction.type === typeFilter;
    const searchText =
      `${transaction.description || ""} ${transaction.category?.name || ""}`.toLowerCase();
    return matchesType && searchText.includes(normalizedSearch);
  });
  const incomeTotal = transactions
    .filter((transaction) => transaction.type === "income")
    .reduce((total, transaction) => total + transaction.amount, 0);
  const expenseTotal = transactions
    .filter((transaction) => transaction.type === "expense")
    .reduce((total, transaction) => total + transaction.amount, 0);

  const openCreate = () => {
    setEditingTransaction(null);
    setModalOpen(true);
  };

  const openEdit = (transaction) => {
    setEditingTransaction(transaction);
    setModalOpen(true);
  };

  const closeForm = () => {
    setModalOpen(false);
    setEditingTransaction(null);
  };

  const removeTransaction = () => {
    if (!pendingDelete) return;
    deleteMutation.mutate(pendingDelete._id, {
      onSuccess: (response) => {
        toast.success(response?.message || "Transaction deleted successfully");
        if (selectedTransactionId === pendingDelete._id) {
          setSelectedTransactionId(null);
        }
        setPendingDelete(null);
      },
      onError: (error) => {
        toast.error(getError(error) || "Failed to delete transaction");
      },
    });
  };

  const selectedTransaction = detailQuery.data?.data;

  return (
    <div className="mx-auto max-w-6xl">
      <header className="mb-8 flex flex-wrap items-end justify-between gap-4">
        <div>
          <div className="mb-2 flex items-center gap-2 text-sm font-medium text-finance-primary">
            <ArrowLeftRight className="h-4 w-4" />
            <span>Activity</span>
          </div>
          <h1 className="text-3xl font-bold text-finance-dark">Transactions</h1>
          <p className="mt-2 text-sm text-finance-muted">
            {transactions.length} total · {currency.format(incomeTotal)} income
            · {currency.format(expenseTotal)} expenses
          </p>
        </div>
        <Button onClick={openCreate}>
          <Plus className="h-4 w-4" />
          Add transaction
        </Button>
      </header>

      <section className="border-t border-emerald-950/10">
        <div className="flex flex-wrap items-center justify-between gap-4 py-4">
          <div
            className="flex gap-1"
            role="tablist"
            aria-label="Filter transactions by type"
          >
            {transactionFilters.map((filter) => (
              <button
                key={filter}
                type="button"
                role="tab"
                aria-selected={typeFilter === filter}
                onClick={() => setTypeFilter(filter)}
                className={`rounded-md px-3 py-2 text-sm font-medium capitalize transition ${
                  typeFilter === filter
                    ? "bg-finance-dark text-white"
                    : "text-finance-muted hover:bg-white hover:text-finance-text"
                }`}
              >
                {filter}
              </button>
            ))}
          </div>
          <label className="flex w-full max-w-xs items-center gap-2 border-b border-emerald-950/20 px-1 py-2 text-finance-muted focus-within:border-finance-primary">
            <Search className="h-4 w-4 shrink-0" />
            <span className="sr-only">Search transactions</span>
            <input
              value={search}
              onChange={(event) => setSearch(event.target.value)}
              placeholder="Search transactions"
              className="min-w-0 flex-1 bg-transparent text-sm text-finance-text outline-none placeholder:text-finance-muted"
            />
            {search && (
              <button
                type="button"
                aria-label="Clear search"
                onClick={() => setSearch("")}
                className="rounded p-1 hover:bg-white"
              >
                <X className="h-4 w-4" />
              </button>
            )}
          </label>
        </div>

        {transactionsQuery.isPending ? (
          <div className="border-t border-emerald-950/10 py-16 text-center text-sm text-finance-muted">
            Loading transactions...
          </div>
        ) : transactionsQuery.isError ? (
          <div className="border-t border-emerald-950/10 py-12 text-center">
            <p className="text-sm text-finance-danger">
              {getError(transactionsQuery.error)}
            </p>
            <button
              type="button"
              onClick={() => transactionsQuery.refetch()}
              className="mt-3 text-sm font-semibold text-finance-primary hover:text-finance-dark"
            >
              Try again
            </button>
          </div>
        ) : (
          <TransactionList
            transactions={filteredTransactions}
            hasTransactions={transactions.length > 0}
            onView={setSelectedTransactionId}
            onEdit={openEdit}
            onDelete={setPendingDelete}
            deletingId={
              deleteMutation.isPending ? deleteMutation.variables : null
            }
            onCreate={openCreate}
          />
        )}
      </section>

      <TransactionModal
        open={modalOpen}
        transaction={editingTransaction}
        categories={categories}
        categoriesLoading={categoriesQuery.isPending}
        categoriesError={categoriesQuery.error}
        onRetryCategories={() => categoriesQuery.refetch()}
        onClose={closeForm}
        onSuccess={closeForm}
      />

      <ConfirmDeleteDialog
        open={Boolean(pendingDelete)}
        itemName={
          pendingDelete
            ? `Transaction "${pendingDelete.description || getCategoryName(pendingDelete.category)}"`
            : "this transaction"
        }
        isPending={deleteMutation.isPending}
        onCancel={() => setPendingDelete(null)}
        onConfirm={removeTransaction}
      />

      {selectedTransactionId && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4"
          onMouseDown={(event) => {
            if (event.target === event.currentTarget) {
              setSelectedTransactionId(null);
            }
          }}
        >
          <section
            role="dialog"
            aria-modal="true"
            aria-labelledby="transaction-detail-title"
            className="w-full max-w-md rounded-lg bg-white p-6 shadow-xl"
          >
            <div className="mb-6 flex items-start justify-between gap-4">
              <h2
                id="transaction-detail-title"
                className="text-xl font-semibold text-finance-text"
              >
                Transaction details
              </h2>
              <button
                type="button"
                onClick={() => setSelectedTransactionId(null)}
                aria-label="Close details"
                className="rounded-md p-2 text-finance-muted hover:bg-finance-bg hover:text-finance-text"
              >
                <X className="h-5 w-5" />
              </button>
            </div>
            {detailQuery.isPending ? (
              <p className="py-8 text-center text-sm text-finance-muted">
                Loading transaction...
              </p>
            ) : detailQuery.isError ? (
              <p className="py-4 text-sm text-finance-danger">
                {getError(detailQuery.error)}
              </p>
            ) : (
              <dl className="divide-y divide-emerald-950/10">
                <div className="py-3">
                  <dt className="text-xs font-semibold uppercase tracking-wide text-finance-muted">
                    Type
                  </dt>
                  <dd className="mt-1 capitalize text-finance-text">
                    {selectedTransaction?.type}
                  </dd>
                </div>
                <div className="py-3">
                  <dt className="text-xs font-semibold uppercase tracking-wide text-finance-muted">
                    Category
                  </dt>
                  <dd className="mt-1 text-finance-text">
                    {getCategoryName(selectedTransaction?.category)}
                  </dd>
                </div>
                <div className="py-3">
                  <dt className="text-xs font-semibold uppercase tracking-wide text-finance-muted">
                    Amount
                  </dt>
                  <dd className="mt-1 font-semibold text-finance-text">
                    {currency.format(selectedTransaction?.amount || 0)}
                  </dd>
                </div>
                <div className="py-3">
                  <dt className="text-xs font-semibold uppercase tracking-wide text-finance-muted">
                    Date
                  </dt>
                  <dd className="mt-1 text-sm text-finance-text">
                    {formatDate(selectedTransaction?.date)}
                  </dd>
                </div>
                <div className="py-3">
                  <dt className="text-xs font-semibold uppercase tracking-wide text-finance-muted">
                    Description
                  </dt>
                  <dd className="mt-1 whitespace-pre-wrap text-sm text-finance-text">
                    {selectedTransaction?.description || "No description"}
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
