import { Caderno, Anotacao, MateriaJuridica } from "@/types/caderno";
import { v4 as uuidv4 } from "uuid";

// Lista de matérias jurídicas disponíveis
export const materias: MateriaJuridica[] = [
  "Direito Constitucional",
  "Direito Civil",
  "Direito Penal",
  "Direito Administrativo",
  "Direito Processual Civil",
  "Direito Processual Penal",
  "Direito do Trabalho",
  "Direito Empresarial",
  "Direito Tributário",
  "Ética Profissional"
];

// Dados de exemplo para os cadernos
const cadernosIniciais: Caderno[] = [
  {
    id: 1,
    titulo: "Direito Civil",
    materia: "Direito Civil",
    descricao: "Anotações sobre direito das obrigações e contratos",
    ultimaAtualizacao: "2 dias atrás",
    paginas: 24,
    anotacoes: [
      {
        id: uuidv4(),
        conteudo: "## Princípios Contratuais\n\nOs contratos são regidos pelos princípios da autonomia da vontade, da função social e da boa-fé objetiva.",
        dataHora: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString(),
        iaAprimorado: "## Princípios Contratuais\n\nOs contratos são regidos pelos seguintes princípios fundamentais:\n\n1. **Princípio da Autonomia da Vontade**: Permite que as partes estabeleçam livremente o conteúdo do contrato, desde que respeitados os limites legais.\n\n2. **Princípio da Função Social do Contrato**: Estabelecido no art. 421 do Código Civil, determina que a liberdade de contratar será exercida em razão e nos limites da função social do contrato.\n\n3. **Princípio da Boa-fé Objetiva**: Previsto no art. 422 do Código Civil, exige que as partes se comportem com honestidade, lealdade e probidade durante todas as fases contratuais.\n\n4. **Princípio da Força Obrigatória (Pacta Sunt Servanda)**: O contrato faz lei entre as partes, devendo ser cumprido conforme o acordado.\n\n5. **Princípio da Relatividade dos Efeitos**: Os efeitos do contrato, em regra, só atingem as partes contratantes.\n\nEstes princípios são essenciais para a interpretação jurisprudencial e para a resolução de conflitos contratuais."
      }
    ]
  },
  {
    id: 2,
    titulo: "Direito Constitucional",
    materia: "Direito Constitucional",
    descricao: "Resumos sobre direitos fundamentais e organização do Estado",
    ultimaAtualizacao: "5 dias atrás",
    paginas: 18,
    anotacoes: [
      {
        id: uuidv4(),
        conteudo: "# Direitos Fundamentais\n\nOs direitos fundamentais são classificados em gerações ou dimensões.",
        dataHora: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000).toISOString(),
        iaAprimorado: "# Direitos Fundamentais\n\nOs direitos fundamentais são classificados em gerações ou dimensões, representando a evolução histórica desses direitos:\n\n## 1ª Dimensão - Direitos Civis e Políticos\n- Surgimento: Século XVIII (Revoluções Americana e Francesa)\n- Característica principal: Liberdade\n- Exemplos: Direito à vida, liberdade, propriedade, igualdade formal, participação política\n- Exigem uma abstenção do Estado (prestação negativa)\n\n## 2ª Dimensão - Direitos Sociais, Econômicos e Culturais\n- Surgimento: Início do Século XX (Constituição Mexicana de 1917 e de Weimar de 1919)\n- Característica principal: Igualdade material\n- Exemplos: Direito à saúde, educação, trabalho, moradia, lazer\n- Exigem uma atuação positiva do Estado (prestação positiva)\n\n## 3ª Dimensão - Direitos de Solidariedade ou Fraternidade\n- Surgimento: Meados do Século XX (pós-Segunda Guerra Mundial)\n- Característica principal: Fraternidade\n- Exemplos: Direito ao meio ambiente equilibrado, autodeterminação dos povos, paz\n- Titularidade coletiva ou difusa\n\n## 4ª Dimensão - Direitos Relacionados à Biotecnologia\n- Surgimento: Final do Século XX e início do XXI\n- Exemplos: Direitos relacionados à manipulação genética, bioética\n\n## 5ª Dimensão - Direitos Virtuais\n- Surgimento: Século XXI\n- Exemplos: Direitos relacionados à internet, proteção de dados\n\n**Importante**: O STF reconhece a aplicação direta dos direitos fundamentais nas relações privadas (eficácia horizontal)."
      }
    ]
  },
  {
    id: 3,
    titulo: "Direito Penal",
    materia: "Direito Penal",
    descricao: "Teoria do crime e tipos penais específicos",
    ultimaAtualizacao: "1 semana atrás",
    paginas: 32,
    anotacoes: [
      {
        id: uuidv4(),
        conteudo: "# Teoria do Crime\n\nCrime é fato típico, ilícito e culpável.",
        dataHora: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString(),
        iaAprimorado: "# Teoria do Crime\n\nO conceito analítico de crime, adotado majoritariamente pela doutrina brasileira, define crime como fato típico, ilícito e culpável:\n\n## 1. Fato Típico\nCompreende quatro elementos:\n\n- **Conduta**: Ação ou omissão voluntária direcionada a um fim\n- **Resultado**: Modificação no mundo exterior causada pela conduta\n- **Nexo Causal**: Relação de causa e efeito entre conduta e resultado\n- **Tipicidade**: Adequação da conduta ao modelo previsto na lei penal\n\n## 2. Ilicitude (ou Antijuridicidade)\nÉ a contrariedade da conduta ao ordenamento jurídico, ausentes causas de justificação.\n\n**Causas de exclusão da ilicitude (art. 23 do CP)**:\n- Estado de necessidade\n- Legítima defesa\n- Estrito cumprimento do dever legal\n- Exercício regular de direito\n- Consentimento do ofendido (causa supralegal)\n\n## 3. Culpabilidade\nÉ o juízo de reprovação que recai sobre o autor do fato típico e ilícito.\n\n**Elementos da culpabilidade**:\n- **Imputabilidade**: Capacidade de entender o caráter ilícito do fato e de determinar-se de acordo com esse entendimento\n- **Potencial consciência da ilicitude**: Possibilidade de o agente conhecer o caráter ilícito de sua conduta\n- **Exigibilidade de conduta diversa**: Possibilidade de se exigir do agente comportamento conforme o direito\n\n**Observação**: Há correntes finalista (dominante) e causalista, que divergem quanto à posição do dolo e da culpa (no fato típico ou na culpabilidade)."
      }
    ]
  },
  {
    id: 4,
    titulo: "Direito Administrativo",
    materia: "Direito Administrativo",
    descricao: "Princípios administrativos e atos administrativos",
    ultimaAtualizacao: "3 dias atrás",
    paginas: 15,
    anotacoes: [
      {
        id: uuidv4(),
        conteudo: "# Princípios da Administração Pública\n\nA Administração Pública obedece aos princípios da legalidade, impessoalidade, moralidade, publicidade e eficiência.",
        dataHora: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000).toISOString(),
        iaAprimorado: "# Princípios da Administração Pública\n\n## Princípios Expressos (art. 37, caput, CF - LIMPE)\n\n1. **Legalidade**: A Administração só pode fazer o que a lei autoriza ou determina. Diferente da legalidade para o particular, que pode fazer tudo o que a lei não proíbe.\n\n2. **Impessoalidade**: A atuação administrativa deve ser destinada a todos os cidadãos, sem discriminação ou favorecimentos. Possui duas vertentes:\n   - Finalística: Os atos devem visar o interesse público, não o privado\n   - Vedação à promoção pessoal: Proibição de vinculação de atos à imagem do agente público\n\n3. **Moralidade**: Exige atuação ética, honesta e de boa-fé dos agentes públicos.\n\n4. **Publicidade**: Os atos administrativos devem ser amplamente divulgados, garantindo transparência e controle. Exceções: segurança nacional, investigações e intimidade.\n\n5. **Eficiência**: Busca por resultados satisfatórios, otimizando recursos e garantindo qualidade.\n\n## Princípios Implícitos (Importantes)\n\n1. **Supremacia do Interesse Público**: O interesse coletivo prevalece sobre o particular.\n\n2. **Indisponibilidade do Interesse Público**: A Administração não pode dispor livremente dos interesses públicos.\n\n3. **Autotutela**: Poder de anular atos ilegais e revogar atos inconvenientes (Súmula 473 STF).\n\n4. **Razoabilidade e Proporcionalidade**: Adequação entre meios e fins, com medidas proporcionais.\n\n5. **Segurança Jurídica**: Estabilidade das relações jurídicas.\n\nO desrespeito a estes princípios pode configurar improbidade administrativa, nos termos da Lei nº 8.429/92."
      }
    ]
  },
  {
    id: 5,
    titulo: "Direito Processual Civil",
    materia: "Direito Processual Civil",
    descricao: "Princípios e procedimentos do processo civil brasileiro",
    ultimaAtualizacao: "4 dias atrás",
    paginas: 20,
    anotacoes: []
  },
  {
    id: 6,
    titulo: "Direito Processual Penal",
    materia: "Direito Processual Penal",
    descricao: "Procedimentos e princípios do processo penal",
    ultimaAtualizacao: "6 dias atrás",
    paginas: 18,
    anotacoes: []
  },
  {
    id: 7,
    titulo: "Direito do Trabalho",
    materia: "Direito do Trabalho",
    descricao: "Relações trabalhistas e direitos dos trabalhadores",
    ultimaAtualizacao: "1 semana atrás",
    paginas: 22,
    anotacoes: []
  },
  {
    id: 8,
    titulo: "Direito Empresarial",
    materia: "Direito Empresarial",
    descricao: "Sociedades empresárias e títulos de crédito",
    ultimaAtualizacao: "2 semanas atrás",
    paginas: 15,
    anotacoes: []
  },
  {
    id: 9,
    titulo: "Direito Tributário",
    materia: "Direito Tributário",
    descricao: "Sistema tributário nacional e impostos",
    ultimaAtualizacao: "1 semana atrás",
    paginas: 18,
    anotacoes: []
  },
  {
    id: 10,
    titulo: "Ética Profissional",
    materia: "Ética Profissional",
    descricao: "Código de Ética e disciplina da OAB",
    ultimaAtualizacao: "3 dias atrás",
    paginas: 12,
    anotacoes: []
  }
];

