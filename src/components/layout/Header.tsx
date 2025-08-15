'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Menu, Film, ChevronDown } from 'lucide-react';
import { useState } from 'react';

import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from '@/components/ui/sheet';

const navLinks = [
  { href: '/', label: 'Home' },
  // Store is now a dropdown
  { href: '/freebies', label: 'Freebies' },
  { href: '/color-ai', label: 'Color AI' },
  { href: '/contact', label: 'Contact' },
];

export function Header() {
  const pathname = usePathname();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const NavLink = ({ href, label }: { href: string; label: string }) => (
    <Link href={href} passHref>
      <span
        className={cn(
          'font-headline uppercase tracking-wider text-sm transition-colors duration-300',
          pathname === href
            ? 'text-accent'
            : 'text-foreground/70 hover:text-foreground'
        )}
        onClick={() => setIsMobileMenuOpen(false)}
      >
        {label}
      </span>
    </Link>
  );

  return (
    <header className="sticky top-0 z-40 w-full bg-background/80 backdrop-blur-sm">
      <div className="container mx-auto flex h-20 items-center justify-between">
        <Link href="/" className="flex items-center gap-2">
          <Film className="h-6 w-6 text-accent" />
          <span className="font-headline text-2xl font-bold text-foreground">
            Ouiaan
          </span>
        </Link>

        {/* Desktop Navigation */}
        <nav className="hidden items-center gap-8 md:flex">
          <NavLink href="/" label="Home" />
          
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <button className={cn(
                'group flex items-center gap-1 font-headline uppercase tracking-wider text-sm transition-colors duration-300 outline-none',
                pathname.startsWith('/store')
                  ? 'text-accent'
                  : 'text-foreground/70 hover:text-foreground'
              )}>
                Store
                <ChevronDown className="h-4 w-4 transition-transform duration-200 group-data-[state=open]:rotate-180" />
              </button>
            </DropdownMenuTrigger>
            <DropdownMenuContent>
              <DropdownMenuItem asChild>
                <Link href="/store/photo">Photo</Link>
              </DropdownMenuItem>
              <DropdownMenuItem asChild>
                <Link href="/store/video">Video</Link>
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>

          {navLinks.slice(1).map((link) => ( // Render remaining links
            <NavLink key={link.href} {...link} />
          ))}
        </nav>

        {/* Mobile Navigation */}
        <div className="md:hidden">
          <Sheet open={isMobileMenuOpen} onOpenChange={setIsMobileMenuOpen}>
            <SheetTrigger asChild>
              <Button variant="ghost" size="icon" className="group">
                <Menu className="h-6 w-6 transition-transform duration-300 group-hover:rotate-6" />
                <span className="sr-only">Open menu</span>
              </Button>
            </SheetTrigger>
            <SheetContent side="right" className="w-[80vw] bg-background">
              <SheetHeader>
                <SheetTitle className="sr-only">Navigation</SheetTitle>
              </SheetHeader>
              <nav className="flex h-full flex-col items-center justify-center gap-10">
                <NavLink href="/" label="Home" />
                <NavLink href="/store/photo" label="Photo Store" />
                <NavLink href="/store/video" label="Video Store" />
                <NavLink href="/freebies" label="Freebies" />
                <NavLink href="/color-ai" label="Color AI" />
                <NavLink href="/contact" label="Contact" />
              </nav>
            </SheetContent>
          </Sheet>
        </div>
      </div>
    </header>
  );
}
