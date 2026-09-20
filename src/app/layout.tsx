import type { Metadata, Viewport } from "next";
import { Plus_Jakarta_Sans } from "next/font/google";
import "./globals.css";
import { Suspense } from "react";

const plusJakartaSans = Plus_Jakarta_Sans({ subsets: ["latin"] });

export const viewport: Viewport = {
  themeColor: "#000000",
  width: "device-width",
  initialScale: 1,
  maximumScale: 5,
};

export const metadata: Metadata = {
  metadataBase: new URL("https://yb.xyz"),
  title: {
    default: "YosiBreak | Stream Unlimited Movies & TV Shows Online Free",
    template: "%s | YosiBreak"
  },
  description: "Unlimited movies and TV shows for free. Inspired by Prime Video aesthetics, YosiBreak offers a premium streaming experience.",
  keywords: ["movies", "tv shows", "streaming", "free movies", "watch online", "yosibreak", "meowtv"],
  authors: [{ name: "YosiBreak Team" }],
  creator: "YosiBreak",
  publisher: "YosiBreak",
  referrer: "origin",
  icons: {
    icon: [
      { url: "/icon-192.png", sizes: "192x192", type: "image/png" },
      { url: "/icon-512.png", sizes: "512x512", type: "image/png" },
    ],
    shortcut: "/icon-192.png",
    apple: [
      { url: "/icon-192.png", sizes: "192x192", type: "image/png" },
    ],
  },
  openGraph: {
    type: "website",
    locale: "en_US",
    url: "https://yb.xyz",
    siteName: "YosiBreak",
    title: "YosiBreak | Stream Unlimited Movies & TV Shows Online Free",
    description: "Unlimited movies and TV shows for free. Premium streaming experience with no ads.",
    images: [
      {
        url: "/icon-512.png",
        width: 512,
        height: 512,
        alt: "YosiBreak Cinema",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "YosiBreak | Stream Unlimited Movies & TV Shows Online Free",
    description: "Unlimited movies and TV shows for free. Premium streaming experience.",
    images: ["/icon-512.png"],
    creator: "@yosibreak",
  },
  appleWebApp: {
    capable: true,
    statusBarStyle: "black-translucent",
    title: "YosiBreak Cinema",
  },
  formatDetection: {
    telephone: false,
  },
  verification: {
    google: "MFXUidrMrxwBxIyEzqURpd37qb60RTjPyxP8ZirR4KQ",
    yandex: "your-yandex-verification-code",
    yahoo: "your-yahoo-verification-code",
    // other: {
    //   me: ['my-email', 'my-link'],
    // },
  },
};

import Script from "next/script";
import PageTransition from "@/components/PageTransition";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { AuthProvider } from "@/components/auth/AuthProvider";

import ClientOnlyComponents from "@/components/ClientOnlyComponents";

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <head>
        <link rel="preconnect" href="https://image.tmdb.org" />
        <link rel="dns-prefetch" href="https://image.tmdb.org" />
        {/* Google Analytics */}
        <Script async src="https://www.googletagmanager.com/gtag/js?id=G-CSBPEBZBJF" strategy="afterInteractive" />
        <Script id="google-analytics" strategy="afterInteractive">
          {`
            window.dataLayer = window.dataLayer || [];
            function gtag(){dataLayer.push(arguments);}
            gtag('js', new Date());
            gtag('config', 'G-CSBPEBZBJF');
          `}
        </Script>

        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              "@context": "https://schema.org",
              "@type": "WebSite",
              "name": "YosiBreak",
              "url": "https://yb.xyz",
              "potentialAction": {
                "@type": "SearchAction",
                "target": "https://yb.xyz/search?q={search_term_string}",
                "query-input": "required name=search_term_string"
              }
            })
          }}
        />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              "@context": "https://schema.org",
              "@type": "Organization",
              "name": "YosiBreak",
              "url": "https://yb.xyz",
              "logo": "https://yb.xyz/icon-512.png"
            })
          }}
        />
      </head>
      <body suppressHydrationWarning className={`${plusJakartaSans.className} antialiased flex flex-col min-h-screen bg-prime-dark text-white relative`}>
        <AuthProvider>
          <Suspense fallback={null}>
            <Navbar />
          </Suspense>
          <div className="flex-grow relative z-10">
            <PageTransition>
              {children}
            </PageTransition>
          </div>
          <Footer />
          <ClientOnlyComponents />
        </AuthProvider>
      </body>
    </html>
  );
}