// Flag para controlar se já foi feita a inicialização
const INITIALIZATION_KEY = 'cadernos_initialized';

// Função para garantir que os cadernos iniciais existam APENAS na primeira vez
const garantirCadernosIniciais = () => {
  const cadernosStorage = localStorage.getItem('cadernos');
  const isInitialized = localStorage.getItem(INITIALIZATION_KEY);
  
  // Se já foi inicializado antes, apenas retorna os cadernos existentes
  if (isInitialized) {
    return cadernosStorage ? JSON.parse(cadernosStorage) : [];
  }
  
  // Se não tem cadernos E nunca foi inicializado, criar os iniciais
  if (!cadernosStorage) {
    localStorage.setItem('cadernos', JSON.stringify(cadernosIniciais));
    localStorage.setItem(INITIALIZATION_KEY, 'true');
    return cadernosIniciais;
  }
  
  // Marcar como inicializado e retornar os cadernos existentes
  localStorage.setItem(INITIALIZATION_KEY, 'true');
  return JSON.parse(cadernosStorage);
};

// Função auxiliar para disparar evento de atualização
const dispatchCadernoUpdateEvent = () => {
  console.log("Dispatching caderno update event");
  const event = new Event('cadernoUpdated');
  window.dispatchEvent(event);
  
  // Também disparar um evento storage para garantir compatibilidade
  const storageEvent = new StorageEvent('storage', {
    key: 'cadernos',
    newValue: localStorage.getItem('cadernos'),
    url: window.location.href
  });
  window.dispatchEvent(storageEvent);
};

