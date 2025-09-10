// app/layout.tsx
import { Providers } from "@/components/Providers";
import "./globals.css";
import FloatingRobot from "@/components/homepage/FloatingRobot";

export const metadata = {
  title: "ParlAI",
  description: "Your AI assistant at every level",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body>
        <Providers>{children}</Providers>
      </body>
    </html>
  );
}
