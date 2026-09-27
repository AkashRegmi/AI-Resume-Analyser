export default function Footer() {
  return (
    <footer className=" absolute border-t border-emerald-950/10 bg-white px-6 py-5 bottom-0">
      <div className="mx-auto flex max-w-7xl items-center justify-center ">
        <p className="text-xs text-finance-muted">
          © {new Date().getFullYear()} Akrio Resume Match. All rights reserved.
        </p>
      </div>
    </footer>
  );
}
