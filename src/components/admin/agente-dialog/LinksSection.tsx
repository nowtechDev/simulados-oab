
import React, { useState } from 'react';
import { UseFormReturn } from 'react-hook-form';
import { useToast } from '@/hooks/use-toast';
import { FormLabel } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Plus, X, Link } from 'lucide-react';
import { AgenteFormData } from './index';

interface LinksSectionProps {
  form: UseFormReturn<AgenteFormData>;
  watchedLinks: string[];
}

const LinksSection: React.FC<LinksSectionProps> = ({ form, watchedLinks }) => {
  const [newLink, setNewLink] = useState('');
  const { toast } = useToast();

  const addLink = () => {
    if (newLink.trim()) {
      try {
        new URL(newLink); // Valida URL
        const currentLinks = form.getValues('links');
        form.setValue('links', [...currentLinks, newLink.trim()]);
        setNewLink('');
      } catch (error) {
        toast({
          title: 'URL inválida',
          description: 'Por favor, insira uma URL válida.',
          variant: 'destructive',
        });
      }
    }
  };

  const removeLink = (index: number) => {
    const currentLinks = form.getValues('links');
    form.setValue('links', currentLinks.filter((_, i) => i !== index));
  };

  return (
    <div className="space-y-3">
      <FormLabel>Links de Consulta</FormLabel>
      <div className="flex gap-2">
        <Input
          placeholder="https://example.com"
          value={newLink}
          onChange={(e) => setNewLink(e.target.value)}
          onKeyPress={(e) => e.key === 'Enter' && (e.preventDefault(), addLink())}
        />
        <Button type="button" onClick={addLink} size="sm">
          <Plus className="h-4 w-4" />
        </Button>
      </div>
      {watchedLinks.length > 0 && (
        <div className="space-y-2">
          {watchedLinks.map((link, index) => (
            <div key={index} className="flex items-center gap-2 p-2 border rounded">
              <Link className="h-4 w-4 text-muted-foreground" />
              <span className="flex-1 text-sm truncate">{link}</span>
              <Button
                type="button"
                variant="ghost"
                size="sm"
                onClick={() => removeLink(index)}
                className="h-6 w-6 p-0"
              >
                <X className="h-3 w-3" />
              </Button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default LinksSection;
