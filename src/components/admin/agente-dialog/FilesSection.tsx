
import React, { useState } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import { FormLabel } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Upload, FileText, X } from 'lucide-react';

interface FilesSectionProps {
  uploadedFiles: any[];
  setUploadedFiles: React.Dispatch<React.SetStateAction<any[]>>;
}

const FilesSection: React.FC<FilesSectionProps> = ({ uploadedFiles, setUploadedFiles }) => {
  const [isUploading, setIsUploading] = useState(false);
  const { toast } = useToast();

  const handleFileUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = event.target.files;
    if (!files || files.length === 0) return;

    const allowedTypes = [
      'application/pdf',
      'text/plain',
      'application/msword',
      'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
      'application/vnd.ms-excel',
      'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
      'text/csv',
      'application/vnd.ms-powerpoint',
      'application/vnd.openxmlformats-officedocument.presentationml.presentation',
      'application/json'
    ];

    setIsUploading(true);

    try {
      const { data: { session } } = await supabase.auth.getSession();
      if (!session?.user) throw new Error('Usuário não autenticado');

      const uploadPromises = Array.from(files).map(async (file) => {
        if (!allowedTypes.includes(file.type)) {
          toast({
            title: 'Tipo de arquivo não suportado',
            description: `O arquivo ${file.name} não é suportado.`,
            variant: 'destructive',
          });
          return null;
        }

        const fileName = `${Date.now()}-${file.name}`;
        const filePath = `${session.user.id}/${fileName}`;

        const { data, error } = await supabase.storage
          .from('agente-arquivos')
          .upload(filePath, file);

        if (error) throw error;

        return {
          name: file.name,
          path: data.path,
          size: file.size,
          type: file.type,
        };
      });

      const results = await Promise.all(uploadPromises);
      const validFiles = results.filter(Boolean);
      
      setUploadedFiles(prev => [...prev, ...validFiles]);
      
      toast({
        title: 'Upload concluído',
        description: `${validFiles.length} arquivo(s) enviado(s) com sucesso.`,
      });
    } catch (error) {
      console.error('Erro no upload:', error);
      toast({
        title: 'Erro no upload',
        description: 'Ocorreu um erro ao enviar os arquivos.',
        variant: 'destructive',
      });
    } finally {
      setIsUploading(false);
      event.target.value = '';
    }
  };

  const removeFile = async (index: number) => {
    const file = uploadedFiles[index];
    try {
      // Remove do storage
      const { error } = await supabase.storage
        .from('agente-arquivos')
        .remove([file.path]);

      if (error) throw error;

      setUploadedFiles(prev => prev.filter((_, i) => i !== index));
      
      toast({
        title: 'Arquivo removido',
        description: 'O arquivo foi removido com sucesso.',
      });
    } catch (error) {
      console.error('Erro ao remover arquivo:', error);
      toast({
        title: 'Erro ao remover arquivo',
        description: 'Ocorreu um erro ao remover o arquivo.',
        variant: 'destructive',
      });
    }
  };

  return (
    <div className="space-y-3">
      <FormLabel>Arquivos de Base</FormLabel>
      <div className="flex items-center gap-2">
        <Input
          type="file"
          multiple
          accept=".pdf,.txt,.doc,.docx,.xls,.xlsx,.csv,.ppt,.pptx,.json"
          onChange={handleFileUpload}
          disabled={isUploading}
          className="hidden"
          id="file-upload"
        />
        <Button
          type="button"
          variant="outline"
          onClick={() => document.getElementById('file-upload')?.click()}
          disabled={isUploading}
          className="gap-2"
        >
          <Upload className="h-4 w-4" />
          {isUploading ? 'Enviando...' : 'Adicionar Arquivos'}
        </Button>
      </div>
      <p className="text-xs text-muted-foreground">
        Tipos aceitos: PDF, TXT, Word, Excel, PowerPoint, JSON
      </p>
      {uploadedFiles.length > 0 && (
        <div className="space-y-2">
          {uploadedFiles.map((file, index) => (
            <div key={index} className="flex items-center gap-2 p-2 border rounded">
              <FileText className="h-4 w-4 text-muted-foreground" />
              <span className="flex-1 text-sm">{file.name}</span>
              <Badge variant="secondary" className="text-xs">
                {(file.size / 1024).toFixed(1)} KB
              </Badge>
              <Button
                type="button"
                variant="ghost"
                size="sm"
                onClick={() => removeFile(index)}
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

export default FilesSection;
