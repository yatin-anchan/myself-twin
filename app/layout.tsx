import type { Metadata } from 'next';
import './globals.css';

export const metadata: Metadata = {
  title: 'Yatin — Digital Twin',
  description: 'A high-fidelity AI digital twin of Yatin Anil Anchan',
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}