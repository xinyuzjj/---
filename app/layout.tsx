import type { Metadata } from "next";
import { Bodoni_Moda, Jost, Inter, Manrope, Syncopate } from "next/font/google";
import "./globals.css";

const bodoniModa = Bodoni_Moda({
  variable: "--font-bodoni-moda",
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
});

const jost = Jost({
  variable: "--font-jost",
  subsets: ["latin"],
  weight: ["300", "400", "500", "600", "700"],
});

const inter = Inter({
  variable: "--font-main",
  subsets: ["latin"],
  weight: ["300", "400", "500", "600"],
});

const manrope = Manrope({
  variable: "--font-body",
  subsets: ["latin"],
  weight: ["200", "300", "400", "700"],
});

const syncopate = Syncopate({
  variable: "--font-tech",
  subsets: ["latin"],
  weight: ["400", "700"],
});

export const metadata: Metadata = {
  title: "资源分享站 | Premium Resource Hub",
  description: "精选优质资源分享平台 - 奢华体验，品质之选",
  keywords: ["资源分享", "设计素材", "实用工具", "游戏合集", "premium resources"],
  authors: [{ name: "峻峻尼" }],
  openGraph: {
    title: "资源分享站 | Premium Resource Hub",
    description: "精选优质资源分享平台 - 奢华体验，品质之选",
    type: "website",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="zh-CN">
      <body
        className={`${bodoniModa.variable} ${jost.variable} ${inter.variable} ${manrope.variable} ${syncopate.variable} antialiased`}
      >
        {children}
      </body>
    </html>
  );
}
