
import { useState, useEffect } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { cn } from '@/lib/utils';
import { NavLinks } from './NavLinks';
import { AuthButtons } from './AuthButtons';
import { UserMenu } from './UserMenu';
import { useAuthStatus } from './useAuthStatus';

const Navbar = () => {
  const [scrolled, setScrolled] = useState(false);
  const navigate = useNavigate();
  const { isLoggedIn, userEmail, userType } = useAuthStatus();

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 10);
    };
    
    window.addEventListener('scroll', handleScroll);
    
    return () => {
      window.removeEventListener('scroll', handleScroll);
    };
  }, []);

  const scrollToSection = (id: string) => {
    const element = document.getElementById(id);
    if (element) {
      element.scrollIntoView({
        behavior: 'smooth'
      });
    } else {
      navigate('/');
      setTimeout(() => {
        const newElement = document.getElementById(id);
        if (newElement) newElement.scrollIntoView({
          behavior: 'smooth'
        });
      }, 100);
    }
  };

  return (
    <header className={cn('fixed top-0 left-0 right-0 z-50 py-4 transition-all duration-300 ease-in-out', scrolled ? 'bg-white/80 backdrop-blur-lg shadow-sm' : 'bg-transparent')}>
      <div className="container mx-auto px-6">
        <nav className="flex items-center justify-between">
          <Link to="/" className="font-semibold text-xl tracking-tight text-[#4F1964] flex items-center gap-2">
            <span>Menthor</span>
          </Link>
          
          <NavLinks isLoggedIn={isLoggedIn} scrollToSection={scrollToSection} />
          
          <div className="flex items-center gap-4">
            {isLoggedIn ? (
              <UserMenu userEmail={userEmail} userType={userType} />
            ) : (
              <AuthButtons />
            )}
          </div>
        </nav>
      </div>
    </header>
  );
};

export default Navbar;
