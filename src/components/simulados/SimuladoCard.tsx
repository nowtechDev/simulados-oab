
import React from 'react';
import { useNavigate } from 'react-router-dom';
import SimuladoActions from './SimuladoActions';

type SimuladoCardProps = {
  simulado: any;
  onUpdate: () => void;
  isAdmin: boolean;
  className?: string;
};

const SimuladoCard = ({ simulado, onUpdate, isAdmin, className = '' }: SimuladoCardProps) => {
  const navigate = useNavigate();
  
  const handleClick = () => {
    if (simulado?.customClickHandler) {
      simulado.customClickHandler();
    } else if (simulado?.path && simulado.path !== '#') {
      navigate(simulado.path);
    }
  };
  
  // If simulado is undefined or null, return a placeholder or nothing
  if (!simulado) {
    return null;
  }

  // Determine if this is a Segunda Fase card and should display the area
  const isSegundaFase = simulado.phase === 'segunda';
  
  // Map area code to a display name if it exists
  const getAreaDisplay = () => {
    if (!simulado.area) return '';
    
    const areaMap = {
      direito_administrativo: 'Direito Administrativo',
      direito_civil: 'Direito Civil',
      direito_constitucional: 'Direito Constitucional',
      direito_do_trabalho: 'Direito do Trabalho',
      direito_empresarial: 'Direito Empresarial',
      direito_penal: 'Direito Penal',
      direito_tributario: 'Direito Tributário'
    };
    
    return areaMap[simulado.area] || simulado.area;
  };
  
  return (
    <div 
      className={`bg-card text-card-foreground shadow rounded-lg p-6 relative group hover:bg-muted/50 transition-all duration-200 ${className}`}
    >
      {/* Admin actions */}
      <div className="absolute top-1 right-4 opacity-0 group-hover:opacity-100 transition-opacity">
        <SimuladoActions 
          simulado={simulado}
          onUpdate={onUpdate}
          isAdmin={isAdmin}
        />
      </div>
      
      <div className="flex flex-col space-y-2" onClick={handleClick} style={{cursor: 'pointer'}}>
        <div className="flex items-center justify-between">
          <span className="inline-flex items-center px-2.5 py-0.5 rounded text-xs font-medium bg-[#F8E6FF] text-[#4F1964]">
            {simulado.type === 'oab' ? 'OAB' : 
             simulado.type === 'fgv' ? 'FGV' : 'IA'}
          </span>
          <span className="text-xs text-muted-foreground">
            {simulado.difficulty === 'fácil' ? 'Fácil' : 
             simulado.difficulty === 'médio' ? 'Médio' : 'Difícil'}
          </span>
        </div>
        <h3 className="font-semibold text-lg">{simulado.title || 'Sem título'}</h3>
        <p className="text-sm text-foreground/70 line-clamp-2">{simulado.description || ''}</p>
        
        {isSegundaFase && simulado.area && (
          <div className="mt-1">
            <span className="text-xs px-2 py-1 bg-blue-50 text-blue-700 rounded-full">
              {getAreaDisplay()}
            </span>
          </div>
        )}
        
        <div className="flex items-center justify-between mt-2 text-sm text-muted-foreground">
          <span>{simulado.questions || 0} questões</span>
          <span>{simulado.duration || ''}</span>
        </div>
      </div>
    </div>
  );
};

export default SimuladoCard;
