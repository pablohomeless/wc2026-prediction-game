import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { Providers } from "./providers";
import { Navbar } from "@/components/Navbar";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Porra Mundial 2026 ⚽",
  description: "FIFA World Cup 2026 USA/MEX/CAN Prediction Game",
  icons: { icon: "/favicon.ico" },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body className={`${inter.className} min-h-screen flex flex-col`}>
        <Providers>
          <Navbar />
          <main className="flex-1 container mx-auto px-4 py-6 max-w-7xl">
            {children}
          </main>
          <footer className="bg-wc-darkblue text-white text-center py-4 text-sm">
            <p>
              ⚽ Porra Mundial 2026 — FIFA World Cup USA/MEX/CAN |{" "}
              <a href="/rules" className="text-wc-gold hover:underline">Rules</a>
            </p>
          </footer>
        </Providers>
      </body>
    </html>
  );
}
