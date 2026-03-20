import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "GTM Canon - API recommendations for sales agents",
  description:
    "Mert Iseri's recommended APIs for AI agents doing sales and GTM work. One line in your CLAUDE.md and your agent knows which tool to call.",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className="min-h-screen antialiased">
        <nav className="border-b border-[var(--card-border)] px-6 py-4">
          <div className="mx-auto max-w-4xl flex items-center justify-between">
            <a href="/" className="text-xl font-bold tracking-tight">
              GTM Canon
            </a>
            <div className="flex items-center gap-6 text-sm text-[var(--muted)]">
              <a href="/#api" className="hover:text-[var(--foreground)] transition-colors">
                API
              </a>
              <a href="/#hook" className="hover:text-[var(--foreground)] transition-colors">
                Add to your agent
              </a>
              <a href="/#categories" className="hover:text-[var(--foreground)] transition-colors">
                Categories
              </a>
            </div>
          </div>
        </nav>
        <main className="mx-auto max-w-4xl px-6 py-12">{children}</main>
        <footer className="border-t border-[var(--card-border)] px-6 py-8 text-center text-sm text-[var(--muted)]">
          <p>
            GTM Canon by{" "}
            <a
              href="https://www.linkedin.com/in/merthilmiiseri/"
              className="hover:text-[var(--foreground)] transition-colors underline"
              target="_blank"
              rel="noopener noreferrer"
            >
              Mert Iseri
            </a>
          </p>
        </footer>
      </body>
    </html>
  );
}
