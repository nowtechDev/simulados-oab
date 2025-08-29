
export interface Anotacao {
  id: string;
  conteudo: string;
  dataHora: string;
  iaAprimorado?: string;
}

export interface Caderno {
  id: number;
  titulo: string;
  materia: string;
  descricao: string;
  ultimaAtualizacao: string;
  anotacoes: Anotacao[];
  paginas: number;
}

export type MateriaJuridica = 
  | "Direito Constitucional" 
  | "Direito Civil" 
  | "Direito Penal" 
  | "Direito Administrativo" 
  | "Direito Processual Civil" 
  | "Direito Processual Penal" 
  | "Direito do Trabalho" 
  | "Direito Empresarial" 
  | "Direito Tributário" 
  | "Ética Profissional"
  | string; // Allow custom subject names
