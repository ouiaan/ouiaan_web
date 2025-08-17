import Link from "next/link";
import { Instagram, Youtube, Twitter } from "lucide-react";

export function Footer() {
  const year = new Date().getFullYear();

  return (
    <footer className="bg-background border-t border-border/50">
      <div className="container mx-auto py-12 px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col items-center justify-between md:flex-row gap-8">
          <Link href="/" className="flex items-center gap-2">
            <span className="font-headline text-2xl font-bold text-foreground">
              Ouiaan
            </span>
          </Link>
          <div className="flex space-x-6">
            <Link href="#" className="text-foreground/70 hover:text-accent transition-colors">
              <Instagram className="h-6 w-6" />
            </Link>
            <Link href="#" className="text-foreground/70 hover:text-accent transition-colors">
              <Youtube className="h-6 w-6" />
            </Link>
            <Link href="#" className="text-foreground/70 hover:text-accent transition-colors">
              <Twitter className="h-6 w-6" />
            </Link>
          </div>
        </div>
        <div className="mt-8 text-center text-sm text-foreground/50">
          <p>&copy; {year} Ouiaan Studio. All Rights Reserved.</p>
        </div>
      </div>
    </footer>
  );
}
