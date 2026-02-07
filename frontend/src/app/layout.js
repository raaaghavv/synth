import { Geist } from "next/font/google";
import "./globals.css";
import Sidebar from "@/components/Sidebar";
import PlayerBar from "@/components/PlayerBar";
import Providers from "@/components/Providers";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

export const metadata = {
  title: "Synth - Music Player",
  description: "A minimal music streaming experience",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body className={`${geistSans.variable} antialiased`}>
        <Providers>
          <div className="h-screen flex flex-col">
            {/* Main area: Sidebar + Content */}
            <div className="flex flex-1 min-h-0">
              <Sidebar />
              <main className="flex-1 overflow-y-auto bg-linear-to-b from-[#1e1e1e] to-background p-6">
                {children}
              </main>
            </div>
            {/* Fixed Player Bar */}
            <PlayerBar />
          </div>
        </Providers>
      </body>
    </html>
  );
}
