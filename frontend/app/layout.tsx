import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { Toaster } from "react-hot-toast";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "OpenMic AI Intake Agent - Medical Domain",
  description: "AI-powered medical intake agent with OpenMic API integration",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <div className="min-h-screen bg-gray-50 flex flex-col">
          <div className="flex-1">{children}</div>
          <footer className="border-t border-gray-200 bg-white">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 text-center text-sm text-gray-600">
              Made by Raunak Agarwal 🐦‍🔥
            </div>
          </footer>
        </div>
        <Toaster position="top-right" />
      </body>
    </html>
  );
}
