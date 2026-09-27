import { ArrowDownLeft, ArrowUpRight, Ellipsis, Wallet } from "lucide-react";

const bars = [
  { label: "Jan", income: 58, expense: 35 },
  { label: "Feb", income: 70, expense: 46 },
  { label: "Mar", income: 64, expense: 39 },
  { label: "Apr", income: 82, expense: 52 },
  { label: "May", income: 74, expense: 43 },
  { label: "Jun", income: 92, expense: 56 },
];

const activity = [
  {
    name: "Market groceries",
    category: "Food & dining",
    date: "Today",
    amount: "−$64.20",
    type: "expense",
  },
  {
    name: "Monthly salary",
    category: "Income",
    date: "Jun 14",
    amount: "+$4,250.00",
    type: "income",
  },
  {
    name: "Train pass",
    category: "Transport",
    date: "Jun 12",
    amount: "−$82.50",
    type: "expense",
  },
];

export default function DashboardPreview({ compact = false }) {
  return (
    <div
      className={`dashboard-preview ${compact ? "dashboard-preview-compact" : ""}`}
    >
      <div className="preview-topbar">
        <div className="preview-brand">
          <span className="preview-brand-mark">
            <Wallet size={15} />
          </span>
          <span>Akrio Resume Match</span>
        </div>
        <div className="preview-period">
          Personal overview <span>⌄</span>
        </div>
        <div className="preview-avatar">AM</div>
      </div>

      <div className="preview-content">
        <div className="preview-heading-row">
          <div>
            <div className="preview-eyebrow">YOUR MONEY, IN FOCUS</div>
            <h3>Good morning, Akash</h3>
          </div>
          <div className="preview-range">
            Last 6 months <span>⌄</span>
          </div>
        </div>

        <div className="preview-metrics">
          <article className="preview-balance">
            <p>Available balance</p>
            <strong>$8,420.60</strong>
            <span>
              <i /> Up 8.2% this month
            </span>
          </article>
          <article className="preview-metric">
            <p>
              <span className="metric-icon income-icon">
                <ArrowDownLeft size={14} />
              </span>
              Income
            </p>
            <strong>$5,420.00</strong>
            <span>June total</span>
          </article>
          <article className="preview-metric">
            <p>
              <span className="metric-icon expense-icon">
                <ArrowUpRight size={14} />
              </span>
              Expenses
            </p>
            <strong>$2,184.35</strong>
            <span>June total</span>
          </article>
        </div>

        <div className="preview-lower-grid">
          <section className="preview-chart-area">
            <div className="preview-section-heading">
              <div>
                <h4>Cash flow</h4>
                <p>Income compared with spending</p>
              </div>
              <button type="button" aria-label="More cash flow options">
                <Ellipsis size={18} />
              </button>
            </div>
            <div className="preview-chart">
              <div className="chart-y-labels">
                <span>$6k</span>
                <span>$4k</span>
                <span>$2k</span>
                <span>$0</span>
              </div>
              <div className="chart-bars">
                {bars.map((bar) => (
                  <div className="chart-month" key={bar.label}>
                    <div className="chart-bar-pair">
                      <span
                        className="chart-bar chart-income"
                        style={{ height: `${bar.income}%` }}
                      />
                      <span
                        className="chart-bar chart-expense"
                        style={{ height: `${bar.expense}%` }}
                      />
                    </div>
                    <span className="chart-month-label">{bar.label}</span>
                  </div>
                ))}
              </div>
            </div>
            <div className="chart-legend">
              <span>
                <i className="legend-income" />
                Income
              </span>
              <span>
                <i className="legend-expense" />
                Expenses
              </span>
            </div>
          </section>

          <section className="preview-budget-area">
            <div className="preview-section-heading">
              <div>
                <h4>Monthly budgets</h4>
                <p>June overview</p>
              </div>
              <button type="button" aria-label="More budget options">
                <Ellipsis size={18} />
              </button>
            </div>
            <div className="budget-line">
              <div>
                <span>Food & dining</span>
                <b>
                  $420 <small>of $600</small>
                </b>
              </div>
              <span className="budget-track">
                <i style={{ width: "70%" }} />
              </span>
            </div>
            <div className="budget-line">
              <div>
                <span>Transport</span>
                <b>
                  $165 <small>of $300</small>
                </b>
              </div>
              <span className="budget-track">
                <i className="budget-track-teal" style={{ width: "55%" }} />
              </span>
            </div>
            <div className="budget-line">
              <div>
                <span>Home</span>
                <b>
                  $760 <small>of $900</small>
                </b>
              </div>
              <span className="budget-track">
                <i className="budget-track-gold" style={{ width: "84%" }} />
              </span>
            </div>
          </section>
        </div>

        <section className="preview-activity">
          <div className="preview-section-heading">
            <div>
              <h4>Recent activity</h4>
              <p>Your latest transactions</p>
            </div>
            <span className="preview-view-all">
              View all <span>↗</span>
            </span>
          </div>
          <div className="preview-activity-list">
            {activity.map((item) => (
              <div className="preview-activity-row" key={item.name}>
                <span className={`activity-dot ${item.type}`} />
                <div className="activity-name">
                  <b>{item.name}</b>
                  <span>{item.category}</span>
                </div>
                <time>{item.date}</time>
                <strong className={item.type}>{item.amount}</strong>
              </div>
            ))}
          </div>
        </section>
      </div>
      <div className="preview-caption">
        A sample look at your financial picture
      </div>
    </div>
  );
}
