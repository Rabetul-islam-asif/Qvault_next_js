import { Inter } from "next/font/google";
import "./globals.css";

const inter = Inter({ subsets: ["latin"] });

export const metadata = {
  title: {
    default: "QVault - Premium Academic Archive & Question Bank",
    template: "%s | QVault"
  },
  description: "QVault is the ultimate academic archive and question bank for students. Access past papers, course materials, and faculty profiles. Curated by Asif Rabetul.",
  keywords: ["QVault", "Academic Archive", "Question Bank", "Past Papers", "Course Materials", "University", "Education", "asif rabetul", "rabetul", "Asif Rabetul"],
  authors: [{ name: "Asif Rabetul" }],
  creator: "Asif Rabetul",
  publisher: "Asif Rabetul",
  metadataBase: new URL('https://qvault.netlify.app'), // Replace with actual domain if different
  alternates: {
    canonical: '/',
  },
  openGraph: {
    title: "QVault - Premium Academic Archive",
    description: "Access thousands of academic resources, past papers, and course materials. The smartest way to prepare for your exams.",
    url: 'https://qvault.netlify.app',
    siteName: 'QVault',
    images: [
      {
        url: '/og-image.png', // Ensure this image exists or use a placeholder
        width: 1200,
        height: 630,
        alt: 'QVault Preview',
      },
    ],
    locale: 'en_US',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: "QVault - Academic Archive",
    description: "The ultimate academic resource for students. Past papers, materials, and more.",
    creator: "@asifrabetul", // Optional: Add actual handle if available
    images: ['/og-image.png'],
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },
  icons: {
    icon: '/favicon.ico',
    shortcut: '/favicon.ico',
    apple: '/apple-touch-icon.png',
  },
  manifest: '/manifest.json',
  themeColor: '#4f46e5',
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <head>
        <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.4.0/css/all.min.css" />
      </head>
      <body className={inter.className}>
        {children}
      </body>
    </html>
  );
}
