
import React from 'react';
import Navbar from './navbar/Navbar';
import { cn } from '@/lib/utils';

interface LayoutProps {
  children: React.ReactNode;
  className?: string;
}

export const Layout = ({
  children,
  className
}: LayoutProps) => {
  return (
    <div className={cn("min-h-screen flex flex-col", className)}>
      <Navbar />
      {/* Add proper spacing to account for fixed navbar height */}
      <main className="flex-1 pt-20 py-[95px]">
        {children}
      </main>
      <footer className="border-t py-6 bg-background/50">
        <div className="container mx-auto px-6 flex flex-col md:flex-row justify-between items-center">
          <p className="text-sm text-foreground/60">© 2024 Juridica. Todos os direitos reservados.</p>
          <div className="flex gap-6 mt-4 md:mt-0">
            <a href="#" className="text-sm text-foreground/60 hover:text-primary">Termos</a>
            <a href="#" className="text-sm text-foreground/60 hover:text-primary">Privacidade</a>
            <a href="#" className="text-sm text-foreground/60 hover:text-primary">Contato</a>
          </div>
        </div>
      </footer>
    </div>
  );
};
