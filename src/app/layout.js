import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import Header from "../components/layout/header/Header";
import Footer from "../components/layout/footer/Footer";
import ClientProviders from "@/components/providers/ClientProviders";
import AuthGate from "@/components/layout/authModal/AuthGate";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata = {
  title: "Where's Waldo",
  description: "Find Waldo in various challenging levels",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body className={`${geistSans.variable} ${geistMono.variable}`}>
        <ClientProviders>
          <Header />
          <AuthGate />

          {children}

          <Footer />
        </ClientProviders>
      </body>
    </html>
  );
}
