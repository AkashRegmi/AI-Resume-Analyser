import { useState } from "react";
import { Plus, Search, Tags, X } from "lucide-react";
import toast from "react-hot-toast";
import Button from "../../../components/ui/Button";
import ConfirmDeleteDialog from "../../../components/ui/ConfirmDeleteDialog";
import {
  useCategories,
  useCategory,
  useDeleteCategory,
} from "../hooks/useCategories";
import CategoryList from "../components/CategoryList";
import CategoryModal from "../components/CategoryModal";
import { getError } from "../../../utils/errorHandler";

const filters = ["all", "income", "expense"];
const EMPTY_CATEGORIES = [];

function formatDate(value) {
  if (!value) return "Not available";
  return new Intl.DateTimeFormat(undefined, { dateStyle: "medium" }).format(
    new Date(value),
  );
}

export default function Categories() {
  const [filter, setFilter] = useState("all");
  const [search, setSearch] = useState("");
  const [modalOpen, setModalOpen] = useState(false);
  const [editingCategory, setEditingCategory] = useState(null);
  const [selectedCategoryId, setSelectedCategoryId] = useState(null);
  const [pendingDelete, setPendingDelete] = useState(null);
  const categoriesQuery = useCategories();
  const deleteMutation = useDeleteCategory();
  const detailQuery = useCategory(selectedCategoryId);
  const categories = categoriesQuery.data?.data ?? EMPTY_CATEGORIES;
  const normalizedSearch = search.trim().toLowerCase();
  const filteredCategories = categories.filter((category) => {
    const matchesType = filter === "all" || category.type === filter;
    const matchesSearch = category.name
      .toLowerCase()
      .includes(normalizedSearch);
    return matchesType && matchesSearch;
  });
  const counts = {
    all: categories.length,
    income: categories.filter((category) => category.type === "income").length,
    expense: categories.filter((category) => category.type === "expense")
      .length,
  };

  const openCreate = () => {
    setEditingCategory(null);
    setModalOpen(true);
  };

  const openEdit = (category) => {
    setEditingCategory(category);
    setModalOpen(true);
  };

  const closeForm = () => {
    setModalOpen(false);
    setEditingCategory(null);
  };

  const removeCategory = () => {
    if (!pendingDelete) return;
    deleteMutation.mutate(pendingDelete._id, {
      onSuccess: (response) => {
        toast.success(response?.message || "Category deleted successfully");
        if (selectedCategoryId === pendingDelete._id) {
          setSelectedCategoryId(null);
        }
        setPendingDelete(null);
      },
      onError: (error) => {
        toast.error(getError(error) || "Failed to delete category");
      },
    });
  };

  return (
    <div className="mx-auto max-w-6xl">
      <header className="mb-8 flex flex-wrap items-end justify-between gap-4">
        <div>
          <div className="mb-2 flex items-center gap-2 text-sm font-medium text-finance-primary">
            <Tags className="h-4 w-4" />
            <span>Organization</span>
          </div>
          <h1 className="text-3xl font-bold text-finance-dark">Categories</h1>
          <p className="mt-2 text-sm text-finance-muted">
            {categories.length} total · {counts.income} income ·{" "}
            {counts.expense} expense
          </p>
        </div>
        <Button onClick={openCreate}>
          <Plus className="h-4 w-4" />
          Add category
        </Button>
      </header>

      <section className="border-t border-emerald-950/10">
        <div className="flex flex-wrap items-center justify-between gap-4 py-4">
          <div
            className="flex gap-1"
            role="tablist"
            aria-label="Filter categories"
          >
            {filters.map((item) => (
              <button
                key={item}
                type="button"
                role="tab"
                aria-selected={filter === item}
                onClick={() => setFilter(item)}
                className={`rounded-md px-3 py-2 text-sm font-medium capitalize transition ${
                  filter === item
                    ? "bg-finance-dark text-white"
                    : "text-finance-muted hover:bg-white hover:text-finance-text"
                }`}
              >
                {item} <span className="ml-1 opacity-70">{counts[item]}</span>
              </button>
            ))}
          </div>
          <label className="flex w-full max-w-xs items-center gap-2 border-b border-emerald-950/20 px-1 py-2 text-finance-muted focus-within:border-finance-primary">
            <Search className="h-4 w-4 shrink-0" />
            <span className="sr-only">Search categories</span>
            <input
              value={search}
              onChange={(event) => setSearch(event.target.value)}
              placeholder="Search categories"
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

        {categoriesQuery.isPending ? (
          <div className="border-t border-emerald-950/10 py-16 text-center text-sm text-finance-muted">
            Loading categories...
          </div>
        ) : categoriesQuery.isError ? (
          <div className="border-t border-emerald-950/10 py-12 text-center">
            <p className="text-sm text-finance-danger">
              {getError(categoriesQuery.error)}
            </p>
            <button
              type="button"
              onClick={() => categoriesQuery.refetch()}
              className="mt-3 text-sm font-semibold text-finance-primary hover:text-finance-dark"
            >
              Try again
            </button>
          </div>
        ) : (
          <CategoryList
            categories={filteredCategories}
            hasCategories={categories.length > 0}
            onView={setSelectedCategoryId}
            onEdit={openEdit}
            onDelete={setPendingDelete}
            deletingId={
              deleteMutation.isPending ? deleteMutation.variables : null
            }
            onCreate={openCreate}
          />
        )}
      </section>

      <CategoryModal
        open={modalOpen}
        category={editingCategory}
        onClose={closeForm}
        onSuccess={closeForm}
      />

      <ConfirmDeleteDialog
        open={Boolean(pendingDelete)}
        itemName={
          pendingDelete ? `Category "${pendingDelete.name}"` : "this category"
        }
        isPending={deleteMutation.isPending}
        onCancel={() => setPendingDelete(null)}
        onConfirm={removeCategory}
      />

      {selectedCategoryId && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4"
          onMouseDown={(event) => {
            if (event.target === event.currentTarget)
              setSelectedCategoryId(null);
          }}
        >
          <section
            role="dialog"
            aria-modal="true"
            aria-labelledby="category-detail-title"
            className="w-full max-w-md rounded-lg bg-white p-6 shadow-xl"
          >
            <div className="mb-6 flex items-start justify-between gap-4">
              <div>
                <h2
                  id="category-detail-title"
                  className="text-xl font-semibold text-finance-text"
                >
                  Category details
                </h2>
                <p className="mt-1 text-sm text-finance-muted">
                  Individual category record
                </p>
              </div>
              <button
                type="button"
                onClick={() => setSelectedCategoryId(null)}
                aria-label="Close details"
                className="rounded-md p-2 text-finance-muted hover:bg-finance-bg hover:text-finance-text"
              >
                <X className="h-5 w-5" />
              </button>
            </div>
            {detailQuery.isPending ? (
              <p className="py-8 text-center text-sm text-finance-muted">
                Loading category...
              </p>
            ) : detailQuery.isError ? (
              <div className="py-4 text-sm text-finance-danger">
                {getError(detailQuery.error)}
              </div>
            ) : (
              <dl className="divide-y divide-emerald-950/10">
                <div className="py-3">
                  <dt className="text-xs font-semibold uppercase tracking-wide text-finance-muted">
                    Name
                  </dt>
                  <dd className="mt-1 font-medium text-finance-text">
                    {detailQuery.data?.data?.name}
                  </dd>
                </div>
                <div className="py-3">
                  <dt className="text-xs font-semibold uppercase tracking-wide text-finance-muted">
                    Type
                  </dt>
                  <dd className="mt-1 capitalize text-finance-text">
                    {detailQuery.data?.data?.type}
                  </dd>
                </div>
                <div className="py-3">
                  <dt className="text-xs font-semibold uppercase tracking-wide text-finance-muted">
                    Created
                  </dt>
                  <dd className="mt-1 text-sm text-finance-text">
                    {formatDate(detailQuery.data?.data?.createdAt)}
                  </dd>
                </div>
                <div className="py-3">
                  <dt className="text-xs font-semibold uppercase tracking-wide text-finance-muted">
                    Last updated
                  </dt>
                  <dd className="mt-1 text-sm text-finance-text">
                    {formatDate(detailQuery.data?.data?.updatedAt)}
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
