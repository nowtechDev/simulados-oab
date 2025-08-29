
import { Link, useLocation } from 'react-router-dom';
import { cn } from '@/lib/utils';
import { Book, PenLine } from 'lucide-react';

interface NavItem {
  name: string;
  path: string;
  icon: React.FC<{ className?: string }>;
  onClick?: () => void;
}

interface NavLinksProps {
  isLoggedIn: boolean;
  scrollToSection: (id: string) => void;
}

export const NavLinks = ({ isLoggedIn, scrollToSection }: NavLinksProps) => {
  const location = useLocation();
  const { pathname } = location;

  const navItems: NavItem[] = isLoggedIn ? [
    {
      name: 'Simulados',
      path: '/simulados',
      icon: Book
    }, 
    {
      name: 'Cadernos',
      path: '/cadernos2',
      icon: PenLine
    }
  ] : [
    {
      name: 'Recursos',
      path: '#recursos',
      icon: Book,
      onClick: () => scrollToSection('recursos')
    }, 
    {
      name: 'Planos',
      path: '#planos',
      icon: Book,
      onClick: () => scrollToSection('planos')
    }
  ];

  return (
    <div className="hidden md:flex items-center space-x-1">
      {navItems.map((item, index) => item.onClick ? (
        <button 
          key={index} 
          onClick={item.onClick} 
          className={cn(
            'px-4 py-2 rounded-lg flex items-center gap-2 transition-all', 
            pathname === item.path 
              ? 'text-[#4F1964] font-medium bg-[#F8E6FF]' 
              : 'text-foreground/80 hover:text-[#4F1964] hover:bg-[#F8E6FF]/50'
          )}
        >
          <item.icon className="w-4 h-4" />
          <span>{item.name}</span>
        </button>
      ) : (
        <Link 
          key={item.path} 
          to={item.path} 
          className={cn(
            'px-4 py-2 rounded-lg flex items-center gap-2 transition-all', 
            pathname === item.path 
              ? 'text-[#4F1964] font-medium bg-[#F8E6FF]' 
              : 'text-foreground/80 hover:text-[#4F1964] hover:bg-[#F8E6FF]/50'
          )}
        >
          <item.icon className="w-4 h-4" />
          <span>{item.name}</span>
        </Link>
      ))}
    </div>
  );
};
