// app/layout.tsx
import { Providers } from "@/components/Providers";
import "./globals.css"; // your global styles

export const metadata = {
  title: "ParlAI",
  description: "your AI assistant any every level",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body suppressHydrationWarning={true}>
        <script
          dangerouslySetInnerHTML={{
            __html: `(() => {
  try {
    const stored = localStorage.getItem('theme');
    const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
    const theme = stored || (prefersDark ? 'dark' : 'light');
    const root = document.documentElement;
    if (theme === 'dark') {
      root.classList.add('dark');
    } else {
      root.classList.remove('dark');
    }
  } catch (_) {}
})();`,
          }}
        />
        <Providers>
          {children}
        </Providers>
      </body>
    </html>
  );
}
