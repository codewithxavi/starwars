import type { Metadata } from "next";
import localFont from "next/font/local";
import "./globals.css";

const geistSans = localFont({
  src: "./fonts/GeistVF.woff",
  variable: "--font-geist-sans",
  weight: "100 900",
});
const geistMono = localFont({
  src: "./fonts/GeistMonoVF.woff",
  variable: "--font-geist-mono",
  weight: "100 900",
});

export const metadata: Metadata = {
  title: "Star Wars Info",
  description: "A Star Wars character information app",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
      <html lang="en">
      <body className={`${geistSans.variable} ${geistMono.variable} antialiased flex flex-col min-h-screen`}>
      <div className="flex-grow">
        {children}
      </div>
      <footer className="text-center p-4 text-gray-300 border-t border-gray-700">
        <p className="text-sm">
          Made with <span className="text-red-500">❤️</span> by <a href="https://github.com/codewithxavi"
                                                                   className="text-blue-400 hover:underline">@codewithxavi</a>,
          developed with <span className="text-blue-400">Next.js</span> & <span
            className="text-blue-400">Tailwind CSS</span>
        </p>
      </footer>
      </body>
      </html>
  );
}
