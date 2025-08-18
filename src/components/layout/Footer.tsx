
import Link from "next/link";
import { Instagram, Youtube, ArrowRight } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

const TikTokIcon = (props: React.SVGProps<SVGSVGElement>) => (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="currentColor"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      {...props}
    >
      <path d="M12.525.02c1.31-.02 2.61-.01 3.91-.02.08 1.53.63 3.09 1.75 4.17 1.12 1.11 2.7 1.62 4.24 1.79v4.03c-1.44-.05-2.89-.35-4.2-.97-.57-.26-1.1-.59-1.62-.93-.01 2.92.01 5.84-.02 8.75-.08 1.4-.54 2.79-1.35 3.94-1.31 1.92-3.58 3.17-5.91 3.21-2.43.05-4.84-.95-6.43-2.8-1.59-1.87-2.15-4.24-1.72-6.59.35-1.89 1.17-3.57 2.45-4.88 1.4-1.49 3.25-2.39 5.23-2.5v4.03c-1.11.02-2.21.33-3.14.93-.62.4-1.16.9-1.59 1.48-.48.65-.8 1.39-1 2.16-.21.75-.25 1.58-.2 2.37.05.87.26 1.73.62 2.55.37.82.9 1.56 1.56 2.18.66.62 1.45 1.1 2.31 1.4.73.25 1.5.38 2.27.38.85 0 1.69-.16 2.49-.49.79-.33 1.51-.8 2.1-1.4.59-.6 1.05-1.3 1.38-2.09.32-.78.48-1.63.48-2.48.01-2.91-.01-5.83.01-8.74Z" />
    </svg>
  );

export function Footer() {
  const year = new Date().getFullYear();

  return (
    <footer className="bg-background border-t border-border/50">
      <div className="container mx-auto py-12 px-4 sm:px-6 lg:px-8">

        <div className="max-w-xl mx-auto text-center mb-12">
            <h3 className="font-headline text-2xl text-foreground mb-4">Stay Inspired</h3>
            <p className="text-foreground/70 mb-4">Join my newsletter to receive updates on new products, freebies, and creative tutorials straight to your inbox.</p>
            <form className="flex gap-2">
                <Input type="email" placeholder="Your Email" className="bg-card border-border/50 flex-grow" />
                <Button type="submit" size="icon" className="bg-accent text-accent-foreground hover:bg-accent/90 flex-shrink-0">
                    <ArrowRight />
                </Button>
            </form>
        </div>

        <div className="flex flex-col items-center justify-between md:flex-row gap-8">
          <Link href="/" className="flex items-center gap-2">
            <span className="font-headline text-2xl font-bold text-foreground">
              Ouiaan
            </span>
          </Link>
          <div className="flex space-x-6">
            <Link href="https://instagram.com/ouiaan" target="_blank" rel="noopener noreferrer" className="text-foreground/70 hover:text-accent transition-colors">
              <Instagram className="h-6 w-6" />
            </Link>
            <Link href="https://youtube.com/ouiaan" target="_blank" rel="noopener noreferrer" className="text-foreground/70 hover:text-accent transition-colors">
              <Youtube className="h-6 w-6" />
            </Link>
            <Link href="https://tiktok.com/@ouiaan" target="_blank" rel="noopener noreferrer" className="text-foreground/70 hover:text-accent transition-colors">
              <TikTokIcon className="h-5 w-5" />
            </Link>
          </div>
        </div>
        <div className="mt-8 text-center text-sm text-foreground/50">
          <p>&copy; {year} Ouiaan</p>
        </div>
      </div>
    </footer>
  );
}
