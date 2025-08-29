
import React, { useState } from 'react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Filter, CheckCircle, BookOpen, Search, X } from 'lucide-react';

interface FilterDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  areas: string[];
  onFilterChange: (area: string) => void;
}

export const FilterDialog: React.FC<FilterDialogProps> = ({
  open,
  onOpenChange,
  areas,
  onFilterChange,
}) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedArea, setSelectedArea] = useState<string | null>(null);

  const filteredAreas = areas.filter(area => 
    area.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleAreaSelect = (area: string) => {
    setSelectedArea(area);
    onFilterChange(area);
  };

  const handleClearFilter = () => {
    setSelectedArea(null);
    onFilterChange('all');
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl max-h-[80vh] bg-white/95 backdrop-blur-sm border-0 shadow-2xl rounded-3xl">
        <DialogHeader className="pb-6">
          <DialogTitle className="flex items-center gap-3 text-2xl font-bold bg-gradient-to-r from-purple-600 to-blue-600 bg-clip-text text-transparent">
            <div className="flex items-center justify-center w-12 h-12 rounded-2xl bg-gradient-to-r from-purple-500 to-blue-500 text-white shadow-lg">
              <Filter className="w-6 h-6" />
            </div>
            Filtrar por Área do Direito
          </DialogTitle>
        </DialogHeader>
        
        <div className="space-y-6">
          <div className="bg-gradient-to-r from-purple-50 to-blue-50 p-6 rounded-2xl border border-purple-100">
            <p className="text-gray-700 leading-relaxed text-lg">
              Selecione uma área específica para focar seus estudos ou escolha "Todas as áreas" para ver todas as questões disponíveis.
            </p>
          </div>

          {/* Search Bar */}
          <div className="relative">
            <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
            <Input
              placeholder="Pesquisar área do direito..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-12 pr-4 py-3 text-lg border-2 border-gray-200 rounded-xl focus:border-purple-400 focus:ring-4 focus:ring-purple-100 transition-all duration-200"
            />
            {searchTerm && (
              <button
                onClick={() => setSearchTerm('')}
                className="absolute right-4 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
              >
                <X className="w-5 h-5" />
              </button>
            )}
          </div>
          
          <ScrollArea className="max-h-96">
            <div className="space-y-4">
              {/* All Areas Option */}
              <Button
                variant="outline"
                onClick={() => handleAreaSelect('all')}
                className={`w-full justify-start text-left p-6 rounded-2xl border-2 transition-all duration-300 ${
                  selectedArea === null || selectedArea === 'all'
                    ? 'border-purple-400 bg-gradient-to-r from-purple-50 to-blue-50 shadow-lg'
                    : 'border-gray-200 hover:bg-purple-50 hover:border-purple-300'
                }`}
              >
                <CheckCircle className="w-6 h-6 mr-4 text-purple-500 flex-shrink-0" />
                <div className="flex-1">
                  <span className="font-semibold text-lg text-gray-800">Todas as áreas</span>
                  <p className="text-sm text-gray-600 mt-1">Ver todas as questões disponíveis</p>
                </div>
                <Badge variant="secondary" className="ml-auto bg-purple-100 text-purple-700 px-3 py-1 rounded-full font-semibold">
                  {areas.length} áreas
                </Badge>
              </Button>
              
              <div className="h-px bg-gradient-to-r from-purple-200 to-blue-200 my-6"></div>
              
              <div className="space-y-3">
                <h4 className="text-lg font-bold text-gray-800 px-2 mb-4 flex items-center gap-2">
                  <BookOpen className="w-5 h-5 text-purple-500" />
                  Áreas Disponíveis:
                </h4>
                {filteredAreas.sort().map((area) => (
                  <Button
                    key={area}
                    variant="outline"
                    onClick={() => handleAreaSelect(area)}
                    className={`w-full justify-start text-left p-6 rounded-2xl border-2 transition-all duration-300 ${
                      selectedArea === area
                        ? 'border-purple-400 bg-gradient-to-r from-purple-50 to-blue-50 shadow-lg'
                        : 'border-gray-200 hover:bg-purple-50 hover:border-purple-300'
                    }`}
                  >
                    <BookOpen className="w-5 h-5 mr-4 text-purple-500 flex-shrink-0" />
                    <span className="text-lg font-medium text-gray-800">{area}</span>
                  </Button>
                ))}
                {filteredAreas.length === 0 && (
                  <div className="text-center py-8">
                    <p className="text-gray-500 text-lg">Nenhuma área encontrada</p>
                    <p className="text-gray-400 text-sm mt-2">Tente um termo diferente</p>
                  </div>
                )}
              </div>
            </div>
          </ScrollArea>
          
          <div className="flex justify-between items-center pt-6 border-t border-gray-200">
            {selectedArea && selectedArea !== 'all' && (
              <Button
                variant="outline"
                onClick={handleClearFilter}
                className="text-purple-600 border-purple-200 hover:bg-purple-50 font-medium px-6 py-2 rounded-xl"
              >
                Limpar Filtro
              </Button>
            )}
            <div className="flex-1"></div>
            <Button
              variant="ghost"
              onClick={() => onOpenChange(false)}
              className="text-gray-600 hover:bg-gray-100 font-medium px-6 py-2 rounded-xl"
            >
              Fechar
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};
