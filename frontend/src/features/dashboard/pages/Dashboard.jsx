import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import {
  ArrowDownLeft,
  ArrowRight,
  ArrowUpRight,
  CalendarDays,
  CircleDollarSign,
  Plus,
  WalletCards,
} from "lucide-react";
import { Cell, Pie, PieChart, ResponsiveContainer, Tooltip } from "recharts";
import Button from "../../../components/ui/Button";
import { useAuthContext } from "../../../context/useAuthContext";
import { getError } from "../../../utils/errorHandler";
import { useDashboard } from "../hooks/useDashboard";

const MONTHS = Array.from({ length: 12 }, (_, index) =>
  new Intl.DateTimeFormat(undefined, { month: "long" }).format(
    new Date(2024, index, 1),
  ),
);
const EMPTY_LIST = [];
const CHART_COLORS = [
  "#27745d",
  "#d37660",
  "#d6ad4e",
  "#648e9c",
  "#8ea77d",
  "#ad8fbd",
];
const currency = new Intl.NumberFormat(undefined, {
  style: "currency",
  currency: "USD",
});

function formatDate(value) {
  if (!value) return "Not available";
  return new Intl.DateTimeFormat(undefined, {
    month: "short",
    day: "numeric",
    year: "numeric",
  }).format(new Date(value));
}

function SummaryItem({ label, amount, icon: Icon, tone, detail }) {
  return (
    <article className="rounded-lg border border-emerald-950/10 bg-white p-5">
      <div className="flex items-start justify-between gap-3">
        <div>
          <p className="text-sm font-medium text-finance-muted">{label}</p>
          <p className="mt-3 text-2xl font-semibold tabular-nums text-finance-text">
            {currency.format(amount)}
          </p>
        </div>
        <span
          className={`flex h-9 w-9 items-center justify-center rounded-md ${tone}`}
        >
          <Icon className="h-4 w-4" />
        </span>
      </div>
      <p className="mt-3 text-xs text-finance-muted">{detail}</p>
    </article>
  );
}

