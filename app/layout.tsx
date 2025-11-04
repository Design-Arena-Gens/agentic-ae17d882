import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Construction Expense Manager",
  description:
    "Track construction project budgets, spending, and financial health in real time."
};

export default function RootLayout({
  children
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className="bg-slate-50 text-slate-900">
        <div className="min-h-screen">
          {children}
        </div>
      </body>
    </html>
  );
}