// Função para obter todos os cadernos
export const getCadernos = (): Caderno[] => {
  return garantirCadernosIniciais();
};

// Função para obter um caderno específico
export const getCaderno = (id: number): Caderno | undefined => {
  const cadernos = getCadernos();
  return cadernos.find(caderno => caderno.id === id);
};

// Função para adicionar uma anotação a um caderno
export const adicionarAnotacao = (cadernoId: number, conteudo: string): Anotacao => {
  const cadernos = getCadernos();
  const cadernoIndex = cadernos.findIndex(c => c.id === cadernoId);
  
  if (cadernoIndex === -1) {
    throw new Error(`Caderno com ID ${cadernoId} não encontrado`);
  }
  
  const novaAnotacao: Anotacao = {
    id: uuidv4(),
    conteudo,
    dataHora: new Date().toISOString()
  };
  
  cadernos[cadernoIndex].anotacoes.push(novaAnotacao);
  cadernos[cadernoIndex].ultimaAtualizacao = "Agora";
  cadernos[cadernoIndex].paginas = cadernos[cadernoIndex].anotacoes.length;
  
  localStorage.setItem('cadernos', JSON.stringify(cadernos));
  dispatchCadernoUpdateEvent();
  
  return novaAnotacao;
};

// Função para atualizar uma anotação com o conteúdo aprimorado pela IA
export const atualizarAnotacaoIA = (cadernoId: number, anotacaoId: string, iaAprimorado: string): Anotacao => {
  const cadernos = getCadernos();
  const cadernoIndex = cadernos.findIndex(c => c.id === cadernoId);
  
  if (cadernoIndex === -1) {
    throw new Error(`Caderno com ID ${cadernoId} não encontrado`);
  }
  
  const anotacaoIndex = cadernos[cadernoIndex].anotacoes.findIndex(a => a.id === anotacaoId);
  
  if (anotacaoIndex === -1) {
    throw new Error(`Anotação com ID ${anotacaoId} não encontrada`);
  }
  
  cadernos[cadernoIndex].anotacoes[anotacaoIndex].iaAprimorado = iaAprimorado;
  cadernos[cadernoIndex].ultimaAtualizacao = "Agora";
  
  localStorage.setItem('cadernos', JSON.stringify(cadernos));
  dispatchCadernoUpdateEvent();
  
  return cadernos[cadernoIndex].anotacoes[anotacaoIndex];
};

