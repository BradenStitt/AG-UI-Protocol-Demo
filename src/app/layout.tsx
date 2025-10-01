import type { Metadata } from "next";
import { Providers } from "@/components/providers";
import "./globals.css";

export const metadata: Metadata = {
  title: "Todo App",
  description: "AI-powered todo app with PydanticAI",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={"antialiased"} suppressHydrationWarning>
        <Providers>{children}</Providers>
      </body>
    </html>
  );
}
