import Link from "next/link";
import { siteContent } from "@/content/site";

export default function Nav() {
  const { nav } = siteContent;

  return (
    <header className="fixed top-0 left-0 w-full z-50 px-6 py-4 flex justify-between items-center bg-background/80 backdrop-blur-md">
      <Link href="/" className="text-xl font-bold font-sans">
        {nav.logo}
      </Link>
      <nav className="hidden md:flex space-x-8 items-center">
        {nav.links.map((link) => (
          <Link key={link.label} href={link.href} className="text-foreground hover:text-cyan transition-colors">
            {link.label}
          </Link>
        ))}
        <button className="bg-amber text-background px-4 py-2 rounded font-semibold hover:bg-amber/90 transition-colors">
          {nav.cta}
        </button>
      </nav>
    </header>
  );
}