// Função para adicionar um novo caderno
export const adicionarCaderno = (titulo: string, materia: MateriaJuridica, descricao: string): Caderno => {
  const cadernos = getCadernos();
  
  const novoCaderno: Caderno = {
    id: Math.max(0, ...cadernos.map(c => c.id)) + 1,
    titulo,
    materia,
    descricao,
    ultimaAtualizacao: "Agora",
    paginas: 0,
    anotacoes: []
  };
  
  cadernos.push(novoCaderno);
  localStorage.setItem('cadernos', JSON.stringify(cadernos));
  dispatchCadernoUpdateEvent();
  
  return novoCaderno;
};

// Função para deletar um caderno
export const deletarCaderno = (id: number): boolean => {
  console.log("Deleting caderno, id:", id);
  
  const cadernos = getCadernos();
  const cadernosFiltrados = cadernos.filter(c => c.id !== id);
  
  if (cadernosFiltrados.length === cadernos.length) {
    console.log("Caderno not found for deletion");
    return false; // Caderno não encontrado
  }
  
  localStorage.setItem('cadernos', JSON.stringify(cadernosFiltrados));
  dispatchCadernoUpdateEvent();
  
  return true;
};

// Função para editar um caderno
export const editarCaderno = (id: number, novoTitulo: string): boolean => {
  console.log("Editing caderno, id:", id, "new title:", novoTitulo);
  
  const cadernos = getCadernos();
  const cadernoIndex = cadernos.findIndex(c => c.id === id);
  
  if (cadernoIndex === -1) {
    console.log("Caderno not found for editing");
    return false; // Caderno não encontrado
  }
  
  cadernos[cadernoIndex].titulo = novoTitulo;
  cadernos[cadernoIndex].ultimaAtualizacao = "Agora";
  
  localStorage.setItem('cadernos', JSON.stringify(cadernos));
  dispatchCadernoUpdateEvent();
  
  return true;
};
