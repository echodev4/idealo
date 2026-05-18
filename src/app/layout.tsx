// app/layout.tsx
import type { Metadata } from "next";
import "./globals.css";
import { VisualEditsMessenger } from "orchids-visual-edits";
import { LanguageProvider } from "@/contexts/language-context";
import SiteChrome from "@/components/common/site-chrome";
import { Toaster } from "react-hot-toast";



export const metadata: Metadata = {
  title: "Idealo - The No.1 Price Comparison Platform",
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
          <SiteChrome>{children}</SiteChrome>
          <Toaster position="top-right" />
        </LanguageProvider>
        <VisualEditsMessenger />
      </body>
    </html>
  );
}