export default function Dashboard() {
  const now = new Date();
  const [month, setMonth] = useState(now.getMonth() + 1);
  const [year, setYear] = useState(now.getFullYear());
  const navigate = useNavigate();
  const { user } = useAuthContext();
  const dashboardQuery = useDashboard({ month, year });
  const dashboard = dashboardQuery.data?.data;
  const monthly = dashboard?.monthlySummary ?? {};
  const budgetSummary = dashboard?.budgets ?? {};
  const expenseCategories = dashboard?.expensesByCategory ?? EMPTY_LIST;
  const budgetProgress = budgetSummary.progress ?? EMPTY_LIST;
  const recentTransactions = dashboard?.recentTransactions ?? EMPTY_LIST;
  const years = Array.from(
    { length: 6 },
    (_, index) => now.getFullYear() - index,
  );

  return (
    <div className="mx-auto max-w-7xl space-y-7">
      <header className="flex flex-wrap items-end justify-between gap-4">
        <div>
          <p className="text-sm font-medium text-finance-primary">
            Your finances
          </p>
          <h1 className="mt-1 text-3xl font-bold text-finance-dark">
            Good{" "}
            {now.getHours() < 12
              ? "morning"
              : now.getHours() < 18
                ? "afternoon"
                : "evening"}
            {user?.name ? `, ${user.name.split(" ")[0]}` : ""}
          </h1>
          <p className="mt-2 text-sm text-finance-muted">
            Here’s your financial picture for {MONTHS[month - 1]} {year}.
          </p>
        </div>
        <div className="flex flex-wrap items-center gap-3">
          <label className="flex items-center gap-2 rounded-md border border-emerald-950/15 bg-white px-3 py-2 text-finance-muted">
            <CalendarDays className="h-4 w-4" />
            <span className="sr-only">Select month</span>
            <select
              value={month}
              onChange={(event) => setMonth(Number(event.target.value))}
              className="bg-transparent text-sm text-finance-text outline-none"
            >
              {MONTHS.map((name, index) => (
                <option value={index + 1} key={name}>
                  {name}
                </option>
              ))}
            </select>
          </label>
          <label className="sr-only" htmlFor="dashboard-year">
            Year
          </label>
          <select
            id="dashboard-year"
            value={year}
            onChange={(event) => setYear(Number(event.target.value))}
            className="rounded-md border border-emerald-950/15 bg-white px-3 py-2 text-sm text-finance-text outline-none"
          >
            {years.map((value) => (
              <option key={value} value={value}>
                {value}
              </option>
            ))}
          </select>
          <Button onClick={() => navigate("/transactions")}>
            <Plus className="h-4 w-4" />
            Add transaction
          </Button>
        </div>
      </header>

      {dashboardQuery.isPending ? (
        <div className="border-t border-emerald-950/10 py-16 text-center text-sm text-finance-muted">
          Loading your financial overview...
        </div>
      ) : dashboardQuery.isError ? (
        <div className="border-t border-emerald-950/10 py-12 text-center">
          <p className="text-sm text-finance-danger">
            {getError(dashboardQuery.error)}
          </p>
          <button
            type="button"
            onClick={() => dashboardQuery.refetch()}
            className="mt-3 text-sm font-semibold text-finance-primary hover:text-finance-dark"
          >
            Try again
          </button>
        </div>
      ) : (
        <>
          <section
            className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4"
            aria-label="Monthly summary"
          >
            <SummaryItem
              label="Income"
              amount={monthly.income ?? 0}
              icon={ArrowDownLeft}
              tone="bg-emerald-50 text-emerald-800"
              detail={`${MONTHS[month - 1]} income`}
            />
            <SummaryItem
              label="Expenses"
              amount={monthly.expenses ?? 0}
              icon={ArrowUpRight}
              tone="bg-rose-50 text-rose-700"
              detail={`${MONTHS[month - 1]} spending`}
            />
            <SummaryItem
              label="Monthly balance"
              amount={monthly.balance ?? 0}
              icon={CircleDollarSign}
              tone="bg-sky-50 text-sky-800"
              detail="Income minus expenses"
            />
            <SummaryItem
              label="Budget remaining"
              amount={Math.max(
                (budgetSummary.totalBudget ?? 0) -
                  (budgetSummary.totalSpent ?? 0),
                0,
              )}
              icon={WalletCards}
              tone="bg-amber-50 text-amber-800"
              detail={`${currency.format(budgetSummary.totalSpent ?? 0)} spent of ${currency.format(budgetSummary.totalBudget ?? 0)}`}
            />
          </section>

          <section className="grid gap-5 xl:grid-cols-[1.05fr_0.95fr]">
            <article className="rounded-lg border border-emerald-950/10 bg-white p-5 sm:p-6">
              <div className="flex items-start justify-between gap-4">
                <div>
                  <h2 className="text-lg font-semibold text-finance-text">
                    Expenses by category
                  </h2>
                  <p className="mt-1 text-sm text-finance-muted">
                    Where your money went this month
                  </p>
                </div>
                <Link
                  to="/categories"
                  className="inline-flex items-center gap-1 text-sm font-semibold text-finance-primary hover:text-finance-dark"
                >
                  Categories <ArrowRight className="h-4 w-4" />
                </Link>
              </div>
              {expenseCategories.length === 0 ? (
                <div className="flex min-h-64 flex-col items-center justify-center text-center">
                  <CircleDollarSign className="h-8 w-8 text-finance-muted" />
                  <p className="mt-3 text-sm font-medium text-finance-text">
                    No expenses recorded for this month
                  </p>
                  <p className="mt-1 text-xs text-finance-muted">
                    Add a transaction to see your category breakdown.
                  </p>
                </div>
              ) : (
                <div className="grid items-center gap-3 sm:grid-cols-[minmax(180px,0.9fr)_1.1fr]">
                  <div className="h-60 min-w-0">
                    <ResponsiveContainer width="100%" height="100%">
                      <PieChart>
                        <Pie
                          data={expenseCategories}
                          dataKey="amount"
                          nameKey="categoryName"
                          innerRadius="58%"
                          outerRadius="82%"
                          paddingAngle={3}
                          stroke="none"
                        >
                          {expenseCategories.map((item, index) => (
                            <Cell
                              key={item._id}
                              fill={CHART_COLORS[index % CHART_COLORS.length]}
                            />
                          ))}
                        </Pie>
                        <Tooltip
                          formatter={(value) => currency.format(Number(value))}
                        />
                      </PieChart>
                    </ResponsiveContainer>
                  </div>
                  <div className="space-y-3">
                    {expenseCategories.slice(0, 6).map((item, index) => (
                      <div
                        className="flex items-center justify-between gap-3"
                        key={item._id}
                      >
                        <span className="flex min-w-0 items-center gap-2 text-sm text-finance-text">
                          <i
                            className="h-2.5 w-2.5 shrink-0 rounded-sm"
                            style={{
                              backgroundColor:
                                CHART_COLORS[index % CHART_COLORS.length],
                            }}
                          />
                          <span className="truncate">{item.categoryName}</span>
                        </span>
                        <span className="shrink-0 text-sm font-semibold tabular-nums text-finance-text">
                          {currency.format(item.amount)}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </article>

            <article className="rounded-lg border border-emerald-950/10 bg-white p-5 sm:p-6">
              <div className="flex items-start justify-between gap-4">
                <div>
                  <h2 className="text-lg font-semibold text-finance-text">
                    Budget progress
                  </h2>
                  <p className="mt-1 text-sm text-finance-muted">
                    Monthly spending against your plan
                  </p>
                </div>
                <Link
                  to="/budgets"
                  className="inline-flex items-center gap-1 text-sm font-semibold text-finance-primary hover:text-finance-dark"
                >
                  Budgets <ArrowRight className="h-4 w-4" />
                </Link>
              </div>
              {budgetProgress.length === 0 ? (
                <div className="flex min-h-64 flex-col items-center justify-center text-center">
                  <WalletCards className="h-8 w-8 text-finance-muted" />
                  <p className="mt-3 text-sm font-medium text-finance-text">
                    No budgets for {MONTHS[month - 1]}
                  </p>
                  <Link
                    to="/budgets"
                    className="mt-2 text-sm font-semibold text-finance-primary hover:text-finance-dark"
                  >
                    Set a monthly budget
                  </Link>
                </div>
              ) : (
                <div className="mt-7 space-y-6">
                  {budgetProgress.map((item) => {
                    const categoryName =
                      typeof item.category === "string"
                        ? "Category"
                        : item.category?.name || "Category";
                    const percentage = Math.min(item.percentage || 0, 100);
                    return (
                      <div key={item.budgetId}>
                        <div className="mb-2 flex items-center justify-between gap-3 text-sm">
                          <span className="truncate font-medium text-finance-text">
                            {categoryName}
                          </span>
                          <span
                            className={`shrink-0 font-semibold tabular-nums ${item.isExceeded ? "text-finance-danger" : "text-finance-muted"}`}
                          >
                            {currency.format(item.spent)}{" "}
                            <span className="font-normal">
                              of {currency.format(item.budgetAmount)}
                            </span>
                          </span>
                        </div>
                        <div
                          className="h-2 overflow-hidden rounded-full bg-finance-bg"
                          role="progressbar"
                          aria-label={`${categoryName} budget used`}
                          aria-valuenow={Math.round(item.percentage || 0)}
                          aria-valuemin={0}
                          aria-valuemax={100}
                        >
                          <div
                            className={`h-full rounded-full ${item.isExceeded ? "bg-finance-danger" : "bg-finance-primary"}`}
                            style={{ width: `${percentage}%` }}
                          />
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}
            </article>
          </section>

          <section className="rounded-lg border border-emerald-950/10 bg-white p-5 sm:p-6">
            <div className="mb-4 flex flex-wrap items-center justify-between gap-3">
              <div>
                <h2 className="text-lg font-semibold text-finance-text">
                  Recent transactions
                </h2>
                <p className="mt-1 text-sm text-finance-muted">
                  Activity from {MONTHS[month - 1]}
                </p>
              </div>
              <Link
                to="/transactions"
                className="inline-flex items-center gap-1 text-sm font-semibold text-finance-primary hover:text-finance-dark"
              >
                All transactions <ArrowRight className="h-4 w-4" />
              </Link>
            </div>
            {recentTransactions.length === 0 ? (
              <div className="border-t border-emerald-950/10 py-10 text-center">
                <p className="text-sm text-finance-muted">
                  No transactions recorded for this month.
                </p>
                <Link
                  to="/transactions"
                  className="mt-3 inline-flex items-center gap-1 text-sm font-semibold text-finance-primary hover:text-finance-dark"
                >
                  <Plus className="h-4 w-4" /> Add a transaction
                </Link>
              </div>
            ) : (
              <div className="divide-y divide-emerald-950/10">
                {recentTransactions.map((transaction) => (
                  <div
                    className="grid grid-cols-[minmax(0,1fr)_auto] items-center gap-3 py-4 sm:grid-cols-[minmax(0,1fr)_130px_130px]"
                    key={transaction._id}
                  >
                    <div className="min-w-0">
                      <p className="truncate text-sm font-semibold text-finance-text">
                        {transaction.description ||
                          transaction.category?.name ||
                          "Transaction"}
                      </p>
                      <p className="mt-1 truncate text-xs text-finance-muted">
                        {transaction.category?.name || "Category"} ·{" "}
                        {formatDate(transaction.date)}
                      </p>
                    </div>
                    <span
                      className={`hidden text-sm capitalize sm:block ${transaction.type === "income" ? "text-emerald-800" : "text-finance-muted"}`}
                    >
                      {transaction.type}
                    </span>
                    <span
                      className={`text-right text-sm font-semibold tabular-nums ${transaction.type === "income" ? "text-emerald-800" : "text-finance-text"}`}
                    >
                      {transaction.type === "income" ? "+" : "−"}
                      {currency.format(transaction.amount)}
                    </span>
                  </div>
                ))}
              </div>
            )}
          </section>
        </>
      )}
    </div>
  );
}
