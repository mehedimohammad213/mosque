import type { Metadata } from "next";
import { Figtree } from "next/font/google";
import { AuthProvider } from "@/components/AuthProvider";
import "./globals.css";

const figtree = Figtree({
  variable: "--font-figtree",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Mosque Admin",
  description: "Mosque management dashboard",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      data-scroll-behavior="smooth"
      className={`${figtree.variable} h-full antialiased`}
    >
      <body className="relative min-h-full font-[family-name:var(--font-body)] text-[var(--ink)]">
        <AuthProvider>{children}</AuthProvider>
      </body>
    </html>
  );
}
