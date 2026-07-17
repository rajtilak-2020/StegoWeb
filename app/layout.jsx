import './globals.css';
import { Space_Grotesk } from 'next/font/google';

const spaceGrotesk = Space_Grotesk({ subsets: ['latin'] });

export const metadata = {
  title: 'CryptoLens | Advanced Steganography',
  description: 'Military-grade secure steganography tool',
};

export default function RootLayout({ children }) {
  return (
    <html lang="en" className="dark">
      <body className={`${spaceGrotesk.className} font-sans antialiased bg-black text-gray-100 min-h-screen flex flex-col selection:bg-brand-500/30 selection:text-brand-200`}>
        {children}
      </body>
    </html>
  );
}
