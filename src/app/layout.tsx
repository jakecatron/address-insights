import type { Metadata } from "next";
import { Archivo } from "next/font/google";
import "./globals.css";

const archivo = Archivo({
  subsets: ["latin"],
  variable: "--font-archivo",
  display: "swap",
});

export const metadata: Metadata = {
  title: "Address Insights",
  description:
    "Walking score, driving score, and neighborhood insights for any address",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className="light">
      <body
        className={`${archivo.className} min-h-screen bg-[#f7f7f8] text-[#1a1a1a] antialiased`}
      >
        {children}
      </body>
    </html>
  );
}