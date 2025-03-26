import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { Navbar } from "@/components/Navbar";
import { InitialDataLoader } from "@/components/InitialDataLoader";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "HackPub - Create and Join Hackathons",
  description: "A platform for creating and participating in hackathons",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <InitialDataLoader>
          <div className="min-h-screen flex flex-col">
            <Navbar />
            <main className="flex-grow">
              {children}
            </main>
          </div>
        </InitialDataLoader>
      </body>
    </html>
  );
}
