import type { Metadata } from "next";
import "./globals.css";
import { Toaster } from "@/components/ui/sonner";
import Modal from "@/components/Modal";
import { ThemeProvider } from "@/components/ThemeProvider";

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
      <body>
        <ThemeProvider
          attribute="class"
          defaultTheme="system"
          enableSystem
          disableTransitionOnChange
        >
          <main>{children}</main>
          <Toaster />
          <Modal />
        </ThemeProvider>
      </body>
    </html>
  );
}
