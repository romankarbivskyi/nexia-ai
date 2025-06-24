import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Nexia AI - Free Multi-Model AI Chat & Image Generation",
  description:
    "Nexia AI is a free, advanced chat platform supporting a range of AI models for intelligent conversations and image generation.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={`antialiased`}>{children}</body>
    </html>
  );
}
