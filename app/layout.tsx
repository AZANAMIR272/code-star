import type { Metadata } from "next";
import { Archivo_Black, Inter } from "next/font/google";
import { ReportProvider } from "@/components/modules/ReportStore";
import "./globals.css";

const inter = Inter({ subsets: ["latin"], variable: "--font-inter" });
const archivo = Archivo_Black({ weight: "400", subsets: ["latin"], variable: "--font-archivo" });

export const metadata: Metadata = {
  title: {
    default: "CODE STAR — Crack the code",
    template: "%s | CODE STAR",
  },
  description:
    "CODE STAR reads your repo once — DNA Profiler, Cold Cases, Mood Ring, Food Chain and a 3D City map of your codebase.",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={`${inter.variable} ${archivo.variable} font-sans antialiased`}>
        <ReportProvider>{children}</ReportProvider>
      </body>
    </html>
  );
}
