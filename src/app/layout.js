import { Inter } from "next/font/google";
import "./globals.css";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { ClerkProvider } from "@clerk/nextjs";

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
});

export const metadata = {
  title: "UPT BKN Tarakan - Website Resmi",
  description: "Website Publik Resmi Unit Pelaksana Teknis Badan Kepegawaian Negara (UPT BKN) Tarakan.",
  openGraph: {
    title: "UPT BKN Tarakan - Website Resmi",
    description: "Website Publik Resmi Unit Pelaksana Teknis Badan Kepegawaian Negara (UPT BKN) Tarakan.",
    url: "https://uptbkntarakan.vercel.app",
    siteName: "UPT BKN Tarakan",
    images: [
      {
        url: "https://images.unsplash.com/photo-1577495508048-b635879837f1?auto=format&fit=crop&q=80", 
        width: 1200,
        height: 630,
        alt: "UPT BKN Tarakan",
      },
    ],
    locale: "id_ID",
    type: "website",
  },
};

export default function RootLayout({ children }) {
  return (
    <html lang="id" className={`${inter.variable} h-full antialiased`}>
      <body className="min-h-full flex flex-col relative bg-canvas text-ink">
        <ClerkProvider>
          {/* CSS Noise Overlay */}
          <svg
            className="noise-overlay"
            xmlns="http://www.w3.org/2000/svg"
          >
            <filter id="noiseFilter">
              <feTurbulence 
                type="fractalNoise" 
                baseFrequency="0.8" 
                numOctaves="3" 
                stitchTiles="stitch"
              />
            </filter>
            <rect width="100%" height="100%" filter="url(#noiseFilter)" />
          </svg>

          <Header />
          <main className="flex-1 pt-32 pb-16">
            {children}
          </main>
          <Footer />
        </ClerkProvider>
      </body>
    </html>
  );
}
