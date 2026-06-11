import { Link } from "@tanstack/react-router";

export function AppHeader() {
  return (
    <header className="bg-surface border-b border-outline-variant w-full sticky top-0 z-50">
      <nav className="flex justify-between items-center w-full px-6 md:px-12 py-4 max-w-[1200px] mx-auto">
        <Link to="/" className="flex items-center gap-2">
          <span className="text-2xl">🚀</span>
          <span className="text-2xl font-bold text-primary">SwiftReturn AI</span>
        </Link>
        <div className="flex items-center gap-6">
          <a className="text-sm font-semibold text-on-surface-variant hover:text-primary" href="#">
            Help Center
          </a>
          <button className="p-2 rounded-full hover:bg-surface-container">
            <span className="text-on-surface-variant">👤</span>
          </button>
        </div>
      </nav>
    </header>
  );
}

export function AppFooter() {
  return (
    <footer className="bg-secondary-fixed w-full border-t border-outline-variant mt-auto">
      <div className="flex flex-col md:flex-row justify-between items-center w-full px-6 md:px-12 py-6 max-w-[1200px] mx-auto">
        <div className="flex flex-col gap-1 mb-4 md:mb-0">
          <span className="text-sm font-bold text-on-secondary-fixed">SwiftReturn AI</span>
          <p className="text-sm text-on-secondary-fixed-variant">
            © 2026 SwiftReturn AI. Secure & Encrypted.
          </p>
        </div>
        <div className="flex gap-6">
          <a className="text-sm text-on-secondary-fixed-variant hover:underline" href="#">Contact Support</a>
          <a className="text-sm text-on-secondary-fixed-variant hover:underline" href="#">Privacy Policy</a>
          <a className="text-sm text-on-secondary-fixed-variant hover:underline" href="#">Terms of Service</a>
        </div>
      </div>
    </footer>
  );
}
