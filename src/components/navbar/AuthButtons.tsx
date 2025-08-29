
import { Link } from 'react-router-dom';
import { User } from 'lucide-react';
import { Button } from '@/components/ui/button';

export const AuthButtons = () => {
  return (
    <>
      <Link to="/login">
        <Button variant="ghost" size="sm" className="gap-2 text-[#4F1964]">
          <User className="w-4 h-4" />
          <span>Entrar</span>
        </Button>
      </Link>
      <Link to="/register">
        <Button variant="default" size="sm" className="button-animation bg-[#4F1964] hover:bg-[#6B3182]">
          Registrar
        </Button>
      </Link>
    </>
  );
};
