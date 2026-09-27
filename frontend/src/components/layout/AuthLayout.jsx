import { ScanSearch } from "lucide-react";

function AuthLayout({ children }) {
  return (
    <main className="min-h-screen bg-finance-bg px-4 py-10">
      <div className="mx-auto flex min-h-[calc(100vh-5rem)] w-full max-w-md flex-col justify-center">
        {/* Brand */}
        <div className="mb-8 flex items-center justify-center gap-3">
          <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-finance-gold text-finance-dark shadow-lg shadow-emerald-950/10">
            <ScanSearch className="h-6 w-6" />
          </div>

          <div>
            <h1 className="text-xl font-bold tracking-tight text-finance-dark">
              Akrio Resume Match
            </h1>

            <p className="text-xs text-finance-muted">
              Resume insights for your next opportunity
            </p>
          </div>
        </div>

        {/* Page Content */}
        <div className="rounded-3xl border border-emerald-950/5 bg-white p-8 shadow-xl shadow-emerald-950/5">
          {children}
        </div>

        {/* Footer */}
        <p className="mt-6 text-center text-xs text-finance-muted">
          © {new Date().getFullYear()} Akrio Resume Match
        </p>
      </div>
    </main>
  );
}

export default AuthLayout;
