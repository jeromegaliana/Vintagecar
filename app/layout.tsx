import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Vintage Car Generator",
  description: "Generate stunning views of vintage sports cars from the 40s-50s",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="fr">
      <body className="antialiased">
        {children}
      </body>
    </html>
  );
}
