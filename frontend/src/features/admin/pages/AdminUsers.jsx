import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import {
  AlertCircle,
  Check,
  ChevronLeft,
  ChevronRight,
  RefreshCw,
  Users,
} from "lucide-react";
import { getUsers } from "../api/admin.api";
import { getError } from "../../../utils/errorHandler";

const pageSize = 20;
const dateFormatter = new Intl.DateTimeFormat(undefined, {
  year: "numeric",
  month: "short",
  day: "numeric",
});

function formatDate(value) {
  if (!value) return "Date unavailable";
  const date = new Date(value);
  return Number.isNaN(date.getTime())
    ? "Date unavailable"
    : dateFormatter.format(date);
}

export default function AdminUsers() {
  const [page, setPage] = useState(1);
  const { data, isPending, isError, error, isFetching, refetch } = useQuery({
    queryKey: ["admin-users", page],
    queryFn: () => getUsers({ page, limit: pageSize }),
    placeholderData: (previousData) => previousData,
  });

  const users = data?.data ?? [];
  const totalPages = data?.pagination?.totalPage ?? 0;
  const verifiedOnPage = users.filter((user) => user.isEmailVerified).length;

  return (
    <div className="mx-auto max-w-6xl space-y-6">
      <div className="flex flex-wrap items-end justify-between gap-4">
        <div>
          <p className="text-xs font-semibold uppercase tracking-wide text-finance-primary">
            Administration
          </p>
          <h1 className="mt-1 text-2xl font-semibold text-gray-900">
            Registered users
          </h1>
          <p className="mt-2 text-sm text-gray-600">
            Review accounts and email verification status.
          </p>
        </div>
        <button
          type="button"
          onClick={() => refetch()}
          disabled={isFetching}
          className="inline-flex h-10 items-center gap-2 rounded-md border border-gray-200 bg-white px-3 text-sm font-medium text-gray-700 transition hover:bg-gray-50 disabled:opacity-60"
          aria-label="Refresh user list"
          title="Refresh user list"
        >
          <RefreshCw size={16} className={isFetching ? "animate-spin" : ""} />
          Refresh
        </button>
      </div>

      <div className="grid gap-3 sm:grid-cols-2">
        <div className="flex items-center gap-3 border-y border-gray-200 py-4">
          <span className="grid h-10 w-10 place-items-center rounded-md bg-orange-50 text-finance-primary">
            <Users size={19} />
          </span>
          <div>
            <p className="text-xs text-gray-500">Accounts on this page</p>
            <p className="text-lg font-semibold tabular-nums text-gray-900">
              {isPending ? "..." : users.length}
            </p>
          </div>
        </div>
        <div className="flex items-center gap-3 border-y border-gray-200 py-4">
          <span className="grid h-10 w-10 place-items-center rounded-md bg-emerald-50 text-emerald-700">
            <Check size={19} />
          </span>
          <div>
            <p className="text-xs text-gray-500">Verified on this page</p>
            <p className="text-lg font-semibold tabular-nums text-gray-900">
              {isPending ? "..." : verifiedOnPage}
            </p>
          </div>
        </div>
      </div>

      <section className="overflow-hidden rounded-lg border border-gray-200 bg-white shadow-sm">
        <div className="flex flex-wrap items-center justify-between gap-2 border-b border-gray-200 px-4 py-3 sm:px-5">
          <h2 className="text-sm font-semibold text-gray-900">User accounts</h2>
          <span className="text-xs text-gray-500">
            {totalPages ? `Page ${page} of ${totalPages}` : ""}
          </span>
        </div>

        {isError ? (
          <div className="flex flex-col items-center px-5 py-12 text-center">
            <AlertCircle className="h-6 w-6 text-rose-600" />
            <p className="mt-3 text-sm font-medium text-gray-900">
              Could not load users
            </p>
            <p className="mt-1 max-w-md text-sm text-gray-600">
              {getError(error)}
            </p>
            <button
              type="button"
              onClick={() => refetch()}
              className="mt-4 rounded-md bg-finance-dark px-4 py-2 text-sm font-semibold text-white hover:bg-finance-primary"
            >
              Try again
            </button>
          </div>
        ) : isPending ? (
          <div className="space-y-4 p-5" aria-label="Loading users">
            {Array.from({ length: 5 }, (_, index) => (
              <div
                key={index}
                className="h-14 animate-pulse rounded bg-gray-100"
              />
            ))}
          </div>
        ) : users.length === 0 ? (
          <div className="px-5 py-14 text-center">
            <Users className="mx-auto h-7 w-7 text-gray-400" />
            <p className="mt-3 text-sm font-medium text-gray-900">
              No registered users yet
            </p>
            <p className="mt-1 text-sm text-gray-500">
              New accounts will appear here.
            </p>
          </div>
        ) : (
          <>
            <ul
              className="divide-y divide-gray-100"
              aria-label="Registered users"
            >
              {users.map((user) => (
                <li
                  key={user.id}
                  className="grid gap-3 px-4 py-4 sm:grid-cols-[minmax(0,1fr)_auto_auto] sm:items-center sm:px-5"
                >
                  <div className="min-w-0">
                    <p className="truncate text-sm font-semibold text-gray-900">
                      {user.name}
                    </p>
                    <p className="truncate text-sm text-gray-600">
                      {user.email}
                    </p>
                  </div>
                  <span
                    className={`inline-flex w-fit items-center gap-1.5 rounded-full px-2.5 py-1 text-xs font-medium ${
                      user.isEmailVerified
                        ? "bg-emerald-50 text-emerald-800"
                        : "bg-amber-50 text-amber-800"
                    }`}
                  >
                    {user.isEmailVerified ? (
                      <Check size={13} />
                    ) : (
                      <AlertCircle size={13} />
                    )}
                    {user.isEmailVerified ? "Verified" : "Pending verification"}
                  </span>
                  <time
                    className="text-xs text-gray-500"
                    dateTime={user.createdAt}
                  >
                    Joined {formatDate(user.createdAt)}
                  </time>
                </li>
              ))}
            </ul>
            <div className="flex items-center justify-between border-t border-gray-200 px-4 py-3 sm:px-5">
              <p className="text-xs text-gray-500">Newest accounts first</p>
              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={() => setPage((current) => Math.max(1, current - 1))}
                  disabled={page <= 1 || isFetching}
                  className="grid h-9 w-9 place-items-center rounded-md border border-gray-200 text-gray-700 hover:bg-gray-50 disabled:cursor-not-allowed disabled:opacity-40"
                  aria-label="Previous page"
                >
                  <ChevronLeft size={17} />
                </button>
                <button
                  type="button"
                  onClick={() => setPage((current) => current + 1)}
                  disabled={page >= totalPages || isFetching}
                  className="grid h-9 w-9 place-items-center rounded-md border border-gray-200 text-gray-700 hover:bg-gray-50 disabled:cursor-not-allowed disabled:opacity-40"
                  aria-label="Next page"
                >
                  <ChevronRight size={17} />
                </button>
              </div>
            </div>
          </>
        )}
      </section>
    </div>
  );
}
