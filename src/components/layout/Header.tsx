'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { ChevronDown } from 'lucide-react';

import { cn } from '@/lib/utils';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';

const navLinks = [
  { href: '/', label: 'Home' },
  { href: '/store', label: 'Store' },
  { href: '/freebies', label: 'Freebies' },
  { href: '/color-ai', label: 'Color AI' },
  { href: '/contact', label: 'Contact' },
];

export function Header() {
  const pathname = usePathname();

  const NavLink = ({ href, label }: { href: string; label: string }) => (
    <Link href={href} passHref>
      <span
        className={cn(
          'font-headline uppercase tracking-wider text-sm transition-colors duration-300',
          pathname === href
            ? 'text-accent'
            : 'text-foreground/70 hover:text-foreground'
        )}
      >
        {label}
      </span>
    </Link>
  );

  return (
    <header className="sticky top-0 z-40 w-full bg-background/80 backdrop-blur-sm">
      <div className="container mx-auto flex h-20 items-center justify-between">
        <Link href="/" className="flex items-center gap-2">
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

          <NavLink href="/freebies" label="Freebies" />
          <NavLink href="/color-ai" label="Color AI" />
          <NavLink href="/contact" label="Contact" />
        </nav>

        {/* Mobile Navigation */}
        <nav className="flex items-center gap-4 md:hidden">
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
            <NavLink href="/contact" label="Contact" />
        </nav>
      </div>
    </header>
  );
}
