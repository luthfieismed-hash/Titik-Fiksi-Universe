import type { Metadata, Viewport } from "next"; 
import { Inter } from "next/font/google";
import "./globals.css";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Titik Fiksi Universe",
  description: "Platform baca novel modern, ringan, dan elegan.",
  manifest: "/manifest.webmanifest", 
};

export const viewport: Viewport = {
  themeColor: "#ffffff", 
  width: "device-width",
  initialScale: 1,
  maximumScale: 1, 
  userScalable: false, 
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="id" className="overflow-x-hidden">
      <body className={`${inter.className} bg-gray-50 text-gray-900 w-full overflow-x-hidden antialiased flex flex-col min-h-screen`}>
        <Navbar />
        <main className="flex-grow w-full">{children}</main>
        <Footer />
      </body>
    </html>
  );
}