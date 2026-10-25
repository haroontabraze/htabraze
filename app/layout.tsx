import type { Metadata } from "next";
import Link from "next/link";
import "./globals.css";
import "./think-tax.css";

export const metadata: Metadata = {
  title: "Haroon Tabraze | Learning and Tax Education",
  description: "Learning resources, professional education and Think Tax by Haroon Tabraze, PhD, FCA, CIPA."
};

const links = [
  ["Home", "/"],
  ["Learning platform", "/learning"],
  ["Think Tax", "/think-tax"],
  ["Blog", "/blog"],
  ["About", "/about"]
];

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en">
      <body>
        <header className="site-header">
          <Link className="brand" href="/" aria-label="Haroon Tabraze home">
            <span className="brand-mark">HT</span>
            <span>Haroon Tabraze</span>
          </Link>
          <nav className="public-nav" aria-label="Main navigation">
            {links.map(([label, href]) => <Link href={href} key={href}>{label}</Link>)}
          </nav>
          <div className="header-actions">
            <Link className="text-link sign-in" href="/dashboard">Sign in</Link>
            <Link className="button button-small" href="/learning">Learning platform</Link>
          </div>
        </header>
        <main>{children}</main>
        <footer className="site-footer">
          <span>Haroon Tabraze</span>
          <span>Learning, taxation and professional education.</span>
          <Link href="/blog">Read the blog</Link>
        </footer>
      </body>
    </html>
  );
}
