import './globals.css';
import type { Metadata } from 'next';
import { Toaster } from 'react-hot-toast';

export const metadata: Metadata = {
  title: 'Personal Finance Q&A System',
  description: 'Ask finance-related questions and get professional advice',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <head>
        <link rel="stylesheet" href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;700&display=swap" />
      </head>
      <body>
        {children}
        <Toaster position="top-right" />
      </body>
    </html>
  );
}