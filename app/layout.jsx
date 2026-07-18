import './globals.css';
import { Space_Grotesk } from 'next/font/google';
import { HexagonPattern } from '../components/ui/hexagon-pattern';

const spaceGrotesk = Space_Grotesk({ subsets: ['latin'] });

export const metadata = {
  title: 'CryptoLens | Advanced Steganography',
  description: 'Military-grade secure steganography tool',
};

export default function RootLayout({ children }) {
  return (
    <html lang="en" className="dark">
      <body className={`${spaceGrotesk.className} font-sans antialiased bg-black text-gray-100 min-h-screen flex flex-col selection:bg-brand-500/30 selection:text-brand-200 relative overflow-x-hidden`}>
        <div className="fixed inset-0 z-0 pointer-events-none">
          <HexagonPattern
            className="opacity-100 stroke-brand-500/40 fill-brand-500/5"
            radius={45}
            gap={4}
          />
          <div className="absolute inset-0 bg-black/60 [mask-image:radial-gradient(ellipse_at_center,transparent_20%,black)]" />
        </div>
        <div className="relative z-10 flex flex-col flex-1">
          {children}
        </div>
      </body>
    </html>
  );
}
