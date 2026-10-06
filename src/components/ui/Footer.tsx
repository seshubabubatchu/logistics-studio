"use client";

import { siteContent } from "@/content/site";

export default function Footer() {
  const { footer } = siteContent;

  return (
    <footer className="w-full bg-background border-t border-white/10 px-6 py-12">
      <div className="max-w-7xl mx-auto flex flex-col md:flex-row justify-between items-start md:items-center gap-8">
        <div className="space-y-4">
          <p className="font-sans font-bold text-xl">Logistics Studio</p>
          <div className="text-sm text-foreground/70 space-y-2">
            <p>{footer.address}</p>
            <p>
              <a href={`mailto:${footer.email}`} className="hover:text-cyan transition-colors">{footer.email}</a>
            </p>
            <p>
              <a href={`tel:${footer.phone.replace(/[^0-9+]/g, "")}`} className="hover:text-cyan transition-colors">{footer.phone}</a>
            </p>
          </div>
        </div>
        <div className="space-y-4 text-sm text-foreground/70">
          <a href={footer.linkedin} target="_blank" rel="noopener noreferrer" className="block hover:text-cyan transition-colors">
            LinkedIn
          </a>
          <button className="block hover:text-cyan transition-colors text-left">
            {footer.newsletter}
          </button>
          <button
            onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
            className="block hover:text-cyan transition-colors text-left"
          >
            {footer.scrollTop}
          </button>
        </div>
      </div>
    </footer>
  );
}
