// app/layout.tsx
import type { Metadata } from "next";
import "./globals.css";
import { VisualEditsMessenger } from "orchids-visual-edits";
import { LanguageProvider } from "@/contexts/language-context";
import Header from "@/components/sections/header";
import Footer from "@/components/sections/footer";


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
          <Header />
          {children}
          <Footer />
        </LanguageProvider>
        <VisualEditsMessenger />
      </body>
    </html>
  );
}