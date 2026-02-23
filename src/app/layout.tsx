// app/layout.tsx
import type { Metadata } from "next";
import "./globals.css";
import { VisualEditsMessenger } from "orchids-visual-edits";
import { LanguageProvider } from "@/contexts/language-context";

export const metadata: Metadata = {
  title: "Price Comparison",
  description: "Find the best prices across categories.",
};

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en">
      <head>
        <meta name="viewport" content="width=device-width, initial-scale=1, maximum-scale=1" />
      </head>
      <body className="antialiased font-sans">
        <LanguageProvider>
          {children}
        </LanguageProvider>
        <VisualEditsMessenger />
      </body>
    </html>
  );
}