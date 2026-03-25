import './globals.css';
import Link from 'next/link';
import { Toaster } from 'react-hot-toast';

export const metadata = {
  title: 'SportsSphere | Chameli Devi Group of Institutions',
  description: 'Sports Management System',
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <head>
        <link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;800&display=swap" rel="stylesheet" />
      </head>
      <body>
        <Toaster position="bottom-right" toastOptions={{ style: { background: '#131a26', color: '#fff', border: '1px solid rgba(255,255,255,0.1)' } }} />
        <nav className="navbar">
          <Link href="/" className="nav-brand">
            <span className="nav-brand-title">SportsSphere</span>
            <span className="subtitle">CDGI Athletics Portal</span>
          </Link>
          <div className="nav-links">
            <Link href="/" className="nav-link">Home</Link>
            <Link href="/sports" className="nav-link">Sports</Link>
            <Link href="/login" className="btn-secondary" style={{ padding: '8px 16px', fontSize: '0.85rem' }}>Login</Link>
          </div>
        </nav>
        <main>
          {children}
        </main>
      </body>
    </html>
  );
}
