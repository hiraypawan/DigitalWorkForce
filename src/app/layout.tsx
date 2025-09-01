import type { Metadata } from "next";
import { Inter } from "next/font/google";
import SessionProvider from '@/components/SessionProvider';
import { ThemeProvider } from '@/contexts/ThemeContext';
import "./globals.css";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Digital Workforce",
  description: "Connecting skilled employees with companies for micro-tasks.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <ThemeProvider>
          <SessionProvider>
            {children}
          </SessionProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}
