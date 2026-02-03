import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";

const inter = Inter({ subsets: ["latin"], variable: "--font-inter" });

export const metadata: Metadata = {
  title: "Строительный комплекс",
  description: "Лидер строительного рынка Кыргызстана с 1998 года. Жилые многоэтажные дома, коммерческие объекты, мосты и дороги. Более 1 000 000 м² построено. ИНН: 00412199810063",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="ru" className="scroll-smooth">
      <body className={`${inter.variable} font-sans antialiased`}>
        {children}
      </body>
    </html>
  );
}