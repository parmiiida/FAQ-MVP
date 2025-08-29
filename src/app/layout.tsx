// app/layout.tsx
import { Providers } from "@/components/Providers";
import "./globals.css"; // your global styles

export const metadata = {
  title: "My App",
  description: "Next.js version of my Vite app",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body suppressHydrationWarning={true}>
        <Providers>
          {children}
        </Providers>
      </body>
    </html>
  );
}
