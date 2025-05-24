import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { Analytics } from "@vercel/analytics/next"

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
  display: "swap",
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
  display: "swap",
});

export const metadata = {
  title: "Weather Along — Plan Your Travel With Real-time Weather Insights",
  description:
    "See the weather along your journey, not just at one destination. Plan smarter with real-time forecasts for every stop on your route.",
  keywords: [
    "travel weather",
    "weather along route",
    "road trip weather",
    "forecast on journey",
    "travel planning",
    "route weather map",
  ],
  metadataBase: new URL(`${process.env.URL}`), // replace with your real domain
  openGraph: {
    title: "Weather Along",
    description:
      "Get weather updates for every segment of your travel route. Real-time, location-based weather forecasts for smarter journeys.",
    url: `${process.env.URL}`,
    siteName: "Weather Along",
    images: [
      {
        url: `${process.env.URL}/preview.jpg`, // update this
        width: 1200,
        height: 630,
        alt: "Weather Along App Preview",
      },
    ],
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Weather Along – Plan Travel With Weather Awareness",
    description:
      "Plan your trip with weather forecasts at every stop. Visualize how weather evolves as you move.",
    images: ["/preview.jpg"], // 👈 again here
  },
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <head>
        <meta charSet="utf-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="" />
      </head>
      <body className={`${geistSans.variable} ${geistMono.variable} antialiased`}>
        {children}
        <Analytics />
      </body>
    </html>
  );
}
